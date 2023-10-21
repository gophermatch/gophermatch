import { port, session as envSession } from './env.js'
import express, { json, urlencoded } from "express"
import session from "express-session"
import db from './database/db.js'

const server = express()

// Request body middleware
server.use(json())    // tell server to use parse incoming requests as json (using the json() middleware)
server.use(urlencoded({extended:true}))

// Session
const cookieAge = 1000 * 60 * 60 * 24 * 7; // 7 days
server.use(session({
    secret: envSession.secret,
    resave: false, // prvent race condition with parallel storing to sessions of the same user
    saveUninitialized: true, // allow newly created session to be stored
    cookie: {
        maxAge: cookieAge
    }
}));

import router from "./routes/router.js"
server.use('/api', router)

const httpServer = server.listen(port, () => console.log(`gophermatch is listening on port ${port}`))

// Handle server shutdown
let handleShutdown = () => {
    console.log('Process termination signal received')
    httpServer.close(() => {
        console.log('Express server closed')
    })

    db.end((err) => {
        if (err) console.error(`Database: error when ending pooling connection: ${err.stack}`)
        else console.log("Database connection pool closed")
    })
}
process.on('SIGINT', handleShutdown)
process.on('SIGTERM', handleShutdown)