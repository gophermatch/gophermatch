import { db, tableNames } from './db.js'
import { queryRowsToArray, buildSelectString, buildInsertString, buildUpdateString } from './dbutils.js'
import account from "../routes/account.js";

// Returns a promise that is a user object from the users database, or {} if no user is found
export async function getUser(email) {
    return new Promise((resolve, reject) => {
        const qr = buildSelectString("*", tableNames.users, {"email": email})

        db.query(qr.queryString, qr.values, (err, rows) => {
            if (err) {
                reject(err)
                return
            }

            const res = queryRowsToArray(rows)
            if (res.length == 1) {
                resolve(res[0])
            } else if (res.length == 0) {
                // user not found
                reject("User not found")
                return
            } else if (res.length != 1) {
                // impossible to have more than one user with the same email
                reject({})
                return
            }
        })
    })
}

// Create user acccount with a email and a hashed password
export async function createUser(email, hashpass) {
    return new Promise(async (resolve, reject) => {
        const userobj = {email: email, hashpass: hashpass, is_verified: 1}
        const qr = buildInsertString(tableNames.users, userobj)

        db.query(qr.queryString, qr.values, (err, res) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") reject("Email already exists")
                else reject(err)
                return
            }
            if (res.affectedRows != 1) {
                reject({})
            } else {
                // res.insertId exists iff exactly one row is inserted
                resolve({user_id: res.insertId, ...userobj})
            }
        })
    })
}

export async function deleteUser(user_id) {
    return new Promise((resolve, reject) => {
        db.query(`DELETE FROM ${tableNames.users} WHERE user_id = ?;`, user_id,
        (err, res) => {
            if (err) {
                reject(err)
                return
            }
            if (res.affectedRows == 0) {
                reject(`Something went wrong when deleting user. Perhaps the user with user_id ${user_id} is not found`)
            } else if (res.affectedRows == 1) {
                resolve(res)
            } else reject({})
        })
    })
}

export async function getUserData(user_id){
    return new Promise((resolve, reject) => {
        const qr = buildSelectString("*", tableNames.u_userdata, {user_id});

        db.query(qr.queryString, qr.values, (err, rows) => {

            const res = queryRowsToArray(rows)

            if (err) {
                console.error("Error fetching user data", err);
                reject(err);
                return;
            }

            resolve(res[0]);
        });
    });
}

// TODO: Will need to be redone
export async function updateAccountInfo(userdata, userId){
    console.log(userdata);
        const filteredNewVals = Object.entries(userdata).reduce((acc, [key, value]) => {
        if(value !== '') acc[key] = value;
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
          })
    });
}

// TODO: Will need to be redone
export async function insertAccountInfo(userdata, userId){
    console.log(userdata);
    const filteredNewVals = Object.entries(userdata).reduce((acc, [key, value]) => {
        if(value !== '') acc[key] = value;
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
          })
    });
}
