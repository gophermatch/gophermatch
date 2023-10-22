import bcrypt from 'bcrypt'
import { Router } from 'express';
import { createUser } from '../database/account.js'
import { createErrorObj } from './routeutil.js'

const router = Router()
const saltRounds = 10;

// Create a user account
router.post('/', async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    if (!email || !password) {
        res.status(400).send(createErrorObj("Email or password field missing from request body"))
        return
    }
    if (!email.endsWith('@umn.edu')) {
        res.status(400).send(createErrorObj("Email must be an umn email (ending with @umn.edu)"))
        return
    }

    try {
        // hash the password
        const hashpass = await bcrypt.hash(password, saltRounds)
        const user = await createUser(email, hashpass)

        // "login" the user by storing their user info in session
        req.session.user = user
        res.status(200).json({user_id: user.user_id})
    } catch (e) {
        console.error(e)
        res.status(400).send(createErrorObj(e))
    }
})

// TODO: Delete account (and maybe change password(?))

export default router