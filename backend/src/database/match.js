// Assuming the existence of a database module for executing queries
import { db , tableNames} from './db.js'; // Your database connection setup
import { queryRowsToArray, buildSelectString, buildInsertString, buildUpdateString, buildDeleteString } from './dbutils.js'

export async function recordUserDecision(user1Id, user2Id, decision) {
    try {
        // SQL query to insert or update the decision in the database.
        // Make helper function for this in the future
        const insertDecisionQuery = `
            INSERT INTO ${tableNames.u_matches} (user_id, match_user_id, match_status) 
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE match_status = VALUES(match_status);
        `;
        // Execute the query with provided user IDs and decision.
        await db.query(insertDecisionQuery, [user1Id, user2Id, decision]);

        // Check if a reciprocal match exists.
        const result = await checkMatch(user1Id, user2Id);
        // If both users have matched with each other, return a match found response.
        const user1_id = Math.min(user1Id, user2Id);
        const user2_id = Math.max(user1Id, user2Id);
        if (decision === 'match' && result.length > 0) {
            handleReciprocalMatch(user1_id, user2_id);
            return { matchFound: true, message: "It's a match!" };
        }
        // Otherwise, indicate that the decision has been recorded and waiting for the other user.
        return { matchFound: false, message: "Decision recorded. Waiting for the other user." };

    } catch (error) {
        // Log and throw an error if any part of the process fails.
        console.error('Error in recordUserDecision:', error);
        throw new Error('Failed to record user decision');
    }
}

export async function getFilterResults(filters) {
    return new Promise((resolve, reject) => {
        // Check if any filters are provided
        const hasFilters = Object.values(filters).some(value => value !== '');

        let queryString, values;

        if (!hasFilters) {
            // If no filters are provided, select all user_ids from u_userdata
            queryString = `SELECT DISTINCT user_id FROM ${tableNames.u_userdata}`;
            values = [];
        } else {
            // Construct where clause based on provided filters
            const whereClause = Object.keys(filters).reduce((acc, key) => {
                if (filters[key] !== '') {
                    acc[key] = filters[key];
                }
                return acc;
            }, {});

            const queryResult = buildSelectString("user_id", tableNames.u_userdata, whereClause);
            queryString = queryResult.queryString;
            values = queryResult.values;
        }

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



export async function getFilterResultsQna(optionIds) {
    return new Promise((resolve, reject) => {
        // If no optionIds provided, select all user_ids without any conditions
        if (!optionIds || optionIds.length === 0) {
            db.query(`SELECT DISTINCT user_id FROM u_qna`, [], (err, rows) => {
                if (err) {
                    console.error("Error querying all user_ids from u_qna:", err);
                    reject(err);
                    return;
                }
                const userIds = rows.map(row => row.user_id);
                resolve(userIds);
            });
            return;
        }

        const placeholders = optionIds.map(() => '?').join(',');
        let queryString = `SELECT user_id FROM u_qna WHERE option_id IN (${placeholders})`;

        queryString += ` GROUP BY user_id`;

        // If more than one optionId is provided, ensure users match all specified options
        if (optionIds.length > 1) {
            queryString += ` HAVING COUNT(DISTINCT option_id) = ${optionIds.length}`;
        }

        db.query(queryString, optionIds, (err, rows) => {
            if (err) {
                console.error("Error querying filter results from u_qna:", err);
                reject(err);
                return;
            }

            // Extract user_id from each row and return an array of user_ids
            const userIds = rows.map(row => row.user_id);
            resolve(userIds);
        });
    });
}


// Function to check if two users have mutually liked each other.
async function checkMatch(user1Id, user2Id) {
    return new Promise((resolve, reject) => {
        const { queryString, values } = buildSelectString("match_status", tableNames.u_matches, {
            user_id: user2Id,
            match_user_id: user1Id,
            match_status: 'match'
        });

        // Execute the query to find if there's a match.
        db.query(queryString, values, (err, results) => {
            if (err) {
                // Log and reject the promise if there's an error.
                console.error("Error fetching match status from database:", err);
                reject(err);
                return;
            }
            // Resolve the promise with the results of the query.
            resolve(results);
        });
    });
}

async function handleReciprocalMatch(user1Id, user2Id) {
    try {
        // SQL query to insert the match.
        const insertMatchQuery = `
            INSERT INTO ${tableNames.u_inboxt} (user1_id, user2_id)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE match_timestamp = VALUES(match_timestamp);
        `;
        // Execute the query.
        await db.query(insertMatchQuery, [user1Id, user2Id]);
        
        // Additional logic here (e.g., notifying users of the match).
    } catch (error) {
        console.error('Error in handleReciprocalMatch:', error);
        throw new Error('Failed to handle reciprocal match');
    }
}

// Function to retrieve all user IDs that a specified user has marked as 'unsure'.
export async function getSavedMatches(userId) {
    return new Promise((resolve, reject) => {
        const { queryString, values } = buildSelectString("match_user_id", tableNames.u_matches, {
            user_id: userId,
            match_status: 'unsure'
        });
  
        // Execute the query to find saved matches.
        db.query(queryString, values, (err, rows) => {
            if (err) {
                // Log and reject the promise if there's an error.
                console.error("Error fetching user IDs from database:", err);
                reject(err);
                return;
            }
  
            // Extract user_id from each row and return an array of user_ids.
            const saveIds = rows.map(row => row.match_user_id);
            resolve(saveIds);
        });
    });
}

// Function to delete a match decision from the database.
export async function deleteMatchDecision(userId, matchUserId, decision) {
    try {
        const { queryString, values } = buildDeleteString(tableNames.u_matches, {
            user_id: userId,
            match_user_id: matchUserId,
            match_status: decision
        });

        // Execute the query to delete the specified decision.
        await db.query(queryString, values);
        // Log the successful deletion.
        console.log(`Deleted decision '${decision}' for user_id=${userId} and match_user_id=${matchUserId}.`);

    } catch (error) {
        // Log and throw an error if the deletion fails.
        console.error('Error in deleteMatchDecision:', error);
        throw new Error('Failed to delete match decision');
    }
}

export async function deleteInboxMatch(user1Id, user2Id) {
    try {
        const USER1 = Math.min(user1Id, user2Id);
        const USER2 = Math.max(user1Id, user2Id);
        const { queryString, values } = buildDeleteString(tableNames.u_inboxt, {
            user1_id: USER1,
            user2_id: USER2,
        });

        // Execute the query to delete the specified decision.
        await db.query(queryString, values);
        deleteMatchDecision(user1Id, user2Id, "match");
        // Log the successful deletion.
        console.log(`Deleted inbox match for user1_id=${user1Id} and user2_id=${user2Id}.`);

    } catch (error) {
        // Log and throw an error if the deletion fails.
        console.error('Error in deleteMatchDecision:', error);
        throw new Error('Failed to delete match decision');
    }
}

export async function retrieveUserMatches(userId) {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                CASE 
                    WHEN user1_id = ? THEN user2_id 
                    ELSE user1_id 
                END AS matched_user_id,
                match_timestamp
            FROM ${tableNames.u_inboxt}
            WHERE user1_id = ? OR user2_id = ?
            ORDER BY match_timestamp ASC;
        `;
        
        db.query(query, [userId, userId, userId], (error, matches) => {
            if (error) {
                console.error('Error retrieving user matches:', error);
                reject(error); // Reject the promise if there's an error
            } else {
                // Transform the result to return only the matching user's ID.
                const transformedMatches = matches.map(match => {
                    return {
                        matchId: match.matched_user_id, // Use the aliased matched_user_id from the query result
                        timestamp: match.match_timestamp
                    };
                });

                resolve(transformedMatches); // Resolve the promise with the transformed matches
            }
        });
    });
}



