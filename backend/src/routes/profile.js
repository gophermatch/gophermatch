import multer from 'multer';
import { Router } from 'express';
import fs from 'fs';
import { createErrorObj } from './routeutil.js'
import {
    savePictureUrl,
    retrievePictureUrls, removePicture,
    insertTopFive, getTopFive,  getPollQuestions,
    updatePollQuestion,
    getPollOptions,
    updatePollOption,
    createPollOption,
    deletePollOption,
    getGeneralData, setGeneralData,
    updateUserTags, getUserSelectedTags, getAllTags, toggleDormAndApartment, getHousingPreference, getState
} from "../database/profile.js";
import{uploadFileToBlobStorage, generateBlobSasUrl} from '../blobService.js'
import { SearchLocation, parseValue, parseToPosInt } from './requestParser.js'
import { azureStorageConfig } from "../env.js";

const upload = multer({ dest: 'uploads/' }); // Temporarily stores files in 'uploads/' directory
const router = Router();

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

// Get poll questions for a user
router.get('/poll-questions', async (req, res) => {
    const user_id = req.query.user_id;

    if (!user_id) {
        res.status(400).json(createErrorObj("Must include a user_id in the query parameter!"));
        return;
    }

    try {
        const questions = await getPollQuestions(user_id);
        res.status(200).json(questions);
    } catch (error) {
        console.error("Error fetching poll questions:", error);
        res.status(500).json(createErrorObj("Failed to fetch poll questions. Please try again later."));
    }
});

// Update poll question for a user
router.put('/poll-question', async (req, res) => {
    const user_id = req.body.user_id;
    const question_text = req.body.question_text;

    if (!user_id || !question_text) {
        res.status(400).json(createErrorObj("Must specify user_id and question_text to update poll question!"));
        return;
    }

    try {
        await updatePollQuestion(user_id, question_text);
        res.status(200).json({ message: "Poll question updated!" });
    } catch (error) {
        console.error("Error updating poll question:", error);
        res.status(500).json(createErrorObj("Failed to update poll question. Please try again later."));
    }
});

// Get poll options for a user
router.get('/poll-options', async (req, res) => {
    const user_id = req.query.user_id;

    if (!user_id) {
        res.status(400).json(createErrorObj("Must include a user_id in the query parameter!"));
        return;
    }

    try {
        const options = await getPollOptions(user_id);
        res.status(200).json(options);
    } catch (error) {
        console.error("Error fetching poll options:", error);
        res.status(500).json(createErrorObj("Failed to fetch poll options. Please try again later."));
    }
});

// Update poll option for a user
router.put('/poll-option', async (req, res) => {
    const { user_id, new_option_text, old_option_text } = req.body;

    if (!user_id || !new_option_text || !old_option_text) {
        res.status(400).json(createErrorObj("Must specify user_id, new_option_text, and old_option_text to update poll option!"));
        return;
    }

    try {
        await updatePollOption(user_id, new_option_text, old_option_text);
        res.status(200).json({ message: "Poll option updated!" });
    } catch (error) {
        console.error("Error updating poll option:", error);
        res.status(500).json(createErrorObj("Failed to update poll option. Please try again later."));
    }
});

// Update dorm/apartment preference
router.put('/toggle-dorm', async (req, res) => {
    const { user_id } = req.body;

    try {
        await toggleDormAndApartment(user_id);
        res.status(200).json({ message: "Apartment/Dorm Toggled!" });
    } catch (error) {
        console.error("Error toggling dorm and apartment.", error);
        res.status(500).json(createErrorObj("Failed to toggle dorm/apartment. Please try again later."));
    }
});

// Get dorm/apartment preference
router.get('/get-housingpref', async (req, res) => {
    const user_id = req.query.user_id;

    if (!user_id) {
        res.status(400).json(createErrorObj("Must include a user_id in the query parameter!"));
        return;
    }

    try {
        const housingPref = await getHousingPreference(user_id);
        res.status(200).json(housingPref);
    } catch (error) {
        console.error("Error finding housing preference.", error);
        res.status(500).json(createErrorObj("Failed find housing preference. Please try again later."));
    }
});

// Create a new poll option for a user
router.post('/poll-option', async (req, res) => {
    const { user_id, option_text } = req.body;

    if (!user_id || !option_text) {
        res.status(400).json(createErrorObj("Must specify user_id and option_text to create poll option!"));
        return;
    }

    try {
        await createPollOption(user_id, option_text);
        res.status(200).json({ message: "Poll option created!" });
    } catch (error) {
        console.error("Error creating poll option:", error);
        res.status(500).json(createErrorObj("Failed to create poll option. Please try again later."));
    }
});

// Delete a poll option for a user
router.delete('/poll-option', async (req, res) => {
    const { user_id, option_text } = req.body;

    if (!user_id || !option_text) {
        res.status(400).json(createErrorObj("Must specify user_id and option_text to delete poll option!"));
        return;
    }

    try {
        await deletePollOption(user_id, option_text);
        res.status(200).json({ message: "Poll option deleted!" });
    } catch (error) {
        console.error("Error deleting poll option:", error);
        res.status(500).json(createErrorObj("Failed to delete poll option. Please try again later."));
    }
});

// gets all fields from u_generaldata given a user_id\
router.get('/get-gendata', async (req, res) => {
    const {user_id} = req.query;
    const filter = req.query['filter[]'];

    if (!user_id) {
        return res.status(400).json({ error: "Missing parameters for get-gendata" });
    }

    try {
        const results = await getGeneralData(user_id, filter);
        console.log(results)
        return res.json(results);
    } catch (error) {
        return res.status(500).json({ error: "Failed to get general data." });
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
    console.log("setgen", data)

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
    console.log("taggy", tag_ids)

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

// Route to get the profile completion status for a user
router.get('/profile-state', async (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ error: 'Missing user_id parameter' });
    }

    try {
        const status = await getState(user_id);
        res.status(200).json(status);
    } catch (error) {
        console.error('Error getting profile completion status:', error);
        res.status(500).json({ error: 'Failed to get profile completion status' });
    }
});


export default router