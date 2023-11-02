import { Router } from 'express'
import { createErrorObj } from './routeutil.js'
import { getProfile } from '../database/profile.js'
const router = Router()

export default router

// GET api/profile/
router.get('/', async (req, res) => {
    const user_id = req.query.user_id

    if (!user_id) {
        res.status(400).json(createErrorObj("Must include an user_id in the query parameter!"))
        return
    }

    try {
        const profile = await getProfile(user_id)
        res.status(200).json(profile)
    } catch(e) {
        console.error(e)
        res.status(400).json(createErrorObj(e))
    }
})

// Create profile
// POST api/profile/
router.post('/', async (req, res) => {
    const user_id = req.body.user_id
    const profile = req.body.profile
})

// Update profile
// PUT api/profile/
router.put('/', async (req, res) => {
    const user_id = req.body.user_id
    const profile = req.body.profile
})

// Get Question and Answers
// GET api/profile/qna/
router.get('/qna/', async (req, res) => {
    const user_id = req.query.user_id
})

// Create Answer to Question
// POST api/profile/qna/
router.post('/qna/', async (req, res) => {
    const user_id = req.body.user_id
    const question_id = req.body.question_id
    const answer = req.body.answer
})

// Update Answer to Question
// POST api/profile/qna/
router.put('/qna/', async (req, res) => {
    const user_id = req.body.user_id
    const question_id = req.body.question_id
    const answer = req.body.answer
})