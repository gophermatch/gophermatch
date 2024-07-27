import multer from 'multer';
import { Router } from 'express';
import fs from 'fs';
import { createErrorObj } from './routeutil.js'
import {
    getProfile,
    updateProfile,
    savePictureUrl,
    retrievePictureUrls, createBio, removePicture, updateApartmentInfo,
    insertTopFive, getTopFive,
    getGeneralData, setGeneralData,
    updateUserTags, getUserSelectedTags, getAllTags
} from "../database/profile.js";
import{uploadFileToBlobStorage, generateBlobSasUrl} from '../blobService.js'
import { SearchLocation, parseValue, parseToPosInt } from './requestParser.js'
import { azureStorageConfig } from "../env.js";

const upload = multer({ dest: 'uploads/' }); // Temporarily stores files in 'uploads/' directory
const router = Router();

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
    const updatingApartment = req.body.updating_apartment
    //delete profile.user_id // prevent user from chaning the user_id of their profile record
    // Note: commented out because it wasn't letting insert top 5 work

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
        console.log("went to apent")
        if(updatingApartment == 1){
            await updateApartmentInfo(user_id, req.body.apartmentInfo)
            console.log("went to apartment")
        }
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

// Save/update QnA for a user
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
        const blobName = `user-${user_id}-uploaded-${Date.now()}`;
        const pictureUrl = `https://${azureStorageConfig.accountName}.blob.core.windows.net/user-profile-images/${blobName}`;

        await uploadFileToBlobStorage(blobName, stream, streamLength);

        // Save picture URL to database
        const result = await savePictureUrl(user_id, pictureUrl, pic_number);

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

router.delete('/remove-picture', async (req, res) => {

    const { user_id, pic_number } = req.query;

    console.log("removing picture" + user_id + ", " + pic_number);

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

router.put('/insert-topfive', async (req, res) => {
    const {user_id, question, input1, input2, input3, input4, input5} = req.body;
    console.log("id: ", user_id, " question: ", question, " input1: ", input1)
    if (!user_id || !question || !input1){
        return res.status(400).json(createErrorObj("Missing parameters for insert-topfive"));
    }

    try {
        await insertTopFive(user_id, question, input1, input2, input3, input4, input5);
        return res.status(200).json({ message: "Inserted an option for top five" });
    } catch (error) {
        return res.status(500).json(createErrorObj("Failed to insert option for top five."));
    }
});

router.get('/get-topfive', async (req, res) => {
    const {user_id} = req.query;
    if (!user_id){
        return res.status(400).json(createErrorObj("Missing parameters for insert-topfive"));
    }

    try {
        const optInput = await getTopFive(user_id);
        return res.json(optInput);
    } catch (error) {
        return res.status(500).json(createErrorObj("Failed to get top five."));
    }
});

// gets all fields from u_generaldata given a user_id
router.get('/get-gendata', async (req, res) => {
    const {user_id} = req.query;
    if (!user_id){
        return res.status(400).json(createErrorObj("Missing parameters for get-gendata"));
    }

    try {
        const results = await getGeneralData(user_id);
        return res.json(results);
    } catch (error) {
        return res.status(500).json(createErrorObj("Failed to get general data."));
    }
});


// sets/updates a all fields in u_generaldata given a user_id and data. Example I use in postman route:
// Any fields not included in data are filled with default values
/*
    {
        "user_id": 56,
        "data": {
            "wakeup_time": 90,
            "sleep_time": 150,
            "substances": "Yes",
            "room_activity": "Party"
            // add other fields as needed
        }
    }
*/
router.post('/set-gendata', async (req, res) => {
    const { user_id, data } = req.body;
    if (!user_id || !data) {
        return res.status(400).json(createErrorObj("Missing parameters for set-gendata"));
    }

    try {
        const results = await setGeneralData(user_id, data);
        return res.json({ message: "Data updated successfully"});
    } catch (error) {
        return res.status(500).json(createErrorObj("Failed to set general data."));
    }
});

// updates the users tags given a user id and array of selected tag ids. Example I used in postman
/*
    {
        "user_id": 47,
        "tag_ids": [
            2,
            3,
            6
        ]
    }
*/

router.post('/update-user-tags', async (req, res) => {
    const { user_id, tag_ids } = req.body;
    if (!user_id || !Array.isArray(tag_ids)) {
        return res.status(400).json({ error: 'Missing or invalid parameters' });
    }

    try {
        await updateUserTags(user_id, tag_ids);
        res.json({ message: 'User tags updated successfully' });
    } catch (error) {
        console.error('Error updating user tags:', error);
        res.status(500).json({ error: 'Failed to update user tags' });
    }
});

// returns an array of a users selected tag ids
// postman route no json is {{api_url}}/profile/user-selected-tags?user_id=47
router.get('/user-selected-tags', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ error: 'Missing user_id parameter' });
    }

    try {
        const tagIds = await getUserSelectedTags(user_id);
        res.json({ user_id, tag_ids: tagIds });
    } catch (error) {
        console.error('Error getting user selected tags:', error);
        res.status(500).json({ error: 'Failed to get user selected tags' });
    }
});

// returns all tag ids (don't hard code tags). Example output:
/*
    {
        "tag_ids": [
            {
                "tag_id": 1,
                "tag_text": "Gym"
            },
            {
                "tag_id": 2,
                "tag_text": "Needs Parking"
            },
        ]
    }
*/
router.get('/all-tag-ids', async (req, res) => {
    try {
        const tagIds = await getAllTags();
        res.json({ tag_ids: tagIds });
    } catch (error) {
        console.error('Error getting all tag ids:', error);
        res.status(500).json({ error: 'Failed to get all tag ids' });
    }
});


export default router