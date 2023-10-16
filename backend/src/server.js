import { port, session as envSession } from './env.js'
import express, { json, urlencoded } from "express"
import session from "express-session"
import db from './database/db.js'

const server = express()

server.use(json())    // tell server to use parse incoming requests as json (using the json() middleware)
server.use(urlencoded({extended:true}))
server.use(session({
    secret: envSession.secret,
    resave: true, // ??
    saveUninitialized: false // ??
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