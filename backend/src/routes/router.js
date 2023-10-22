import { Router } from 'express'
import LoginRouter from './login.js'
import PreferenceRouter from './preferences.js'
import { AuthStatusChecker } from '../auth.js'

const router = Router()

router.use('/login', LoginRouter)
router.use('/preferences', PreferenceRouter)    // TODO: prepend AuthStatusChecker

export default router