import multer from 'multer';
import { Router } from 'express';
import fs from 'fs';
import { createErrorObj } from './routeutil.js';
import {
    getProfile,
    updateProfile,
    savePictureUrl,
    retrievePictureUrls,
    createBio,
    removePicture,
    updateApartmentInfo,
    insertTopFive,
    getTopFive
} from "../database/profile.js";
import { uploadFileToBlobStorage, generateBlobSasUrl } from '../blobService.js';
import { SearchLocation, parseValue, parseToPosInt } from './requestParser.js';
import { azureStorageConfig } from "../env.js";

const upload = multer({ dest: 'uploads/' });
const router = Router();

/**
 * Retrieves a user's profile by user ID.
 * 
 * @route GET /api/profile/
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/', async (req, res) => {
    const user_id = req.query.user_id;

    if (!user_id) {
        res.status(400).json(createErrorObj("Must include a user_id in the query parameter!"));
        return;
    }

    try {
        const profile = await getProfile(user_id);
        res.status(200).json(profile);
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json(createErrorObj("Failed to fetch profile. Please try again later."));
    }
});

/**
 * Updates a user's profile.
 * 
 * @route PUT /api/profile/
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.put('/', async (req, res) => {
    const user_id = req.body.user_id;
    const profile = req.body.profile;
    const updatingApartment = req.body.updating_apartment;

    if (!user_id || !profile) {
        res.status(400).json(createErrorObj("Must specify the user_id and profile object to update the profile!"));
        return;
    }

    if (user_id !== req.session.user.user_id) {
        res.status(400).json(createErrorObj("Cannot update someone else's profile!"));
        return;
    }

    if (Object.keys(profile).length == 0) {
        res.status(400).json(createErrorObj("Must provide some new values to update! (To delete a value, use the value null)"));
        return;
    }

    try {
        await updateProfile(user_id, profile);
        if (updatingApartment == 1) {
            await updateApartmentInfo(user_id, req.body.apartmentInfo);
        }
        res.status(200).json({ message: "Profile updated!" });
    } catch (e) {
        console.error(e);
        res.status(400).json(createErrorObj(e));
    }
});

/**
 * Retrieves all user IDs.
 * 
 * @route GET /api/profile/all-user-ids
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/all-user-ids', async (req, res) => {
    try {
        const userIds = await getAllUserIds();
        res.json(userIds);
    } catch (error) {
        console.error("Failed to retrieve user IDs:", error);
        res.status(500).json({ error: "Failed to retrieve user IDs" });
    }
});

/**
 * Retrieves QnA for a user by user ID.
 * 
 * @route GET /api/profile/qna
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/qna', async (req, res) => {
    const user_id = req.query.user_id;

    if (!user_id) {
        res.status(400).json(createErrorObj("Must include a user_id in the query parameter!"));
        return;
    }

    try {
        const qna = await getQnA(user_id);
        res.status(200).json(qna);
    } catch (e) {
        console.error(e);
        res.status(400).json(createErrorObj(e));
    }
});

/**
 * Saves or updates QnA for a user.
 * 
 * @route PUT /api/profile/qna
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.put('/qna', async (req, res) => {
    const user_id = req.body.user_id;
    const qna = req.body.qna;

    if (!user_id || !qna) {
        res.status(400).json(createErrorObj("Must specify user_id and qna to update QnA!"));
        return;
    }

    try {
        await saveQnA(user_id, qna);
        res.status(200).json({ message: "QnA updated!" });
    } catch (e) {
        console.error(e);
        res.status(400).json(createErrorObj(e));
    }
});

/**
 * Uploads a picture for a user.
 * 
 * @route POST /api/profile/upload-picture
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/upload-picture', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    const { user_id, pic_number } = req.body;
    if (!user_id || !pic_number) {
        return res.status(400).send('Missing user_id or pic_number.');
    }

    try {
        const stream = fs.createReadStream(req.file.path);
        const streamLength = req.file.size;
        const blobName = `user-${user_id}-uploaded-${Date.now()}`;
        const pictureUrl = `https://${azureStorageConfig.accountName}.blob.core.windows.net/user-profile-images/${blobName}`;

        await uploadFileToBlobStorage(blobName, stream, streamLength);

        const result = await savePictureUrl(user_id, pictureUrl, pic_number);

        res.status(200).json({ message: 'File uploaded successfully', pictureUrl });

        fs.unlink(req.file.path, (err) => {
            if (err) console.error("Error deleting file:", err);
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).send('Failed to upload file.');
    }
});

/**
 * Retrieves picture URLs for a user by user ID.
 * 
 * @route GET /api/profile/user-pictures
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
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

/**
 * Removes a picture for a user.
 * 
 * @route DELETE /api/profile/remove-picture
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.delete('/remove-picture', async (req, res) => {
    const { user_id, pic_number } = req.query;

    if (!user_id) {
        return res.status(400).json(createErrorObj("Must include a user_id in the query parameter!"));
    }

    if (!pic_number) {
        return res.status(400).json(createErrorObj("Must include a pic number in the query parameter!"));
    }

    try {
        await removePicture(user_id, pic_number);
        return res.status(200).json();
    } catch (error) {
        console.error("Error removing picture", error);
        return res.status(500).json(createErrorObj("Failed to remove picture. Please try again later."));
    }
});

/**
 * Inserts or updates the top five responses for a given user.
 * 
 * @route PUT /api/profile/insert-topfive
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.put('/insert-topfive', async (req, res) => {
    const { user_id, question, input1, input2, input3, input4, input5 } = req.body;

    if (!user_id || !question || !input1) {
        return res.status(400).json(createErrorObj("Missing parameters for insert-topfive"));
    }

    try {
        await insertTopFive(user_id, question, input1, input2, input3, input4, input5);
        return res.status(200).json({ message: "Inserted an option for top five" });
    } catch (error) {
        return res.status(500).json(createErrorObj("Failed to insert option for top five."));
    }
});

/**
 * Retrieves the top five responses for a given user.
 * 
 * @route GET /api/profile/get-topfive
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/get-topfive', async (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json(createErrorObj("Missing parameters for insert-topfive"));
    }

    try {
        const optInput = await getTopFive(user_id);
        return res.json(optInput);
    } catch (error) {
        return res.status(500).json(createErrorObj("Failed to get top five."));
    }
});

export default router;
