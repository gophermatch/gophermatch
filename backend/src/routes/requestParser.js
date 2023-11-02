import { createErrorObj } from "./routeutil.js"

// Location to search for the value
export const SearchLocation = Object.freeze({
    Body: "body",       // request body
    Query: "query",     // query parameter
    Params: "params",    // routing parameter
    All: ["body", "query", "params"]
})

/* Parsers */

// returns value as a integer or null otherwise
// this parses strings into integer if possible
export function parseToInt(value) {
    if (typeof value === 'string') {
        value = Number(value)   // coerces string to number
        if (isNaN(value)) return null   // if string cannot be coerced into number
    }

    // if value is not of type string or number, return null
    if (typeof value !== 'number') return null

    // Check if number is integer
    return Number.isInteger(value) ? value : null
}

export function parseToPosInt(value) {
    value = parseToInt(value)
    return value == null || value <= 0 ? null : value
}

// Changes some value in a request into another value by the function "parser"
// locations: The locations to search for the value. See SearchLocation enum above. Can be an array or a string
// valName: The name of the value to search for
// parser: The function to parse the value. Returns null if parsing fails
// format: String denoting the format expected (i.e. positive integer). Used for the error message
// req, res, next: params ƒrom express middleware
// Returns false if value is found and parsing was unsuccessful
export function parseValue(locations, valName, parser, format, req, res, next) {
    if (!Array.isArray(locations)) locations = [locations]

    for (const location of locations) {
        // if valName at location exists
        if (req?.[location]?.[valName] != null) {   // isnt undefined or null
            let val = req[location][valName];
            val = parser(val)   // parse value
            // if parsing fails
            if (val == null) {
                res.status(400).json(createErrorObj(`${valName} must be a ${format}!`))
                return
            }
            req[location][valName] = val
        }
    }
    next()
}

// TODO: recursive version of parseValue() that parses values in inner objects

export async function userIDParser(req, res, next) {
    parseValue(SearchLocation.All, 'user_id', parseToPosInt, 'positive integer', req, res, next)
}