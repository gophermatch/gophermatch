import { db, tableNames } from './db.js'

/**
 * Records a user's decision about another user and checks for a mutual match.
 * @param {number} user1Id - ID of the user making the decision.
 * @param {number} user2Id - ID of the user being evaluated.
 * @param {string} decision - The decision made ('match', 'reject', 'unsure').
 * @returns {matchFound: boolean, message: string}
 */
export async function recordUserDecision(user1Id, user2Id, decision) {
    try {
        const insertDecisionQuery = `
            INSERT INTO ${tableNames.u_matches} (user_id, match_user_id, match_status) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE match_status = VALUES(match_status);
        `;
        await db.query(insertDecisionQuery, [user1Id, user2Id, decision]);

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

/**
 * Retrieves all user IDs that the specified user has marked as 'unsure'.
 * @param {number} user1Id - ID of the user retrieving saved matches.
 * @returns {Promise<number[]>} - A promise that resolves to an array of user IDs marked as 'unsure' by the user.
 */
export async function getSavedMatches(userId) {
    return new Promise((resolve, reject) => {
        // Assuming 'user_id' is the column name in your 'users' table that holds the user IDs
        const getSavedMatchesQuery = `
            SELECT match_user_id FROM ${tableNames.u_matches}
            WHERE user_id = ? AND match_status = 'unsure';
        `;
  
        db.query(getSavedMatchesQuery, userId, (err, rows) => {
            if (err) {
                console.error("Error fetching user IDs from database:", err);
                reject(err);
                return;
            }
  
            // Extract user_id from each row and return an array of user_ids
            const saveIds = rows.map(row => row.match_user_id);
            resolve(saveIds);
        });
    });
}

/**
 * Deletes a match decision from the database.
 * @param {number} userId - The user ID making the decision.
 * @param {number} matchUserId - The ID of the user being evaluated.
 * @param {string} decision - The decision to be removed ('match', 'reject', 'save').
 */
export async function deleteMatchDecision(userId, matchUserId, decision) {
    try {
        const deleteQuery = `
            DELETE FROM ${tableNames.u_matches}
            WHERE user_id = ? AND match_user_id = ? AND match_status = ?;
        `;

        await db.query(deleteQuery, [userId, matchUserId, decision]);
        console.log(`Deleted decision '${decision}' for user_id=${userId} and match_user_id=${matchUserId}.`);

    } catch (error) {
        console.error('Error in deleteMatchDecision:', error);
        throw new Error('Failed to delete match decision');
    }
}