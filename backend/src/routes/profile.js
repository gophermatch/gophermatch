import multer from 'multer';
import { Router } from 'express'
import { createErrorObj } from './routeutil.js'
import { uploadFileToBlobStorage } from '../blobService.js';
import { 
    getProfile,
    updateProfile,
    savePictureUrl
} from '../database/profile.js'
import fs from 'fs';

import { SearchLocation, parseValue, parseToPosInt } from './requestParser.js'

const upload = multer({ dest: 'uploads/' }); // Temporarily stores files in 'uploads/' directory
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

//new route to get 10 profiles from an array of 10 user_ids.
//GET api/profile/bulk-profiles
router.post('/bulk-profiles', async (req, res) => {
    const userIds = req.body.user_ids;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({ error: "Must include a non-empty array of user_ids in the request body." });
    }

    try {
        const profiles = await Promise.all(userIds.map(userId => getProfile(userId)));
        res.status(200).json(profiles);
    } catch (error) {
        console.error("Error fetching profiles:", error);
        res.status(500).json({ error: "Failed to fetch profiles. Please try again later." });
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

router.post('/upload-picture', upload.single('file'), async (req, res) => {
    try {
        const { user_id, pic_number } = req.body; // Extracting pic_number along with user_id

        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded." });
        }

        // Construct a unique blob name possibly using pic_number if needed
        const blobName = `${user_id}-${pic_number}-${Date.now()}-${file.originalname}`;

        const fileStream = fs.createReadStream(file.path);
        const streamLength = file.size;

        const pictureUrl = await uploadFileToBlobStorage(blobName, fileStream, streamLength);

        // Assuming savePictureUrl now also takes pic_number as a parameter
        await savePictureUrl(user_id, pictureUrl,pic_number);

        res.status(200).json({ message: "File uploaded successfully", url: pictureUrl });
    } catch (error) {
        console.error("Error uploading picture:", error);
        res.status(500).json({ message: "Failed to upload picture. Please try again later." });
    }
});


