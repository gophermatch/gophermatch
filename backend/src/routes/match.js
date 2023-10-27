import { Router } from 'express';

const router = Router()

// A user X has a list of users they have matched/unmatched with
// Matched users of X are people that X matched and swiped right with (YES)
// Unmatched users of X are people that X matched and swiped left with (NO)

// GET /api/match/
// Get a list of both matched and unmatched users
// To test this, go to http://localhost:3000/api/match?user_id=0
router.get('/', async (req, res) => {
    const user_id = req.query.user_id // this will be all you need
    // Check out database/match.js for db functions to call
    res.status(200).json({test:"test"})
})

// Add a new matched/unmatched user to a user's match list
// PUT /api/match/
router.put('/',  async (req, res) => {
    const user_id = req.body.user_id
    const match_user_id = req.body.match_user_id
    const is_match = req.body.is_match
})

// Get a list of users that the user can swipe on
// GET /api/match/users/
router.get('/users/',  async (req, res) => {
    const user_id = req.body.user_id
    const num_users = req.body.num_users
})

export default router