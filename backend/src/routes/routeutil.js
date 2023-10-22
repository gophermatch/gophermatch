// Creates an error object to return to the client
// error is either a js error object generated by the MySQL library, or a string
// The error object contains error_message and error_type
export function createErrorObj(error) {
    const newError = {}

    // MySQL DB errors
    if (error.sqlMessage) newError.error_message = error.sqlMessage
    if (error.code) newError.error_type = error.code

    // If the error is a custom string message
    if (typeof error === "string") {
        newError.error_message = error
    }

    // If no information is found in the error
    if (!newError.error_message) newError.error_message = "Something went horribly wrong!"
    if (!newError.error_type) newError.error_type = "BACKEND_ERROR"
    return newError
}