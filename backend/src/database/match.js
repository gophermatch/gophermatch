import { db, tableNames } from './db.js'

/**
 * Records a user's decision about another user and checks for a mutual match.
 * @param {number} user1Id - ID of the user making the decision.
 * @param {number} user2Id - ID of the user being evaluated.
 * @param {string} decision - The decision made ('match', 'reject', 'unsure').
 * @returns {Promise<{matchFound: boolean, message: string}>} - A promise that resolves to the outcome of the operation.
 */
export async function recordUserDecision(user1Id, user2Id, decision) {
    try {
        // Use the table name from your 'tableNames' object
        const insertDecisionQuery = `
            INSERT INTO ${tableNames.u_matches} (user_id, match_user_id, match_status) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE match_status = VALUES(match_status);
        `;
        await db.query(insertDecisionQuery, [user1Id, user2Id, decision]);

        // Use the table name from your 'tableNames' object for the check query as well

        const result = await checkMatch(user1Id, user2Id);
        if (decision === 'match' && result.length > 0) {
            return { matchFound: true, message: "It's a match!" };
        }
        return { matchFound: false, message: "Decision recorded. Waiting for the other user." };


    } catch (error) {
        console.error('Error in recordUserDecision:', error);
        throw new Error('Failed to record user decision');
    }
}

export async function checkMatch(user1Id, user2Id) {
    return new Promise((resolve, reject) => {
        const checkMatchQuery = `
            SELECT match_status FROM ${tableNames.u_matches} 
            WHERE user_id = ? AND match_user_id = ? AND match_status = 'match';
        `;

        db.query(checkMatchQuery, [user2Id, user1Id], (err, results) => {
            if (err) {
                console.error("Error fetching match status from database:", err);
                reject(err);
                return;
            }
            resolve(results);
        });
    });
}
