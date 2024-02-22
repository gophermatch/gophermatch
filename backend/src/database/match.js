// Assuming the existence of a database module for executing queries
import { db } from './db.js'; // Your database connection setup

/**
 * Records a user's decision about another user and checks for a mutual match.
 * @param {number} user1Id - ID of the user making the decision.
 * @param {number} user2Id - ID of the user being evaluated.
 * @param {string} decision - The decision made ('match', 'reject', 'unsure').
 * @returns {Promise<{matchFound: boolean, message: string}>} - A promise that resolves to the outcome of the operation.
 */
async function recordUserDecision(user1Id, user2Id, decision) {
    try {
        // Step 1: Insert the decision into the database
        const insertDecisionQuery = `
            INSERT INTO u_matches (user_id, match_user_id, match_status) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE match_status = VALUES(match_status);
        `;
        await db.query(insertDecisionQuery, [user1Id, user2Id, decision]);

        // Step 2: Check if there's a reciprocal match
        const checkMatchQuery = `
            SELECT match_status FROM u_matches 
            WHERE user_id = ? AND match_user_id = ? AND match_status = 'match';
        `;
        const [rows] = await db.query(checkMatchQuery, [user2Id, user1Id]);
        
        if (rows.length > 0 && decision === 'match') {
            // A mutual match is found
            return { matchFound: true, message: "It's a match!" };
        } else {
            // No mutual match yet or the decision is not to match
            return { matchFound: false, message: "Decision recorded. Waiting for the other user." };
        }
    } catch (error) {
        console.error('Error in recordUserDecision:', error);
        throw new Error('Failed to record user decision');
    }
}