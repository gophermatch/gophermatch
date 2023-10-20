import db from './db.js';
import { buildKeyValSep, processErrorObj } from './dbutils.js'

const tableName = "user_preferences"

// Expects a string username
// Returns a js object with user_id and preferences, with error = false
// If an error occurs, return a js object with error = true
export async function getUserPrefs(user_id) {
    // For testing without connecting to the database
    // See below for how to actually write this function, and createUserPrefs
    if (user_id !== 3) throw {error_message: "Username not found!"};
    return {
        user_id: 3,
        user_name: "testuser@umn.edu",
        gender: "man",
        loud_environment: true,
        extroverted: true,
        sleep_past_12: true,
        locations: ["Pioneer", "Territorial"] // DB: you'll have to query this from joining locations and user_locations tables
    };
}
/*
The SQL selector for ^ looks like
`SELECT * FROM ${tableName} WHERE user_id = ?`
(you can paste that in)
`` is a format string kinda like f'' in python. you put variables you insert inside ${}
For the above, you need to use user_id as [user_id] in the second argument to db.query,
and deal with resolve and reject functions
*/

// Expects a string username and optionally a js object of preferences
// Returns the user preference object updated (as a Promise), or throw an error
export async function createUserPrefs(user_id, preferences) {
    // Here we are return a Promise, which is how you make functions asynchronous
    // resolve is a function that takes the value we want to return
    // reject is a function that takes an error value 
    // User supplies these functions when dealing with the returned value of createUserPrefs
    return new Promise((resolve, reject) => {
        // build some string like "user_id = ? , x_pref = ? , y_pref = ? "
        let colsAndVals = buildKeyValSep(preferences, "=", ",")

        db.query(`UPDATE ${tableName} SET ${colsAndVals.keyString} WHERE user_id = ?`, 
            [...colsAndVals.vals, user_id], // creates an array w all elements in colsAndVals.vals and user_id
            (err, rows) => {
        // First argument is the query string
        // Second argument is array of values to be inserted to ?s. Use this so the MySQL library checks for "dangerous" strings (to prevent cyberattacks)
        // Third argument is a callback function to deal with the returned values. err is error object, rows is rows updated
                if (err) reject(processErrorObj(err))
                else {
                    const [row] = rows
                    resolve(row)
                }
        })
    });
}