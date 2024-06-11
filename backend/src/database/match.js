import { db, tableNames } from './db.js'; // Your database connection setup
import { queryRowsToArray, buildSelectString, buildInsertString, buildUpdateString, buildDeleteString } from './dbutils.js';
import qnaOptions from '../../../frontend/src/components/ui-components/qnaOptions.json' assert { type: 'json' };
import { getUserData } from "./account.js";
import { getProfile } from "./profile.js";

/**
 * Records a user's decision regarding another user (match, reject, unsure).
 * 
 * @param {number} user1Id - The ID of the first user.
 * @param {number} user2Id - The ID of the second user.
 * @param {string} decision - The decision made by the first user.
 * @returns {Promise<Object>} - A promise that resolves to an object indicating if a match was found or if the decision was recorded.
 */
export async function recordUserDecision(user1Id, user2Id, decision) {
    try {
        const insertDecisionQuery = `
            INSERT INTO ${tableNames.u_matches} (user_id, match_user_id, match_status) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE match_status = VALUES(match_status);
        `;
        await db.query(insertDecisionQuery, [user1Id, user2Id, decision]);

        const result = await checkMatch(user1Id, user2Id);
        const user1_id = Math.min(user1Id, user2Id);
        const user2_id = Math.max(user1Id, user2Id);
        if (decision === 'match' && result.length > 0) {
            handleReciprocalMatch(user1_id, user2_id);
            return { matchFound: true, message: "It's a match!" };
        }
        return { matchFound: false, message: "Decision recorded. Waiting for the other user." };
    } catch (error) {
        console.error('Error in recordUserDecision:', error);
        throw new Error('Failed to record user decision');
    }
}

/**
 * Removes all 'reject' decisions for a given user.
 * 
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<void>} - A promise that resolves when all 'reject' decisions are removed.
 */
export async function unrejectAll(user_id) {
    try {
        const unrejectQuery = `
            DELETE FROM ${tableNames.u_matches}
            WHERE user_id = ${user_id} AND match_status = 'reject';
        `;
        await db.query(unrejectQuery);
    } catch (error) {
        console.error('Error in unrejectAll:', error);
        throw new Error('Failed to unrejectAll');
    }
}

/**
 * Checks if two users have mutually liked each other.
 * 
 * @param {number} user1Id - The ID of the first user.
 * @param {number} user2Id - The ID of the second user.
 * @returns {Promise<Array>} - A promise that resolves to an array of match statuses.
 */
async function checkMatch(user1Id, user2Id) {
    return new Promise((resolve, reject) => {
        const { queryString, values } = buildSelectString("match_status", tableNames.u_matches, {
            user_id: user2Id,
            match_user_id: user1Id,
            match_status: 'match'
        });

        db.query(queryString, values, (err, results) => {
            if (err) {
                console.error("Error fetching match status from database:", err);
                reject(err);
                return;
            }
            resolve(results);
        });
    });
}

/**
 * Handles the logic for a reciprocal match.
 * 
 * @param {number} user1Id - The ID of the first user.
 * @param {number} user2Id - The ID of the second user.
 * @returns {Promise<void>} - A promise that resolves when the match is handled.
 */
async function handleReciprocalMatch(user1Id, user2Id) {
    try {
        const insertMatchQuery = `
            INSERT INTO ${tableNames.u_inboxt} (user1_id, user2_id)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE match_timestamp = VALUES(match_timestamp);
        `;
        await db.query(insertMatchQuery, [user1Id, user2Id]);
        // Additional logic here (e.g., notifying users of the match).
    } catch (error) {
        console.error('Error in handleReciprocalMatch:', error);
        throw new Error('Failed to handle reciprocal match');
    }
}

/**
 * Retrieves user IDs based on provided filters.
 * 
 * @param {Object} filters - The filters to apply to the query.
 * @returns {Promise<Array>} - A promise that resolves to an array of user IDs.
 */
export async function getFilterResults(filters) {
    return new Promise((resolve, reject) => {
        let queryString = `SELECT DISTINCT user_id FROM ${tableNames.u_userdata}`;
        const whereConditions = [];

        Object.entries(filters).forEach(([key, options]) => {
            if (Object.keys(options).length > 0) {
                const conditions = Object.keys(options).map(option => `${key} = '${option}'`);
                whereConditions.push(`(${conditions.join(' OR ')})`);
            }
        });

        if (whereConditions.length > 0) {
            queryString += ` WHERE ${whereConditions.join(' AND ')}`;
        }

        db.query(queryString, (err, rows) => {
            if (err) {
                console.error("Error querying filter results from database:", err);
                reject(err);
                return;
            }
            const userIds = rows.map(row => row.user_id);
            resolve(userIds);
        });
    });
}

/**
 * Retrieves all user IDs that a specified user has interacted with.
 * 
 * @param {number} user_id - The ID of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of user IDs.
 */
export async function getInteractedProfiles(user_id) {
    return new Promise((resolve, reject) => {
        const { queryString, values } = buildSelectString("match_user_id", tableNames.u_matches, {
            user_id: user_id
        });

        db.query(queryString, values, (err, rows) => {
            if (err) {
                console.error("Error fetching user IDs from database:", err);
                reject(err);
                return;
            }
            const saveIds = rows.map(row => row.match_user_id);
            resolve(saveIds);
        });
    });
}

/**
 * Retrieves user IDs based on Q&A filter options.
 * 
 * @param {Array} optionIds - The option IDs to filter by.
 * @returns {Promise<Array>} - A promise that resolves to an array of user IDs.
 */
export async function getFilterResultsQna(optionIds) {
    return new Promise((resolve, reject) => {
        if (!optionIds || optionIds.length === 0) {
            db.query(`SELECT DISTINCT user_id FROM u_qna`, [], (err, rows) => {
                if (err) {
                    console.error("Error querying all user_ids from u_qna:", err);
                    reject(err);
                    return;
                }
                const userIds = rows.map(row => row.user_id);
                resolve(userIds);
            });
            return;
        }

        const questionIdToOptionIds = qnaOptions.reduce((acc, q) => {
            if (q.options && Array.isArray(q.options)) {
                q.options.forEach(opt => {
                    if (optionIds.includes(opt.option_id)) {
                        if (!acc[q.id]) acc[q.id] = [];
                        acc[q.id].push(opt.option_id);
                    }
                });
            }
            return acc;
        }, {});

        const conditions = Object.entries(questionIdToOptionIds).map(([questionId, options]) => 
            `question_id = ${questionId} AND option_id IN (${options.join(',')})`
        );

        let queryString = `SELECT user_id FROM u_qna WHERE (${conditions.join(') OR (')}) GROUP BY user_id`;

        db.query(queryString, (err, rows) => {
            if (err) {
                console.error("Error querying filter results from u_qna:", err);
                reject(err);
                return;
            }
            const userIds = rows.map(row => row.user_id);
            resolve(userIds);
        });
    });
}

/**
 * Retrieves profile information for multiple users.
 * 
 * @param {Array} user_ids - The IDs of the users.
 * @returns {Promise<Array>} - A promise that resolves to an array of profile information objects.
 */
export async function getProfileInfoMultiple(user_ids) {
    const profilePromises = user_ids.map(userId => getProfile(userId));
    const userDataPromises = user_ids.map(userId => getUserData(userId));

    const profileDataResults = await Promise.all(profilePromises);
    const userDataResults = await Promise.all(userDataPromises);

    const profileInfo = user_ids.map((user_id, index) => {
        return {
            user_id: user_id,
            profile_data: profileDataResults[index],
            user_data: userDataResults[index]
        };
    });

    return profileInfo;
}

/**
 * Retrieves all user IDs that a specified user has marked as 'unsure'.
 * 
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of user IDs.
 */
export async function getSavedMatches(userId) {
    return new Promise((resolve, reject) => {
        const { queryString, values } = buildSelectString("match_user_id", tableNames.u_matches, {
            user_id: userId,
            match_status: 'unsure'
        });

        db.query(queryString, values, (err, rows) => {
            if (err) {
                console.error("Error fetching user IDs from database:", err);
                reject(err);
                return;
            }
            const saveIds = rows.map(row => row.match_user_id);
            resolve(saveIds);
        });
    });
}

/**
 * Deletes a match decision from the database.
 * 
 * @param {number} userId - The ID of the user.
 * @param {number} matchUserId - The ID of the matched user.
 * @param {string} decision - The decision to delete.
 * @returns {Promise<void>} - A promise that resolves when the decision is deleted.
 */
export async function deleteMatchDecision(userId, matchUserId, decision) {
    try {
        const { queryString, values } = buildDeleteString(tableNames.u_matches, {
            user_id: userId,
            match_user_id: matchUserId,
            match_status: decision
        });

        await db.query(queryString, values);
    } catch (error) {
        console.error('Error in deleteMatchDecision:', error);
        throw new Error('Failed to delete match decision');
    }
}

/**
 * Deletes an inbox match between two users.
 * 
 * @param {number} user1Id - The ID of the first user.
 * @param {number} user2Id - The ID of the second user.
 * @returns {Promise<void>} - A promise that resolves when the match is deleted.
 */
export async function deleteInboxMatch(user1Id, user2Id) {
    try {
        const USER1 = Math.min(user1Id, user2Id);
        const USER2 = Math.max(user1Id, user2Id);
        const { queryString, values } = buildDeleteString(tableNames.u_inboxt, {
            user1_id: USER1,
            user2_id: USER2,
        });

        await db.query(queryString, values);
        deleteMatchDecision(user1Id, user2Id, "match");
    } catch (error) {
        console.error('Error in deleteMatchDecision:', error);
        throw new Error('Failed to delete match decision');
    }
}

/**
 * Retrieves the matches of a specified user.
 * 
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of match objects.
 */
export async function retrieveUserMatches(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                CASE 
                    WHEN user1_id = ? THEN user2_id 
                    ELSE user1_id 
                END AS matched_user_id,
                match_timestamp
            FROM ${tableNames.u_inboxt}
            WHERE user1_id = ? OR user2_id = ?
            ORDER BY match_timestamp ASC;
        `;
        
        db.query(query, [userId, userId, userId], (error, matches) => {
            if (error) {
                console.error('Error retrieving user matches:', error);
                reject(error);
            } else {
                const transformedMatches = matches.map(match => {
                    return {
                        matchId: match.matched_user_id,
                        timestamp: match.match_timestamp
                    };
                });

                resolve(transformedMatches);
            }
        });
    });
}

/**
 * Retrieves unseen matches for a specified user.
 * 
 * @param {number} userId - The ID of the user.
 * @returns {Promise<Array>} - A promise that resolves to an array of unseen match IDs.
 */
export async function getUserUnseenMatches(userId) {
    return new Promise((resolve, reject) => {
        const getUnseenMatchesQuery = `
            SELECT * FROM ${tableNames.u_inboxt}
            WHERE (user1_id = ? AND user1_is_seen = 0) 
               OR (user2_id = ? AND user2_is_seen = 0);
        `;
  
        db.query(getUnseenMatchesQuery, [userId, userId], (err, rows) => {
            if (err) {
                console.error("Error fetching user IDs from database:", err);
                reject(err);
                return;
            }
            const unseenMatches = rows.map(row => row.match_id);
            resolve(unseenMatches);
        });
    });
}

/**
 * Marks all matches as seen for a specified user.
 * 
 * @param {number} userId - The ID of the user.
 * @returns {Promise<void>} - A promise that resolves when the matches are marked as seen.
 */
export async function markUserMatchesAsSeen(userId) {
    return new Promise((resolve, reject) => {
        const markAsSeenQuery = `
            UPDATE ${tableNames.u_inboxt}
            SET user1_is_seen = CASE WHEN user1_id = ? THEN 1 ELSE user1_is_seen END,
                user2_is_seen = CASE WHEN user2_id = ? THEN 1 ELSE user2_is_seen END
            WHERE user1_id = ? OR user2_id = ?;
        `;

        db.query(markAsSeenQuery, [userId, userId, userId, userId], (err) => {
            if (err) {
                console.error("Error updating matches as seen in database:", err);
                reject(err);
                return;
            }
            resolve();
        });
    });
}
