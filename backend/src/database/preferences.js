import { db, tableNames } from './db.js';
import { buildInsertString, queryRowsToArray } from './dbutils.js'

// Expects an user_id
// Returns a js object with user_id and preferences, with error = false
// If an error occurs, return a js object with error = true
export async function getUserPrefs(user_id) {
    // For testing without connecting to the database
    // See below for how to actually write this function, and createUserPrefs
    if (user_id != 3) throw "User ID not found!";
    return {
        user_id: 3,
        gender: "man",
        loud_environment: true,
        extroverted: true,
        sleep_past_12: true,
        locations: ["Pioneer", "Territorial"] // DB: you'll have to query this from joining locations and user_locations tables
    };
}
/*
The SQL selector for ^ looks like
`SELECT * FROM ${tableNames.u_prefs} WHERE user_id = ?`
(you can paste that in)
`` is a format string kinda like f'' in python. you put variables you insert inside ${}
For the above, you need to use user_id as [user_id] in the second argument to db.query,
and deal with resolve and reject functions
*/

// Expects an int user_id and optionally a js object of preferences
// Returns the user preference object updated (as a Promise), or throw an error
export async function createUserPrefs(user_id, preferences) {
    // Here we are return a Promise, which is how you make functions asynchronous
    // resolve is a function that takes the value we want to return
    // reject is a function that takes an error value 
    // User supplies these functions when dealing with the returned value of createUserPrefs
    return new Promise((resolve, reject) => {
        let query = buildInsertString(tableNames.u_prefs, {user_id, ...preferences})

        db.query(query.queryString, query.values,
            (err, res) => {
        // First argument is the query string
        // Second argument is array of values to be inserted to ?s. Use this so the MySQL library checks for "dangerous" strings (to prevent cyberattacks)
        // Third argument is a callback function to deal with the returned values. 
        // err is error object, res is the result object
        // With a SELECT query, res is an object with rows selected. Use queryRowsToArray() to convert it to array
        // Here we are using INSERT INTO query, so res is a result object with affectRows property
                if (err) reject(err)
                else {
                    resolve(res)
                }
        })
    });
}