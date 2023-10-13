const express = require("express")
const session = require("express-session")
const env = require('./env.js')
const db = require('./database/db.js')

const server = express()

server.use(express.json())    // tell server to use parse incoming requests as json (using the json() middleware)
server.use(express.urlencoded({extended:true}))
// TODO: Add private file
// server.use(session({secret:env.session.secret}));

const router = require("./routes/router.js")
server.use('/api', router)

const httpServer = server.listen(env.port, () => console.log(`gophermatch is listening on port ${env.port}`))

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