const db = require("mysql");
const mysql = require("mysql");
// const server = mysql.createPool({
//     host: private.database.host,
//     database: private.database.database,
//     user: private.database.user,
//     password: private.database.password,
//     connectionLimit: 100
// });
exports.server = server;

async function login(username, hashedPassword) {
    // TODO: implement this
    // return new Promise((resolve, reject) => {
    // });
}

// this should be called only when the user is logged in
async function logout(username) {
    // TODO: implement this
    // return new Promise((resolve, reject) => {
    // });
}