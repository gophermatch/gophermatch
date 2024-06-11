import bcrypt from 'bcrypt';
import { Router } from 'express';
import { createUser, deleteUser, getUserData, insertAccountInfo, updateAccountInfo } from "../database/account.js";
import { AuthStatusChecker, loginUser, logoutUser } from '../auth.js';
import { createErrorObj } from './routeutil.js';
import { createBio } from '../database/profile.js';

const router = Router();
const saltRounds = 10;

/**
 * Create a user account.
 * 
 * @route POST /
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/', async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        res.status(400).json(createErrorObj("Email or password field missing from request body"));
        return;
    }
    if (!email.endsWith('@umn.edu')) {
        res.status(400).json(createErrorObj("Email must be an umn email (ending with @umn.edu)"));
        return;
    }

    try {
        const hashpass = await bcrypt.hash(password, saltRounds);
        const user = await createUser(email, hashpass);
        const profile = await createBio(user.user_id);
        const userWithoutPass = loginUser(req, user);
        res.status(201).json(userWithoutPass);
    } catch (e) {
        console.error(e);
        res.status(400).json(createErrorObj(e));
    }
});

/**
 * Fetch user data.
 * 
 * @route GET /fetch
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/fetch', async (req, res) => {
    let user_id = req.query.user_id;

    try {
        let data = await getUserData(user_id);
        res.status(200).json({data: data, message: "User account queried!"});
    } catch (e) {
        console.error(e);
        res.status(400).json(createErrorObj(e));
    }
});

/**
 * Insert or update user account creation data.
 * 
 * @route PUT /creation/new
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.put('/creation/new', async (req, res) => {
    let userdata = req.body.userdata;

    try {
        let data = await getUserData(userdata.user_id);

        if (data == null) {
            await insertAccountInfo(userdata);
            res.status(200).json({message: "User account data inserted!"});
            return;
        }
    } catch (e) {
        console.error(e);
        res.status(400).json(createErrorObj(e));
    }

    try {
        await updateAccountInfo(userdata);
        res.status(200).json({message: "User account data updated!"});
    } catch (e) {
        console.error(e);
        res.status(400).json(createErrorObj(e));
    }
});

/**
 * Delete a user account.
 * 
 * @route DELETE /
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.delete('/', AuthStatusChecker, async (req, res) => {
    const user_id = req.body.user_id;

    if (req.session.user.user_id != user_id) {
        res.status(403).json(createErrorObj("Cannot delete another user's account"));
        return;
    }

    try {
        await deleteUser(user_id);

        logoutUser(req, res, (err) => {
            if (err) {
                res.status(500).json(createErrorObj(err, "Failed to log out deleted user"));
                return;
            }
            res.status(200).json({message: "User has successfully been deleted and logged out!"});
        });
    } catch (e) {
        console.error(e);
        res.status(400).json(createErrorObj(e));
    }
});

/**
 * Get user data by ID.
 * 
 * @route GET /userdata
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
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

/**
 * Update user account information.
 * 
 * @route POST /update
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/update', async (req, res) => {
    const { userId, ...userdata } = req.body;

    try {
        if (!userId) throw new Error("userId is required");
        await updateAccountInfo(userdata, userId);
        res.status(200).json({message: "Account information updated successfully!"});
    } catch (error) {
        console.error(error);
        res.status(400).json({error: error.toString(), message: "Failed to update account information"});
    }
});

export default router;
