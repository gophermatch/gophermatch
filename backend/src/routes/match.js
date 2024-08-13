import { Router } from 'express';
import {
    recordUserDecision,
    deleteMatchDecision,
    getSavedMatches,
    retrieveUserMatches,
    deleteInboxMatch,
    getFilterResults,
    getUserUnseenMatches,
    markUserMatchesAsSeen, getInteractedProfiles, unrejectAll, getMatchingShowDormValues
} from "../database/match.js";

const router = Router()

// Takes a json with the parameters user1Id, user2Id, decision
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

router.post('/unrejectall', async (req, res) => {
    const { user_id } = req.body;

    // Basic validation
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


router.post('/filter-results', async (req, res) => {
    const { user_id, userData, amount } = req.body;

    try {
        const userdataResults = await getFilterResults(userData);

        const interactedProfiles = await getInteractedProfiles(user_id);

        const matchingShowDormValues = await getMatchingShowDormValues(user_id);

        const commonUserIds = userdataResults
            .filter(id => !interactedProfiles.includes(id) && id !== user_id)
            .filter(id => matchingShowDormValues.includes(id));

        res.json(commonUserIds);
    } catch (error) {
        console.error('Error getting filter results:', error);
        res.status(500).json({ error: "Failed to get filter results." });
    }
});

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

// Delete a decision from the match table (remove a save for a user with decision unsure)
// Takes a json with the parameters user1Id, user2Id, decision
router.delete('/remove', async (req, res) => {
    // Basic validation
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

router.delete('/inbox-delete', async (req, res) => {
    // Basic validation
    const { user1_id, user2_id } = req.query;
    if (!user1_id || !user2_id ) {
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

// Takes a json with parameter userId and returns json with matched userids with match timestamp
router.get('/inbox', async (req, res) => {
    try {
        const {userId} = req.query;
        if (!userId) {
            return res.status(400).send('User ID is required');
        }

        const matches = await retrieveUserMatches(userId);
        res.json(matches);
    } catch (error) {
        res.status(500).send('Failed to retrieve matches');
    }
});

// Takes a json with parameter userId and returns an array of unseen match ids in the inbox
router.get('/inbox-notif', async (req, res) => {
    try {
        const {userId} = req.query;
        if (!userId) {
            return res.status(400).send('User ID is required');
        }

        const unseenMatches = await getUserUnseenMatches(userId);
        res.json(unseenMatches);
    } catch (error) {
        res.status(500).send('Failed to retrieve matches');
    }
});

// Call this when a user clicks on inbox to set all unseen new matches to seen
router.post('/mark-seen', async (req, res) => {
    const {userId} = req.body;
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