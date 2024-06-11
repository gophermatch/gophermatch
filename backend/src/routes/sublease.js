import { Router } from 'express';
import { createErrorObj } from './routeutil.js';
import {
    createSublease,
    getSublease,
    deleteSublease,
    getSubleases,
    updateSublease,
    saveSublease,
    deleteSavedSublease,
    getSavedSubleases
} from "../database/sublease.js";

const router = Router();

/**
 * Retrieves a sublease by user ID.
 * 
 * @route GET /sublease/get
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/get', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: "user_id is required" });
    }

    try {
        const sublease = await getSublease(user_id);
        res.json(sublease);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

/**
 * Retrieves multiple subleases based on query parameters.
 * 
 * @route GET /sublease/getmultiple
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/getmultiple', async (req, res) => {
    if (!req.query) {
        return res.status(400).json({ message: "invalid params" });
    }

    try {
        const subleases = await getSubleases(req.query);
        res.json(subleases);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

/**
 * Deletes a sublease by user ID.
 * 
 * @route DELETE /sublease/delete
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.delete('/delete', async (req, res) => {
    const { user_id } = req.query;
    if (!user_id) {
        return res.status(400).json({ message: "user_id is required" });
    }

    try {
        await deleteSublease(user_id);
        res.json({ message: 'Sublease successfully deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * Inserts a new sublease.
 * 
 * @route PUT /sublease/insert
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.put('/insert', async (req, res) => {
    try {
        const subleaseData = req.body.sublease_data;
        const result = await createSublease(subleaseData);

        res.status(201).json({
            message: 'Sublease created successfully',
            data: result
        });
    } catch (error) {
        console.error('Error inserting sublease:', error);
        res.status(500).json(createErrorObj('Error creating sublease', error.message));
    }
});

/**
 * Updates an existing sublease.
 * 
 * @route PUT /sublease/update
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.put('/update', async (req, res) => {
    try {
        const subleaseData = req.body.sublease_data;
        const result = await updateSublease(subleaseData);

        res.status(201).json({
            message: 'Sublease updated successfully',
            data: result
        });
    } catch (error) {
        console.error('Error updating sublease:', error);
        res.status(500).json(createErrorObj('Error updating sublease', error.message));
    }
});

/**
 * Saves a sublease for a user.
 * 
 * @route POST /sublease/save
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/save', async (req, res) => {
    try {
        const { user_id, sublease_id } = req.body;

        if (!user_id || !sublease_id) {
            return res.status(400).json({ error: "Missing required fields: user_id, sublease_id." });
        }

        await saveSublease(user_id, sublease_id);
        res.json({ message: 'Sublease successfully saved' });
    } catch (error) {
        console.error("Error saving sublease:", error);
        res.status(500).json(createErrorObj('Error saving sublease', error.message));
    }
});

/**
 * Deletes a saved sublease for a user.
 * 
 * @route DELETE /sublease/delete-save
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.delete('/delete-save', async (req, res) => {
    try {
        const { user_id, sublease_id } = req.query;

        if (!user_id || !sublease_id) {
            return res.status(400).json({ error: "Missing required fields: user_id, sublease_id." });
        }

        await deleteSavedSublease(user_id, sublease_id);
        res.json({ message: 'Sublease successfully deleted' });
    } catch (error) {
        console.error("Error deleting sublease:", error);
        res.status(500).json(createErrorObj('Error deleting sublease', error.message));
    }
});

/**
 * Retrieves saved subleases for a given user.
 * 
 * @route GET /sublease/get-saves
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/get-saves', async (req, res) => {
    try {
        const { user_id } = req.query;

        if (!user_id) {
            return res.status(400).json({ error: "Missing required fields: user_id." });
        }

        const subleases = await getSavedSubleases(user_id);
        res.json(subleases);
    } catch (error) {
        console.error("Error getting saved sublease:", error);
        res.status(500).json(createErrorObj('Error getting saved sublease', error.message));
    }
});

export default router;
