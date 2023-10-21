// import bcrypt from 'bcrypt'
import { db, tableNames } from './db.js'
import { queryRowsToArray, buildQueryString, processErrorObj, buildKeyValSep } from './dbutils.js'

// Returns a promise that is a user object from the users database, or {} if no user is found
export async function getUser(username) {
    return new Promise((resolve, reject) => {
        const qr = buildQueryString("*", tableNames.users, {"username": username})

        db.query(qr.queryString, qr.values, (err, rows) => {
            if (err) {
                reject(processErrorObj(err))
                return
            }

            const res = queryRowsToArray(rows)
            if (res.length == 1) {
                resolve(res[0])
            } else if (res.length == 0) {
                // user not found
                resolve({})
                return
            } else if (res.length != 1) {
                reject()
                return
            }
        })
    })
}