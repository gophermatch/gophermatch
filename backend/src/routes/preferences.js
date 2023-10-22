// import '../database/preferences.js'
import { Router } from 'express'
import { getUserPrefs } from '../database/preferences.js'
import { createErrorObj } from './routeutil.js'
const router = Router() // this router is being exported and used in router.js to route requests to '.../api/user_preferences' here

// Get information on user preferences
// Expects: user is logged in (I'll implement this later), and the user_id is in the request body
// Returns to frontend: user preferences, or an error message (json)
// To test this: On PostMan, add a body field with key being "user_id" and value being "3"
router.get('/', async (req, res) => {   // GET is the HTTP request method we're expecting. If the method is different this function is not triggered
    // Data in the request body can be found in req.body
    let user_id = req.body.user_id
    if (!user_id) {
        res.status(400).json(createErrorObj("Must submit user_id to get a user's preferences"))
        return
    }

    let prefs = null

    try {
        prefs = await getUserPrefs(user_id)  // check out database/preferences.js
        // since the function is "async", we use "await" to wait for the function's return
        // in the meantime js can execute something else before going further
        // remember to always use await, unless you want to use callback functions (ew!) with the Promises API

        res.status(200)     // set HTTP response with the status code that means "ok!"
            .json(prefs)
    } catch (e) {           // executes if there is an error when calling getUserPrefs
        res = res.status(400)     // HTTP status code for "bad request"
            .json(createErrorObj(e))
    }
    /* alternatively, to send a response, you can also write:
        res.type("json")    // set the content type as "json" so frontend knows how to read the response
            .send(prefs)     // send the response. This is more general, can take a string, array, etc. */
})

export default router