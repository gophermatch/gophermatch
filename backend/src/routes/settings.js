import { Router } from 'express';
import { createErrorObj } from './routeutil.js';
import { tableNames } from '../database/db.js';

const router = Router();

export default router;


router.get('/', async (req, res) => {
    const user_id = req.query.user_id;

    if (!user_id) {
        res.status(400).json(createErrorObj("Must include a user_id in the query parameter!"));
        console.log('User_id missing (if statement)');
        return;
    }
    if (user_id) {
        console.log('Valid user_id (if statement)');
    }

    try {
        console.log('User_valid');
        const profile = await getProfile(user_id);
        res.status(200).json(profile);
        const response = await backend.get(`/settings?user_id=${user_id}`);
        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json(createErrorObj("Failed to fetch user info. Please try again later."));
    }
});


router.put('/', async (req, res) => {
    const user_id = req.body.user_id
    const profile = req.body.profile
    delete profile.user_id 

    if (!user_id || !profile) {
        res.status(400).json(createErrorObj("Must specify the user_id and profile object to update the profile!"))
        return
    }

    try {
        const updateQuery = buildUpdateString(tableNames.u_profiles, { user_id }, profile);
        await backend.post('/update-profile', { query: updateQuery });
        res.status(200).json({ message: "Profile updated!" })
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json(createErrorObj("Failed to update profile. Please try again later."));
    }
});
