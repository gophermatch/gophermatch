import { Router } from 'express';
import {
    recordUserDecision,
    deleteMatchDecision,
    getSavedMatches,
    retrieveUserMatches,
    deleteInboxMatch,
    getFilterResults,
    getFilterResultsQna,
    getUserUnseenMatches,
    markUserMatchesAsSeen,
    getProfileInfoMultiple,
    getInteractedProfiles,
    unrejectAll
} from "../database/match.js";

const router = Router();

/**
 * Records a user's decision regarding another user (match, reject, unsure).
 * 
 * @route POST /matcher
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/matcher', async (req, res) => {
    const { user1Id, user2Id, decision } = req.body;

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

/**
 * Unrejects all 'reject' decisions for a given user.
 * 
 * @route POST /unrejectall
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/unrejectall', async (req, res) => {
    const { user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ error: "Missing required field user_id" });
    }

    try {
        const result = await unrejectAll(user_id);
        res.json(result);
    } catch (error) {
        console.error('Error unrejecting:', error);
        res.status(500).json({ error: "Failed to unreject." });
    }
});

/**
 * Retrieves filter results based on user data and filters.
 * 
 * @route POST /filter-results
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/filter-results', async (req, res) => {
    const { user_id, userData, filters, amount } = req.body;

    try {
        const userdataResults = await getFilterResults(userData);
        const qnaResults = await getFilterResultsQna(filters);
        const interactedProfiles = await getInteractedProfiles(user_id);

        const commonUserIds = userdataResults.filter(id => qnaResults.includes(id) && !interactedProfiles.includes(id) && id !== user_id);
        const profileData = await getProfileInfoMultiple(commonUserIds.slice(0, amount));
        res.json(profileData);
    } catch (error) {
        console.error('Error getting filter results:', error);
        res.status(500).json({ error: "Failed to get filter results." });
    }
});

/**
 * Retrieves saved matches for a given user.
 * 
 * @route GET /saved-matches
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/saved-matches', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).send({ error: "Invalid user ID." });
        }

        const savedMatches = await getSavedMatches(userId);
        res.json(savedMatches);
    } catch (error) {
        console.error('Failed to retrieve saved matches:', error);
        res.status(500).send({ error: "Internal server error." });
    }
});

/**
 * Deletes a match decision from the database.
 * 
 * @route DELETE /remove
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.delete('/remove', async (req, res) => {
    const { user1Id, user2Id, decision } = req.query;

    if (!user1Id || !user2Id || !decision) {
        return res.status(400).json({ error: "Missing required fields: user1Id, user2Id, or decision." });
    }

    try {
        await deleteMatchDecision(user1Id, user2Id, decision);
        res.status(200).send({ message: "Match decision deleted successfully." });
    } catch (error) {
        console.error('Error processing match:', error);
        res.status(500).json({ error: "Failed to process match decision." });
    }
});

/**
 * Deletes an inbox match between two users.
 * 
 * @route DELETE /inbox-delete
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.delete('/inbox-delete', async (req, res) => {
    const { user1_id, user2_id } = req.query;

    if (!user1_id || !user2_id) {
        return res.status(400).json({ error: "Missing required fields: user1_id, user2_id" });
    }

    try {
        await deleteInboxMatch(user1_id, user2_id);
        res.status(200).send({ message: "Inbox match deleted successfully." });
    } catch (error) {
        console.error('Error processing match:', error);
        res.status(500).json({ error: "Failed to process inbox delete." });
    }
});

/**
 * Retrieves matched user IDs with match timestamp for a given user.
 * 
 * @route GET /inbox
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/inbox', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).send('User ID is required');
        }

        const matches = await retrieveUserMatches(userId);
        res.json(matches);
    } catch (error) {
        res.status(500).send('Failed to retrieve matches');
    }
});

/**
 * Retrieves unseen match IDs in the inbox for a given user.
 * 
 * @route GET /inbox-notif
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/inbox-notif', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) {
            return res.status(400).send('User ID is required');
        }

        const unseenMatches = await getUserUnseenMatches(userId);
        res.json(unseenMatches);
    } catch (error) {
        res.status(500).send('Failed to retrieve matches');
    }
});

/**
 * Marks all unseen new matches as seen for a given user.
 * 
 * @route POST /mark-seen
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/mark-seen', async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.status(400).send('User ID is required');
    }

    try {
        await markUserMatchesAsSeen(userId);
        res.status(200).send('All matches marked as seen');
    } catch (error) {
        console.error('Failed to mark matches as seen:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router;
