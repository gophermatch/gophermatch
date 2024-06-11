import { db, tableNames } from './db.js';
import { queryRowsToArray, buildSelectString, buildInsertString, buildUpdateString, buildDeleteString } from './dbutils.js';
import { generateBlobSasUrl } from '../blobService.js';

/**
 * Retrieves the profile data of a given user by user ID.
 * 
 * @param {number} user_id - The ID of the user whose profile data is to be retrieved.
 * @returns {Promise<Object>} - A promise that resolves to the user's profile data, or an empty object if not found.
 */
export async function getProfile(user_id) {
    return new Promise((resolveProfile) => {
        const qr = `
        SELECT 
            u_userdata.user_id,
            u_userdata.first_name,
            u_userdata.last_name,
            u_userdata.major,
            u_userdata.graduating_year,
            u_bios.bio,
            JSON_ARRAY(u_apartment.rent, u_apartment.move_in_date, u_apartment.move_out_date) AS apartment_data,
            GROUP_CONCAT(DISTINCT CONCAT(u_tags.tag_id, ':', u_tags.tag_value) ORDER BY u_tags.tag_id SEPARATOR ', ') AS tags,
            u_pollquestions.question_text AS poll_question,
            JSON_ARRAY(qna.qna_data) AS qna,
            JSON_ARRAY(u_generaldata.wakeup_time, u_generaldata.sleep_time) AS sleep_schedule
        FROM 
            u_userdata
        LEFT JOIN 
            u_bios ON u_userdata.user_id = u_bios.user_id
        LEFT JOIN 
            u_apartment ON u_userdata.user_id = u_apartment.user_id
        LEFT JOIN 
            u_tags ON u_userdata.user_id = u_tags.user_id
        LEFT JOIN 
            u_pollquestions ON u_userdata.user_id = u_pollquestions.user_id
        LEFT JOIN 
            u_polloptions ON u_userdata.user_id = u_polloptions.user_id
        LEFT JOIN 
            (
                SELECT 
                    user_id,
                    JSON_ARRAYAGG(JSON_OBJECT('question_id', question_id, 'option_id', option_id)) AS qna_data
                FROM 
                    u_qna
                GROUP BY 
                    user_id
            ) AS qna ON u_userdata.user_id = qna.user_id
        LEFT JOIN 
            u_generaldata ON u_userdata.user_id = u_generaldata.user_id
        WHERE
            u_userdata.user_id = ${user_id}
        GROUP BY 
            u_userdata.user_id,
            u_userdata.first_name,
            u_userdata.last_name,
            u_userdata.major,
            u_userdata.graduating_year,
            u_bios.bio,
            u_apartment.rent,
            u_apartment.move_in_date,
            u_apartment.move_out_date,
            u_generaldata.wakeup_time,
            u_generaldata.sleep_time;
        `;

        db.query(qr, (err, rows) => {
            if (err) {
                resolveProfile({});
                return;
            }

            const profile = queryRowsToArray(rows);
            if (profile.length === 1) {
                resolveProfile(profile[0]);
            } else {
                resolveProfile({});
            }
        });
    });
}

/**
 * Creates and stores a profile in the database.
 * 
 * @param {number} user_id - The ID of the user whose profile is to be created.
 * @param {Object} profile - The profile data to be stored.
 * @returns {Promise<Object>} - A promise that resolves to the created profile object, or rejects with an error.
 */
export async function createBio(user_id, profile = {}) {
    return new Promise((resolve, reject) => {
        const qr = buildInsertString(tableNames.u_bios, { user_id, ...profile });

        db.query(qr.queryString, qr.values, (err, res) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") reject("Profile already exists");
                else reject(err);
                return;
            }
            if (res.affectedRows != 1) {
                reject({});
            } else {
                resolve({ user_id: res.insertId, ...profile });
            }
        });
    });
}

/**
 * Updates the profile of a given user.
 * 
 * @param {number} user_id - The ID of the user whose profile is to be updated.
 * @param {Object} profile - The new profile data to update.
 * @returns {Promise<void>} - A promise that resolves when the profile is updated, or rejects with an error.
 */
export async function updateProfile(user_id, profile) {
    return new Promise(async (resolve, reject) => {
        const { qnaAnswers, ...profileData } = profile;

        try {
            if (Object.keys(profileData).length > 0) {
                const updateQuery = buildUpdateString(tableNames.u_bios, { user_id }, profileData);
                console.log(updateQuery);
                await db.query(updateQuery.queryString, updateQuery.values);
            }

            for (const { question_id, option_id } of qnaAnswers) {
                const existingAnswerPromise = new Promise((resolveQuery, rejectQuery) => {
                    const qr = buildSelectString("*", tableNames.u_qna, { user_id, question_id });
                    db.query(qr.queryString, qr.values, (err, rows) => {
                        if (err) {
                            rejectQuery(err);
                        } else {
                            resolveQuery(rows);
                        }
                    });
                });

                let existingAnswer;
                try {
                    existingAnswer = await existingAnswerPromise;
                } catch (error) {
                    reject(error);
                    return;
                }

                let qnaUpdateQuery;
                if (existingAnswer && existingAnswer.length > 0) {
                    qnaUpdateQuery = buildUpdateString(tableNames.u_qna, { user_id, question_id }, { option_id });
                } else {
                    qnaUpdateQuery = buildInsertString(tableNames.u_qna, { user_id, question_id, option_id });
                }

                await db.query(qnaUpdateQuery.queryString, qnaUpdateQuery.values);
            }

            resolve();
        } catch (error) {
            reject(error);
        }
    });
}

/**
 * Updates the apartment-specific Q&A data for a given user.
 * 
 * @param {number} user_id - The ID of the user whose apartment data is to be updated.
 * @param {Object} apartmentData - The new apartment data to update.
 * @returns {Promise<void>} - A promise that resolves when the apartment data is updated, or rejects with an error.
 */
export async function updateApartmentInfo(user_id, apartmentData) {
    return new Promise(async (resolve, reject) => {
        try {
            const existCheck = buildSelectString("*", "u_apartment", { user_id });
            db.query(existCheck.queryString, existCheck.values, async (err, existResult) => {
                if (err) {
                    console.error("Error checking apartment existence:", err);
                    reject(err);
                    return;
                }

                if (existResult && existResult.length > 0) {
                    const updateQuery = buildUpdateString("u_apartment", { user_id }, apartmentData);
                    await db.query(updateQuery.queryString, updateQuery.values);
                } else {
                    const insertQuery = buildInsertString("u_apartment", { user_id, ...apartmentData });
                    await db.query(insertQuery.queryString, insertQuery.values);
                }

                resolve();
            });
        } catch (error) {
            console.error("Database operation failed:", error);
            reject(error);
        }
    });
}

/**
 * Retrieves all user IDs from the database.
 * 
 * @returns {Promise<Array>} - A promise that resolves to an array of user IDs.
 */
export async function getAllUserIds() {
    return new Promise((resolve, reject) => {
        const qr = buildSelectString("user_id", tableNames.users, {});

        db.query(qr.queryString, qr.values, (err, rows) => {
            if (err) {
                console.error("Error fetching user IDs from database:", err);
                reject(err);
                return;
            }

            const userIds = rows.map(row => row.user_id);
            resolve(userIds);
        });
    });
}

/**
 * Saves the picture URL for a user.
 * 
 * @param {number} user_id - The ID of the user.
 * @param {string} pictureUrl - The URL of the picture to be saved.
 * @param {number} pic_number - The picture number for the user.
 * @returns {Promise<Object>} - A promise that resolves when the picture URL is saved, or rejects with an error.
 */
export async function savePictureUrl(user_id, pictureUrl, pic_number) {
    return new Promise((resolve, reject) => {
        const qr = `INSERT INTO u_pictures (user_id, picture_url, pic_number) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE picture_url = VALUES(picture_url);`;

        db.query(qr, [user_id, pictureUrl, pic_number], (err, result) => {
            if (err) {
                console.error("Error saving picture URL to database:", err);
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

/**
 * Retrieves all picture URLs for a given user.
 * 
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of SAS URLs for the user's pictures.
 */
export async function retrievePictureUrls(user_id) {
    return new Promise((resolve, reject) => {
        const queryString = `SELECT picture_url, pic_number FROM ${tableNames.u_pictures} WHERE user_id = ?`;

        db.query(queryString, [user_id], (err, rows) => {
            if (err) {
                console.error("Error fetching picture URLs from database:", err);
                reject(err);
                return;
            }

            const sasUrlPromises = rows.map(row => {
                const urlParts = row.picture_url.split('/');
                const blobName = urlParts[urlParts.length - 1];
                return generateBlobSasUrl(blobName);
            });

            Promise.all(sasUrlPromises)
                .then(sasUrls => resolve(sasUrls))
                .catch(error => reject(error));
        });
    });
}

/**
 * Removes a picture for a given user and reorders the remaining pictures.
 * 
 * @param {number} user_id - The ID of the user.
 * @param {number} pic_number - The picture number to be removed.
 * @returns {Promise<void>} - A promise that resolves when the picture is removed and reordered, or rejects with an error.
 */
export async function removePicture(user_id, pic_number) {
    try {
        const { queryString, values } = buildDeleteString(tableNames.u_pictures, {
            user_id: user_id,
            pic_number: pic_number
        });

        await db.query(queryString, values);

        await db.query('UPDATE u_pictures SET pic_number = pic_number - 1 WHERE user_id = ? AND pic_number > ?', [user_id, pic_number], (error, results) => {
            if (error) {
                console.error('Error reordering pictures:', error);
            } else {
                console.log("Successfully reordered pictures");
            }
        });

        console.log(`Deleted picture ${pic_number} for user_id=${user_id}.`);
    } catch (error) {
        console.error('Error in removePicture:', error);
        throw new Error('Failed to remove picture');
    }
}

/**
 * Inserts or updates the top five responses for a given user.
 * 
 * @param {number} user_id - The ID of the user.
 * @param {string} question - The question for the top five.
 * @param {string} input1 - The first input.
 * @param {string} input2 - The second input.
 * @param {string} input3 - The third input.
 * @param {string} input4 - The fourth input.
 * @param {string} input5 - The fifth input.
 * @returns {Promise<void>} - A promise that resolves when the top five responses are inserted or updated, or rejects with an error.
 */
export async function insertTopFive(user_id, question, input1, input2, input3, input4, input5) {
    try {
        const query = `
            INSERT INTO ${tableNames.u_topfive} (user_id, question, input1, input2, input3, input4, input5)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
            question = VALUES(question),
            input1 = VALUES(input1),
            input2 = VALUES(input2),
            input3 = VALUES(input3),
            input4 = VALUES(input4),
            input5 = VALUES(input5);
        `;
        await db.query(query, [user_id, question, input1, input2, input3, input4, input5]);
    } catch (err) {
        console.log("error happened");
        console.error('Error in insertTopFive:', err);
        throw err;
    }
}

/**
 * Retrieves the top five responses for a given user.
 * 
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Object|null>} - A promise that resolves to the top five responses, or null if not found.
 */
export async function getTopFive(user_id) {
    return new Promise((resolve, reject) => {
        console.log(user_id);
        const query = `SELECT question, input1, input2, input3, input4, input5 FROM ${tableNames.u_topfive} WHERE user_id = ?`;

        db.query(query, [user_id], (err, results) => {
            if (err) {
                console.error("Error getting top five", err);
                reject(err);
                return;
            }

            if (results.length > 0) {
                console.log("bruh");
                resolve(results[0]);
            } else {
                console.log("what");
                resolve(null);
            }
        });
    });
}
