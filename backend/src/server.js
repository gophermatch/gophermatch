import 'dotenv/config.js'
import express from "express";
import { json, urlencoded } from "express";
import session from "express-session";
import cors from "cors";
import { port, session as envSession } from './env.js';
import { db } from './database/db.js';
import path from 'path';
import { fileURLToPath } from 'url';
import router from "./routes/router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = express();

server.set('query parser', 'simple');

// Correct path to the static files directory
server.use(express.static(path.join(__dirname, '..', '..', 'frontend', 'src','dist')));

// Correct path to serve index.html
server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'frontend', 'src','dist', 'index.html'));
});

server.use(json());
server.use(urlencoded({ extended: true }));

const cookieAge = 1000 * 60 * 60 * 24 * 7; // 7 days
server.use(session({
    secret: envSession.secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: cookieAge
    }
}));

server.use(cors({
    // process.env.NODE_ENV === 'production' ? 'https://cribby.me' : 
    origin: process.env.NODE_ENV === 'production' ? 'https://cribby.me' : 'http://localhost:8080',
    credentials: true
}));
if(process.env.NODE_ENV === 'production'){
    console.log("PRODUCTION IS ON")
}

server.use('/api', router);

const PORT = process.env.PORT || 3000;

const httpServer = server.listen(PORT, () => console.log(`gophermatch is listening on port ${PORT}`));

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
