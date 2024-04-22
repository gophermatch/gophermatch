import { Router } from 'express';
import { recordUserDecision, 
    deleteMatchDecision, 
    getSavedMatches, 
    retrieveUserMatches, 
    deleteInboxMatch,
    getFilterResults, 
    getFilterResultsQna,
    getUserUnseenMatches,
    markUserMatchesAsSeen
} from '../database/match.js';

import { AuthStatusChecker, loginUser, logoutUser } from '../auth.js'
import { createErrorObj } from './routeutil.js'

const router = Router()

// Takes a json with the parameters user1Id, user2Id, decision
router.post('/matcher', AuthStatusChecker, async (req, res) => {
    const { user1Id, user2Id, decision } = req.body;

    // Basic validation
    if (!user1Id || !user2Id || !decision) {
        return res.status(400).json({ error: "Missing parameteres for matcher" });
    }

    try {
        const result = await recordUserDecision(user1Id, user2Id, decision);
        res.json(result);
    } catch (error) {
        console.error('Error processing match:', error);
        res.status(500).json({ error: "Failed to process match decision." });
    }
});


router.post('/filter-results', async (req, res) => {
    const { userdataFilters, qnaFilters } = req.body;

    if(!userdataFilters || !qnaFilters){
        return res.status(400).json({ error: "Missing parameters for filter-results"});
    }

    try {
        const userdataResults = await getFilterResults(userdataFilters);
        const qnaResults = await getFilterResultsQna(qnaFilters);
        const commonUserIds = userdataResults.filter(id => qnaResults.includes(id));
        res.json(commonUserIds);
    } catch (error) {
        console.error('Error getting filter results:', error);
        res.status(500).json({ error: "Failed to get filter results." });
    }
});

router.get('/saved-matches', AuthStatusChecker, async (req, res) => {
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
router.delete('/remove', AuthStatusChecker, async (req, res) => {
    // Basic validation
    const { user1Id, user2Id, decision } = req.body;
    if (!user1Id || !user2Id || !decision) {
        return res.status(400).json({ error: "Missing parameters for remove" });
    }

    try {
        await deleteMatchDecision(user1Id, user2Id, decision);
        res.status(200).send({ message: "Match decision deleted successfully." });
    } catch (error) {
        console.error('Error processing match:', error);
        res.status(500).json({ error: "Failed to process match decision." });
    }
});

router.delete('/inbox-delete', AuthStatusChecker, async (req, res) => {
    // Basic validation
    const { user1_id, user2_id } = req.query;
    if (!user1_id || !user2_id ) {
        return res.status(400).json({ error: "Missing parameters for inbox-delete" });
    }
    if(req.session.user.user_id != user1_id){
        console.log(user1_id)
        res.status(403).json(createErrorObj("Cannot delete another use's account"))
        return
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
router.get('/inbox', AuthStatusChecker, async (req, res) => {
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