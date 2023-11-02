// Global state of current user's information, including login state, user id, etc.
// Singleton

class User {
    #user_id;  // private member
    #email

    constructor() {
        this.#setDefaults()
    }

    #setDefaults() {
        this.#user_id = -1
        this.#email = null
    }

    // returns true if user is logged in
    get logged_in() {
        return this.#user_id !== -1
    }

    // Stores login information
    login(user_id, email) {
        if (typeof user_id !== "number") 
            throw "user_id must be a number"
        if (typeof email !== "string")
            throw "email must be a string"

        console.log(`user logged in as ${user_id}`)
        this.#user_id = user_id
        this.#email = email
    }

    // Delete login information
    logout() {
        this.#setDefaults()
    }

    get user_id() {
        return this.#user_id
    }

    get email() {
        return this.#email
    }
}

const currentUser = new User()

export default currentUser