import { createErrorObj } from "./routeutil.js"

// returns value as a positive integer or null otherwise
// this parses strings into positive integer if possible
function parseToPosInt(value) {
    if (typeof value === 'string') {
        value = Number(value)   // coerces string to number
        if (isNaN(value)) return null   // if string cannot be coerced into number
    }

    // if value is not of type string or number, return null
    if (typeof value !== 'number') return null

    // Check if number is positive integer
    return (Number.isInteger(value) && value > 0) ? value : null
}

// Changes some value at "fieldName" into another value by the function "parser"
// If it is impossible, sends 400 response specifying the format we are looking for (i.e. positive integer)
// This checks query parameter, body, and routing parameter
export async function posIntParser(fieldName, parser, format, req, res, next) {
    let shouldCont = true
    // query parameter
    if (req.query[fieldName] != null) {    // isnt undefined or null
        req.query[fieldName] = parser(req.query[fieldName])
        if (req.query[fieldName] == null) shouldCont = false
    }

    // response body
    if (req.body[fieldName] != null) {
        req.body[fieldName] = parser(req.body[fieldName])
        if (req.body[fieldName] == null) shouldCont = false
    }

    // routing parameter
    if (req.params[fieldName] != null) {
        req.params[fieldName] = parser(req.params[fieldName])
        if (req.params[fieldName] == null) shouldCont = false
    }

    if (!shouldCont) {
        res.status(400).json(createErrorObj(`${fieldName} must be a ${format}`))
        return
    }
    next()
}

export async function userIDParser(req, res, next) {
    posIntParser("user_id", parseToPosInt, "positive integer", req, res, next)
}