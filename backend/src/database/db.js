import { createPool } from "mysql"
import { db as _db } from "../env.js"

export const db = createPool({
    host: _db.host,
    port: _db.port,
    user: _db.user,
    password: _db.password,
    database: _db.name,
    connectionLimit: 100
})

export const tableNames = {
    users: "users",
    u_matches: "u_matches", // junction table
    u_pictures: "u_pictures",
    u_inboxt: "u_inboxt",
    u_topfive: "u_topfive",
    u_subleases: "u_subleases",
    u_savelease: "u_savelease",
    u_generaldata: "u_generaldata",
    u_tags: "u_tags",
    tags: "tags",
    u_pollquestions: "u_pollquestions",
    u_polloptions: "u_polloptions",
}