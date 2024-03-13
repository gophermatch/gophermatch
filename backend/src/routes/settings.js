// Import the database connection pool
import { db } from '../database/db.js';
import express from 'express';

const router = express.Router();

// Define a route for getting settings
router.get('/', async (req, res) => {
    try {
        // Query the database to get settings
        const [rows] = await db.query('SELECT * FROM settings');
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Settings not found' });
        }
        res.json(rows);
    } catch (error) {
        console.error('Error getting settings:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Define a route for updating settings
router.put('/', async (req, res) => {
    const { setting, value } = req.body;
    if (!setting || !value) {
        return res.status(400).json({ message: 'Invalid request body' });
    }

    try {
        // Update the setting in the database
        const result = await db.query('UPDATE settings SET value = ? WHERE name = ?', [value, setting]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Setting not found' });
        }
        res.sendStatus(200);
    } catch (error) {
        console.error('Error updating setting:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Define a route for getting user information
router.get('/user', async (req, res) => {
    try {
        // Query the database to get user information
        const [rows] = await db.query('SELECT * FROM user');
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'User information not found' });
        }
        res.json(rows);
    } catch (error) {
        console.error('Error getting user information:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

export default router;
