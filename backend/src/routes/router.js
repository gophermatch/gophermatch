import { Router } from 'express'
import LoginRouter from './login.js'

const router = Router()

router.use('/login', LoginRouter);

export default router