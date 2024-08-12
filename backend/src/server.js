import express, { json, urlencoded } from "express";
import session from "express-session";
import cors from "cors";
import { port, session as envSession } from './env.js';
import { db } from './database/db.js';
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});

const auth = admin.auth();

const server = express();

// Use Node's queryString as query parser
server.set('query parser', 'simple');

// Request body middleware
server.use(json());    // tell server to parse incoming requests as JSON
server.use(urlencoded({ extended: true }));

// Session
const cookieAge = 1000 * 60 * 60 * 24 * 7; // 7 days
server.use(session({
    secret: envSession.secret,
    resave: false, // prevent race condition with parallel storing to sessions of the same user
    saveUninitialized: true, // allow newly created session to be stored
    cookie: {
        maxAge: cookieAge
    }
}));

server.use(cors({
    origin: "http://localhost:8080",    // do not end the URL with a slash / !!
    credentials: true
}));  // allow cross-origin requests

// Firebase token verification middleware
server.use(async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (idToken) {
        try {
            const decodedToken = await auth.verifyIdToken(idToken);
            req.user = decodedToken; // Attach the decoded token (Firebase UID) to the request object
            next();
        } catch (error) {
            res.status(401).send('Unauthorized');
        }
    } else {
        next(); // Proceed without Firebase authentication (optional routes)
    }
});

import router from "./routes/router.js";
server.use('/api', router);

const httpServer = server.listen(port, () => console.log(`gophermatch is listening on port ${port}`));

// Handle server shutdown
let handleShutdown = () => {
    console.log('Process termination signal received');
    httpServer.close(() => {
        console.log('Express server closed');
    });

    db.end((err) => {
        if (err) console.error(`Database: error when ending pooling connection: ${err.stack}`);
        else console.log("Database connection pool closed");
    });
};
process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);
