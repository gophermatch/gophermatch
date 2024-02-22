import multer from 'multer';
import { Router } from 'express';
import fs from 'fs';
import { createErrorObj } from './routeutil.js'
import { 
    getProfile,
    updateProfile,
    savePictureUrl,
    retrievePictureUrls
} from '../database/profile.js'
import{uploadFileToBlobStorage, generateBlobSasUrl} from '../blobService.js'
import { SearchLocation, parseValue, parseToPosInt } from './requestParser.js'

const upload = multer({ dest: 'uploads/' }); // Temporarily stores files in 'uploads/' directory
const router = Router();

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


router.get('/all-user-ids', async (req, res) => {
    try {
        const userIds = await getAllUserIds();
        res.json(userIds);
    } catch (error) {
        console.error("Failed to retrieve user IDs:", error);
        res.status(500).json({ error: "Failed to retrieve user IDs" });
    }
});

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

router.post('/upload-picture', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const { user_id, pic_number } = req.body;
    if (!user_id || !pic_number) {
        return res.status(400).send('Missing user_id or pic_number.');
    }

    try {
        // Upload file to blob storage
        const stream = fs.createReadStream(req.file.path);
        const streamLength = req.file.size;
        const blobName = `user-${user_id}-pic-${pic_number}`;
        const pictureUrl = await uploadFileToBlobStorage(blobName, stream, streamLength);

        // Save picture URL to database
        await savePictureUrl(user_id, pictureUrl, pic_number);

        // Send success response
        res.status(200).json({ message: 'File uploaded successfully', pictureUrl });

        // Optionally, delete the file after upload to save space
        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Failed to upload file.');
    }
});

router.get('/user-pictures', async (req, res) => {
    const user_id = req.query.user_id;

    if (!user_id) {
        return res.status(400).json(createErrorObj("Must include a user_id in the query parameter!"));
    }

    try {
        const pictureSasUrls = await retrievePictureUrls(user_id);
        res.status(200).json({ pictureUrls: pictureSasUrls });
    } catch (error) {
        console.error("Error retrieving picture SAS URLs:", error);
        res.status(500).json(createErrorObj("Failed to retrieve picture URLs. Please try again later."));
    }
});
