import bcrypt from 'bcrypt'
import { Router } from 'express';
import { createUser, deleteUser } from '../database/account.js'
import { AuthStatusChecker, loginUser, logoutUser } from '../auth.js'
import { createErrorObj } from './routeutil.js'

const router = Router()
const saltRounds = 10;

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
        const user = await createUser(email, hashpass)

        const userWithoutPass = loginUser(req, user)
        res.status(201).json(userWithoutPass)
    } catch (e) {
        console.error(e)
        res.status(400).json(createErrorObj(e))
    }
})

// Delete account
router.delete('/', AuthStatusChecker, async (req, res) => {
    const user_id = req.body.user_id    // returns string, so don't use strict equal below
    if (req.session.user.user_id != user_id) {
        console.log(user_id)
        res.status(403)
            .json(createErrorObj("Cannot delete another use's account"))
        return
    }

    try {
        await deleteUser(user_id)

        logoutUser(req, res, (err) => {
            if (err) {
                res.status(500).json(createErrorObj(err, "Failed to log out deleted user"))
                return
            }
            res.status(200).json({message: "User has successfully been deleted and logged out!"})
        })
    } catch (e) {
        console.error(e)
        res.status(400).json(createErrorObj(e))
    }
})

// TODO: Delete account (and maybe change password(?))

export default router