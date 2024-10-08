import { Router } from 'express'
import LoginRouter from './login.js'
import AccountRouter from './account.js'
import MatchRouter from './match.js'
import ProfileRouter from './profile.js'
import EmailAuthRouter from './email-auth.js'
import SubleaseRouter from './sublease.js'
import PaymentRouter from './payment.js'
import { AuthStatusChecker } from '../auth.js'
import { userIDParser } from './requestParser.js'

const router = Router()

let counts = {};

export async function consoleLogMiddleware(req, res, next) {

    let path = req.url.split('?')[0];

    if(!(path in counts))
    {
        counts[path] = 1;
    }
    else
    {
        counts[path] += 1;
    }

    console.log("Counts: ", counts);
    next()
}

router.use(userIDParser)
router.use(consoleLogMiddleware);

router.use('/login', LoginRouter)
router.use('/match', MatchRouter)
router.use('/account', AccountRouter)
 // TODO: prepend AuthStatusChecker
// router.use('/profile', AuthStatusChecker, ProfileRouter)
router.use('/profile', ProfileRouter)
router.use('/email-auth', EmailAuthRouter)
router.use('/match', MatchRouter)
router.use('/sublease', SubleaseRouter)
// router.use('/payment', PaymentRouter)


export default router