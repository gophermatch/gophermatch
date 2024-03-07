import { Router } from 'express';
import { recordUserDecision } from '../database/match.js';

const router = Router();

// Endpoint to record a user's decision about another user
router.post('/matcher', async (req, res) => {
    const { user1Id, user2Id, decision } = req.body;

    // Basic validation
    if (!user1Id || !user2Id || !decision) {
        return res.status(400).json({ error: "Missing required fields: user1Id, user2Id, or decision." });
    }

    try {
        const result = await recordUserDecision(user1Id, user2Id, decision);
        res.json(result);
    } catch (error) {
        console.error('Error processing match:', error);
        res.status(500).json({ error: "Failed to process match decision." });
    }
});

export default router;