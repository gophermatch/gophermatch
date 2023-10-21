// import '../database/preferences.js'
import { Router } from 'express'
import { getUserPrefs } from '../database/preferences.js'
import { processErrorObj } from '../database/dbutils.js'
const router = Router() // this router is being exported and used in router.js to route requests to '.../api/user_preferences' here

// Get information on user preferences
// Expects: user is logged in (I'll implement this later), and the username being requested exists
// Returns to frontend: user preferences, or an error message (json)
// To test this: On PostMan, add a body field with key being "user_id" and value being "3"
router.get('/', async (req, res) => {   // GET is the HTTP request method we're expecting. If the method is different this function is not triggered
    const username = req.user_id     // HTTP request body should have a field that is called "username"
    let prefs = null

    try {
        prefs = await getUserPrefs(3)  // check out database/preferences.js
        // since the function is "async", we use "await" to wait for the function's return
        // in the meantime js can execute something else before going further
        // remember to always use await, unless you want to use callback functions (ew!) with the Promises API

        res.status(200)     // set HTTP response with the status code that means "ok!"
    } catch (e) {           // executes if there is an error when calling getUserPrefs
        prefs = processErrorObj(e);
        res.status(400)     // HTTP status code for "bad request"
    }
    res.json(prefs)     // send the HTTP response to the frontend with its body being the prefs object
    // prefs object is a js obejct. it gets turned into json text
    // It is either the preference object or an error object

    /* alternatively, you can also write:
        res.type("json")    // set the content type as "json" so frontend knows how to read the response
            .send(prefs)     // send the response. This is more general, can take a string, array, etc. */
})

export default router