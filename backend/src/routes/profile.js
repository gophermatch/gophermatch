import { Router } from 'express'
import { createErrorObj } from './routeutil.js'
import { 
    getProfile,
    updateProfile,
} from '../database/profile.js'
import { SearchLocation, parseValue, parseToPosInt } from './requestParser.js'
const router = Router()

export default router

// GET api/profile/
router.get('/', async (req, res) => {
    const user_id = req.query.user_id;

    if (!user_id) {
        res.status(400).json(createErrorObj("Must include a user_id in the query parameter!"));
        return;
    }

    // Validate user_id if needed

    try {
        const profile = await getProfile(user_id);
        res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json(createErrorObj("Failed to fetch profile. Please try again later."));
        // Log the detailed error for backend debugging:
        // Log error using your preferred logging mechanism (console.log, Winston, etc.)
    }
});


// Update profile
// PUT api/profile/
// REQUIRES the request's Content-Type to be "application/json"
router.put('/', async (req, res) => {
    const user_id = req.body.user_id
    const profile = req.body.profile
    delete profile.user_id // prevent user from chaning the user_id of their profile record

    if (!user_id || !profile) {
        res.status(400).json(createErrorObj("Must specify the user_id and profile object to update the profile!"))
        return
    }

    // If the user is updating a profile that's not their own
    if (user_id !== req.session.user.user_id) {
        res.status(400).json(createErrorObj("Cannot update someone else's profile!"))
        return
    }

    // Check if profile object is empty
    if (Object.keys(profile).length == 0) {
        res.status(400).json(createErrorObj("Must provide some new values to update! (To delete a value, use the value null)"))
        return
    }

    try {
        await updateProfile(user_id, profile)
        res.status(200).json({message: "Profile updated!"})
    } catch(e) {
        console.error(e)
        res.status(400).json(createErrorObj(e))
    }
})

// Get QnA for a user
// router.get('/qna', async (req, res) => {
//     const user_id = req.query.user_id;

//     if (!user_id) {
//         res.status(400).json(createErrorObj("Must include a user_id in the query parameter!"));
//         return;
//     }

//     try {
//         const qna = await getQnA(user_id);
//         res.status(200).json(qna);
//     } catch (e) {
//         console.error(e);
//         res.status(400).json(createErrorObj(e));
//     }
// });

// // Save/update QnA for a user
// router.put('/qna', async (req, res) => {
//     const user_id = req.body.user_id;
//     const qna = req.body.qna;

//     if (!user_id || !qna) {
//         res.status(400).json(createErrorObj("Must specify user_id and qna to update QnA!"));
//         return;
//     }

//     try {
//         await saveQnA(user_id, qna);
//         res.status(200).json({ message: "QnA updated!" });
//     } catch (e) {
//         console.error(e);
//         res.status(400).json(createErrorObj(e));
//     }
// });
