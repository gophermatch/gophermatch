import bcrypt from 'bcrypt'
import { Router } from 'express';
import { createUser, deleteUser, getUserData, insertAccountInfo, updateAccountInfo } from "../database/account.js";
import { AuthStatusChecker, loginUser, logoutUser } from '../auth.js'
import { createErrorObj } from './routeutil.js'
import { createBio } from '../database/profile.js';

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
        console.log(hashpass)
        // create the user
        const user = await createUser(email, hashpass)

        // create the user's profile

        //const profile = await createProfile(user.user_id)
        const profile = await createBio(user.user_id)

        const userWithoutPass = loginUser(req, user)
        res.status(201).json(userWithoutPass)
    } catch (e) {
        console.error(e)
        res.status(400).json(createErrorObj(e))
    }
})

router.get('/fetch', async (req, res) => {
    let user_id = req.query.user_id;

    console.log(`fetch account for user id ${user_id}`);

    try {
        // update the user's account info
        let data = await getUserData(user_id)
        res.status(200).json({data: data, message: "User account queried!"})
    } catch (e) {
        console.error(e)
        res.status(400).json(createErrorObj(e))
    }
})

router.put('/creation/new', async (req, res) => {
    let userdata = req.body.userdata;

    console.log(`put new account creation for user id ${userdata.user_id}`);

    // Fetch account data to see if it exists in the DB or not
    try{
        let data = await getUserData(userdata.user_id);

        if(data == null){
            console.log("inserting");
            await insertAccountInfo(userdata)
            res.status(200).json({message: "User account data inserted!"})
            return;
        }
    }catch(e){
        console.error(e)
        res.status(400).json(createErrorObj(e))
    }

    try {
        console.log("updating");
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

router.get('/userdata', async (req, res) => {
    try {
        const {userId} = req.body;
        if (!userId) {
            return res.status(400).send('User ID is required');
        }

        const userdata = await getUserData(userId);
        res.json(userdata);
    } catch (error) {
        res.status(500).send('Failed to get user data');
    }
});

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


// TODO: Delete account (and maybe change password(?))

export default router