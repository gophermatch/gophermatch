import { db, tableNames } from './db.js'
import { queryRowsToArray, buildSelectString, buildInsertString, buildUpdateString } from './dbutils.js'

// Returns profile object (with profile_name and bio)
export async function getProfile(user_id) {
    return new Promise((resolve, reject) => {
        const qr = buildSelectString("*", tableNames.u_profiles, {user_id})

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
                reject("Profile not found")
                return
            } else if (res.length != 1) {
                // impossible to have more than one user with the same email
                reject({})
                return
            }
        })
    })
}

// Creates and stores a profile in DB
// second argument (profile obj) is optional
export async function createProfile(user_id, profile) {
    if (!profile) profile = {}
    return new Promise((resolve, reject) => {
        const qr = buildInsertString(tableNames.u_profiles, {user_id, ...profile})
        // "INSERT INTO u_profiles (user_id, profile_name, bio) VALUES (?, ?, ?)"

        db.query(qr.queryString, qr.values, (err, res) => {
            if (err) {
                if (err.code === "ER_DUP_ENTRY") reject("Profile already exists")
                else reject(err)
                return
            }
            if (res.affectedRows != 1) {
                reject({})
            } else {
                // res.insertId exists iff exactly one row is inserted
                resolve({user_id: res.insertId, ...profile})
            }
        })
    })
}

// updates the stored profile
export async function updateProfile(user_id, profile) {
    return new Promise((resolve, reject) => {
        const qr = buildUpdateString(tableNames.u_profiles, {user_id}, {...profile})

        db.query(qr.queryString, qr.values, (err, res) => {
            if (err) {
                reject(err)
                return
            }
            if (res.affectedRows != 1) {
                reject("Multiple or no profiles updated!")
            } else {
                // res.insertId exists iff exactly one row is inserted
                resolve()
            }
        })
    })
}

// Returns an array of "Questions and Answers" object
// Could be an empty list if the user has no QnAs
// Or throws an error if the user's profile hasn't been created
export async function getQnAs(user_id) {

}

// Create an answer to a exisitng question
// The question with question_id must exist
// The user must have answered the question before
export async function createQnA(user_id, question_id, answer) {

}

// Update an answer to a exisitng question
// The question with question_id must exist
export async function updateQnA(user_id, question_id, answer) {

}