import express, { json, urlencoded } from "express"
import session from "express-session"
import cors from "cors"
import { port, session as envSession } from './env.js'
import { db } from './database/db.js'

const server = express()

// Use Node's queryString as query parser
server.set('query parser', 'simple')

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

server.use(cors({
    origin: "http://localhost:8080",    // do not end the url with a slash / !!
    credentials: true
}))  // allow cross origin requests. 
// TODO: add whitelisted origins checker (different origins for DEV and PROD)

import router from "./routes/router.js"
server.use('/api', router)


// Handle server shutdown
let handleShutdown = () => {
    httpServer.close(() => {
    })

    db.end((err) => {
        if (err) console.error(`Database: error when ending pooling connection: ${err.stack}`)
    })
}
process.on('SIGINT', handleShutdown)
process.on('SIGTERM', handleShutdown)