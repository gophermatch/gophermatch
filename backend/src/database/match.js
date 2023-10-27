import { db, tableNames } from './db.js'

// Returns user's matches and unmatches
// The return object is like so:
/* 
{
    matches: [list of user ids...],
    unmatches: [list of user ids]
}
*/
export async function getMatchHistory(user_id) {

}

// match_user_id is the user that this user (user_id) matches with
// is_match is true if the match was swipe right (YES)
// is_match is false if the match was swipe left (NO)
export async function addMatch(user_id, match_user_id, is_match) {

}

// Get users for the user to swipe on
export async function getUsers(user_id, num_users) {
    // need user_id to get the history so that the user doesnt repeatedly see the same people
}