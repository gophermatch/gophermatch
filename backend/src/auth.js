// Express middleware for checking if user has logged in
// Allows the chain of middlewares to continue (and thereby allow the routes to be called) if user is logged in
// Otherwise respond with status 401
export function AuthStatusChecker(req, res, next) {
    // If user is logged in
    if (req.session.user) { // note: if cookie expires, user is "logged out" and session is deleted
        next()
    } else {
        res.status(401).json({error_message: "You need to be logged in to access this."})
        // Don't call next so the chain of execution is severed
    }
}

// "Log in" the user by storing its data in session
// Return user object without the password
export function loginUser(req, userObj) {
    req.session.user = userObj
    const {hashpass: _, ...rest} = userObj  // clone userObj but without the hashed password
    return rest
}

// "Log out" the user by destroying the session associated with the user
// Then calls the callback function
export function logoutUser(req, res, callback) {
    req.session.destroy(callback)
    res.clearCookie('connect.sid')
}