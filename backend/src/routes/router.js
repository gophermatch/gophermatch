import { Router } from 'express'
import LoginRouter from './login.js'
import PreferenceRouter from './preferences.js'

const router = Router()

router.use('/login', LoginRouter)
router.use('/user_preferences', PreferenceRouter)

export default router