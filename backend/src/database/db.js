const mysql = require("mysql")
const env = require("../env.js")
const db = mysql.createPool({
    host: env.db.host,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
    connectionLimit: 100
})

module.exports = db