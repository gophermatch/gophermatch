import { db, tableNames } from './db.js'
import { queryRowsToArray, buildSelectString, buildInsertString, buildUpdateString } from './dbutils.js'
import account from "../routes/account.js";

/**
 * Retrieves a user from the database by email.
 * 
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<Object>} - A promise that resolves to a user object if found, or rejects with an error.
 */
export async function getUser(email) {
    return new Promise((resolve, reject) => {
        const qr = buildSelectString("*", tableNames.users, { "email": email });

        db.query(qr.queryString, qr.values, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }

            const res = queryRowsToArray(rows);
            if (res.length == 1) {
                resolve(res[0]);
            } else if (res.length == 0) {
                // User not found
                reject("User not found");
                return;
            } else if (res.length != 1) {
                // Impossible to have more than one user with the same email
                reject({});
                return;
            }
        });
    });
}

/**
 * Creates a user account with an email and a hashed password.
 * 
 * @param {string} email - The email of the new user.
 * @param {string} hashpass - The hashed password of the new user.
 * @returns {Promise<Object>} - A promise that resolves to the created user object, or rejects with an error.
 */
export async function createUser(email, hashpass) {
    return new Promise(async (resolve, reject) => {
        const userobj = { email: email, hashpass: hashpass, is_verified: 1 };
        const qr = buildInsertString(tableNames.users, userobj);

        db.query(qr.queryString, qr.values, (err, res) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") reject("Email already exists");
                else reject(err);
                return;
            }
            if (res.affectedRows != 1) {
                reject({});
            } else {
                // res.insertId exists iff exactly one row is inserted
                resolve({ user_id: res.insertId, ...userobj });
            }
        });
    });
}

/**
 * Deletes a user by their user ID.
 * 
 * @param {number} user_id - The ID of the user to delete.
 * @returns {Promise<Object>} - A promise that resolves to the deletion result, or rejects with an error.
 */
export async function deleteUser(user_id) {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM ${tableNames.users} WHERE user_id = ?;`, user_id,
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                if (res.affectedRows == 0) {
                    reject(`Something went wrong when deleting user. Perhaps the user with user_id ${user_id} is not found`);
                } else if (res.affectedRows == 1) {
                    resolve(res);
                } else reject({});
            });
    });
}

/**
 * Retrieves user data by user ID.
 * 
 * @param {number} user_id - The ID of the user whose data is to be retrieved.
 * @returns {Promise<Object>} - A promise that resolves to the user data object, or rejects with an error.
 */
export async function getUserData(user_id) {
    return new Promise((resolve, reject) => {
        const qr = buildSelectString("*", tableNames.u_userdata, { user_id });

        db.query(qr.queryString, qr.values, (err, rows) => {
            const res = queryRowsToArray(rows);

            if (err) {
                console.error("Error fetching user data", err);
                reject(err);
                return;
            }

            resolve(res[0]);
        });
    });
}

/**
 * Updates account information for a user.
 * 
 * @param {Object} userdata - The new user data to update.
 * @param {number} userId - The ID of the user whose data is to be updated.
 * @returns {Promise<Object>} - A promise that resolves to the update result, or rejects with an error.
 */
export async function updateAccountInfo(userdata, userId) {
    console.log(userdata);
    const filteredNewVals = Object.entries(userdata).reduce((acc, [key, value]) => {
        if (value !== '') acc[key] = value;
        return acc;
    }, {});

    if (Object.keys(filteredNewVals).length === 0) {
        console.log("No valid data provided for update.");
        return Promise.resolve("No update performed due to lack of valid data.");
    }

    const primary_key = { user_id: userId };
    const updateQuery = buildUpdateString(tableNames.u_userdata, primary_key, filteredNewVals);
    console.log("query: " + updateQuery.queryString);

    return new Promise((resolve, reject) => {
        db.query(updateQuery.queryString, updateQuery.values,
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
    });
}

/**
 * Inserts account information for a user.
 * 
 * @param {Object} userdata - The new user data to insert.
 * @param {number} userId - The ID of the user whose data is to be inserted.
 * @returns {Promise<Object>} - A promise that resolves to the insert result, or rejects with an error.
 */
export async function insertAccountInfo(userdata, userId) {
    console.log(userdata);
    const filteredNewVals = Object.entries(userdata).reduce((acc, [key, value]) => {
        if (value !== '') acc[key] = value;
        return acc;
    }, {});

    if (Object.keys(filteredNewVals).length === 0) {
        console.log("No valid data provided for insert.");
        return Promise.resolve("No update performed due to lack of valid data.");
    }

    const updateQuery = buildInsertString(tableNames.u_userdata, filteredNewVals);
    console.log("query: " + updateQuery.queryString);

    return new Promise((resolve, reject) => {
        db.query(updateQuery.queryString, updateQuery.values,
            (err, res) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(res);
            });
    });
}
