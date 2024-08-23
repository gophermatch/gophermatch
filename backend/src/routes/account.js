import bcrypt from 'bcrypt'
import { Router } from 'express';
import { createUser, deleteUser, insertAccountInfo, updateAccountInfo } from "../database/account.js";
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

// TODO needs to be redone
router.get('/fetch', async (req, res) => {
    let user_id = req.query.user_id;

    //console.log(`fetch account for user id ${user_id}`);

    try {
        // update the user's account info
        let data = null;
        res.status(200).json({data: data, message: "User account queried!"})
    } catch (e) {
        console.error(e)
        res.status(400).json(createErrorObj(e))
    }
})

// TODO: Will need to be redone
router.put('/creation/new', async (req, res) => {
    let userdata = req.body.userdata;

    // Fetch account data to see if it exists in the DB or not
    try{
        let data = null;

        if(data == null){
            await insertAccountInfo(userdata)
            res.status(200).json({message: "User account data inserted!"})
            return;
        }
    }catch(e){
        console.error(e)
        res.status(400).json(createErrorObj(e))
    }

    try {
        // update the user's account info
        await updateAccountInfo(userdata)
        res.status(200).json({message: "User account data updated!"})
    } catch (e) {
        console.error(e)
        res.status(400).json(createErrorObj(e))
    }
})

// Delete account
router.delete('/', AuthStatusChecker, async (req, res) => {
    const user_id = req.body.user_id    // returns string, so don't use strict equal below
    if (req.session.user.user_id != user_id) {
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

// TODO: Will need to be redone
router.post('/update', async (req, res) => {
    const { userId, ...userdata } = req.body; // Destructure userId from the request body and capture the rest as userdata
    try {
        if (!userId) throw new Error("userId is required");
        await updateAccountInfo(userdata, userId);
        res.status(200).json({message: "Account information updated successfully!"});
    } catch (error) {
        console.error(error);
        res.status(400).json({error: error.toString(), message: "Failed to update account information"});
    }
});

export default router