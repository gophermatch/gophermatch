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
    u_bios: "u_bios",
        u_matches: "u_matches", // junction table
        u_qnas: "u_qnas",
        u_pictures: "u_pictures",
        u_inboxt: "u_inboxt",
    u_prefs: "u_preferences",
        u_locations: "u_locations",
        u_qna: "u_qna",
    u_userdata: "u_userdata",
    u_topfive: "u_topfive",
    u_subleases: "u_subleases",
    u_savelease: "u_savelease",
    u_apartment: "u_apartment",
    u_generaldata: "u_generaldata",

    // Lookup tables
    locations: "locations",
    questions: "questions",
}