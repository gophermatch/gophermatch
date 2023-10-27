import { Router } from 'express'
import { createErrorObj } from './routeutil.js'
const router = Router()

export default router

// Don't worry about completing all this. Prioritize create and get routes

// GET api/profile/
router.get('/', async (req, res) => {
    const user_id = req.query.user_id
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