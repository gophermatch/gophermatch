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