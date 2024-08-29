import bcrypt from 'bcrypt'
import { Router } from 'express';
import { createUser } from "../database/account.js";
import { loginUser } from '../auth.js'
import { createErrorObj } from './routeutil.js'

const router = Router()
const saltRounds = 10;

// TODO: Currently unused, delete?
// Unsure about deletion since firebase might need this
// Create a user account
router.post('/', async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    if (!email || !password) {
        res.status(400).json(createErrorObj("Email or password field missing from request body"))
        return
    }
    if (!email.endsWith('@umn.edu')) {
        res.status(400).json(createErrorObj("Email must be an umn email (ending with @umn.edu)"))
        return
    }

    try {
        // hash the password
        const hashpass = await bcrypt.hash(password, saltRounds)
        // create the user
        const user = await createUser(email, hashpass)

        // create the user's profile

        const userWithoutPass = loginUser(req, user)
        res.status(201).json(userWithoutPass)
    } catch (e) {
        console.error(e)
        res.status(400).json(createErrorObj(e))
    }
})

export default router