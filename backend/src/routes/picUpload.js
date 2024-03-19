import { Router } from 'express';
import multer from 'multer';
import fs from 'fs';
import { createErrorObj } from './routeutil.js';
import { 
    getProfile,
    updateProfile,
    savePictureUrl,
    retrievePictureUrls
} from '../database/profile.js';
import { uploadFileToBlobStorage, generateBlobSasUrl } from '../blobService.js';

const upload = multer({ dest: 'uploads/' });
const router = Router();

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

router.put('/', async (req, res) => {
    const user_id = req.body.user_id;
    const profile = req.body.profile;
    delete profile.user_id;

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
        res.status(200).json({ message: "Profile updated!" });
    } catch (e) {
        console.error(e);
        res.status(400).json(createErrorObj(e));
    }
});

router.get('/all-user-ids', async (req, res) => {
    try {
        const userIds = await getAllUserIds();
        res.json(userIds);
    } catch (error) {
        console.error("Failed to retrieve user IDs:", error);
        res.status(500).json({ error: "Failed to retrieve user IDs" });
    }
});

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
        const blobName = `user-${user_id}-pic-${pic_number}`;
        const pictureUrl = await uploadFileToBlobStorage(blobName, stream, streamLength);

        await savePictureUrl(user_id, pictureUrl, pic_number);

        res.status(200).json({ message: 'File uploaded successfully', pictureUrl });

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

export default router;
