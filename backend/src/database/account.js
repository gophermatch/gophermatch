import { db, tableNames } from './db.js'
import { queryRowsToArray, buildSelectString, buildInsertString } from './dbutils.js'

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
        const userobj = {email: email, hashpass: hashpass}
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
        db.query(`SELECT *
        FROM ${tableNames.u_userdata}
        WHERE user_id = ${user_id}`,
          (err, res) => {
              if (err) {
                  reject(err)
                  return
              }
              resolve(res)
          })
    })
}

export async function updateAccountInfo(user_id, userdata){

    let exists = await getUserData(user_id);

    console.log("User has data: " + exists);

    return new Promise((resolve, reject) => {
        db.query(`${exists ? `UPDATE` : `INSERT INTO`} ${tableNames.u_userdata}
SET 
    user_id = ${user_id},
    first_name = "${userdata.first_name}",
    last_name = "${userdata.last_name}",
    date_of_birth = "${userdata.date_of_birth}",
    hear_about_us = "${userdata.hear_about_us}",
    hometown = "${userdata.hometown}",
    housing_preference = "${userdata.housing_preference}",
    college = "${userdata.college}",
    major = "${userdata.major}",
    gender = "${userdata.gender}"`,
          (err, res) => {
              if (err) {
                  reject(err)
                  return
              }
              resolve(res)
          })
    })
}