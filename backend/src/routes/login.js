import bcrypt from 'bcrypt'
import { getUser } from '../database/account.js';
import { Router } from 'express';
import { loginUser, logoutUser } from '../auth.js'
import { createErrorObj } from './routeutil.js'

const router = Router()

// Login
// Requires the request body to contain email and password (json)
// Responds with status 400 if login failed (along an error message), otherwise status 200
// On successful login, sets a session corresponding with the user
// login.js route adjustment for multiple logins
router.put('/', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        res.status(400).json(createErrorObj("Email or password field missing"));
        return;
    }

    // If a session exists but does not match the current login attempt, consider logging out the old session
    if (req.session.user && req.session.user.email !== email) {
        req.session.destroy(); // Destroy the existing session if it doesn't match
    }

    try {
        const user = await getUser(email);
        const match = await bcrypt.compare(password, user.hashpass);
        if (!match) {
            res.status(400).json(createErrorObj("Incorrect email or password"));
            return;
        }

        // Reset the session with the current user's details
        loginUser(req, user);
        res.status(200).json({ email: user.email, user_id: user.id });
    } catch(e) {
        console.error(e);
        res.status(400).json(createErrorObj("Login error occurred"));
    }
});

// Logout
// No requirement for the request
// Responds with status 400 or 200
// On successful logout, destroys the session associated with the user and clears the user's cookie
router.delete('/', async (req, res) => {
    console.log(req.session)
    if (!req.session.user) {
        res.status(400).json(createErrorObj("No user logged in"))
        return
    }

    logoutUser(req, res, (err) => {
        if (err) {
            res.status(500).json(createErrorObj(err, "Failed to log out user"))
            return
        }
        res.status(200).json({message: "User has successfully logged out!"})
    })
})

export default router