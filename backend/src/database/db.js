import { createPool } from "mysql"
import { db as _db } from "../env.js"
const db = createPool({
    host: _db.host,
    port: _db.port,
    user: _db.user,
    password: _db.password,
    database: _db.name,
    connectionLimit: 100
})

export default db