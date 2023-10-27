import { db, tableNames } from './db.js'
import { queryRowsToArray, buildSelectString, buildInsertString } from './dbutils.js'

// Returns profile object (with profile_name and bio)
export async function getProfile(user_id) {

}

// On second thought: Don't call this!! 
// I will call this when we create user profile. That way all existing users automatically has an empty profile
// creates and stores a profile in DB
// second argument (profile obj) is optional
export async function createProfile(user_id, profile) {

}

// updates the stored profile
export async function updateProfile(user_id, profile) {

}

// Returns an array of "Questions and Answers" object
// Could be an empty list if the user has no QnAs
// Or throws an error if the user's profile hasn't been created
export async function getQnAs(user_id) {

}

// Create an answer to a exisitng question
// The question with question_id must exist
// The user must have answered the question before
export async function createQnA(user_id, question_id, answer) {

}

// Update an answer to a exisitng question
// The question with question_id must exist
export async function updateQnA(user_id, question_id, answer) {

}