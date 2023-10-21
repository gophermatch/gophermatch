import { getUser } from '../database/account.js';
import { Router } from 'express';

const router = Router()

// Login
// Requires the request body to contain username and password (json)
// Responds with status 400 if login failed (along an error message), otherwise status 200
// On successful login, sets a session corresponding with the user
router.post('/', async (req, res) => {
    let username = req.body.username
    let password = req.body.password

    // Check if request includes username and password
    if (!username || !password) {
        res.status(400).json({error_message: "Must submit username and password to login!"})
        return
    }

    // If user is already signed in, we update their session object in case their password has changed
    try {
        const user = await getUser(username)

        // Check if password matches
        // if user could be empty; in that case user was not found
        // TODO: use bycrypt
        if (user.hashpass !== password) {
            res.status(400).json({error_message: "Username or password is incorrect"})
            return
        }
        // Put user into session
        req.session.user = user
        res.status(200).json({message: "User has successfully logged in!"})
    } catch(e) {
        console.error(e)
        res.status(400).send({error_message: "Something went horribly wrong!"})
    }
})

// Logout
// No requirement for the request
// Responds with status 400 or 200
// On successful logout, destroys the session associated with the user and clears the user's cookie
router.delete('/', async (req, res) => {
    console.log(req.session)
    if (!req.session.user) {
        res.status(400).json({error_message: "No user logged in"})
        return
    }

    req.session.destroy()
    res.clearCookie('connect.sid')
    res.status(200).json({message: "User has successfully logged out!"})
})

export default router