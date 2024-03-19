// Assuming the existence of a database module for executing queries
import { db , tableNames} from './db.js'; // Your database connection setup
import { queryRowsToArray, buildSelectString, buildInsertString, buildUpdateString } from './dbutils.js'


/**
 * Records a user's decision about another user and checks for a mutual match.
 * @param {number} user1Id - ID of the user making the decision.
 * @param {number} user2Id - ID of the user being evaluated.
 * @param {string} decision - The decision made ('match', 'reject', 'unsure').
 * @returns {Promise<{matchFound: boolean, message: string}>} - A promise that resolves to the outcome of the operation.
 */
export async function recordUserDecision(user1Id, user2Id, decision) {
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

// Function to get user_ids based on filters for gender and college
export async function getFilterResults(filters) {
    return new Promise((resolve, reject) => {
        // Construct where clause based on provided filters
        // We only include filters that are not empty strings
        const whereClause = Object.keys(filters).reduce((acc, key) => {
            if (filters[key] !== '') {
                acc[key] = filters[key];
            }
            return acc;
        }, {});

        // Build the SQL query string
        const { queryString, values } = buildSelectString("user_id", tableNames.u_userdata, whereClause);

        // Execute the query
        db.query(queryString, values, (err, rows) => {
            if (err) {
                console.error("Error querying filter results from database:", err);
                reject(err);
                return;
            }

            // Extract user_id from each row and return an array of user_ids
            const userIds = rows.map(row => row.user_id);
            resolve(userIds);
        });
    });
}
