import '../database/login.js';
import { Router } from 'express';
const router = Router()

// Login
router.post('/', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    // store in db
    console.warn(`Username: ${username} Hashed password: ${password}`);
    res.json(`{username:${username}, Hashed password:${password}}`); // sends json to frontend
})

// Logout
router.delete('/', async (req, res) => {
    // let username = req.body.username;
    let password = req.body.password;

    // load hash from db
    // let result = await bycrpt.compare(password, hash);
    console.warn("Logout: Not yet implemented!");
})

export default router