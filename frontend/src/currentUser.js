// Global state of current user's information, including login state, user id, etc.
// Singleton

import backend from "./backend.js";

class User {
    #user_id;  // private member
    #email;
    #account_created;

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
    async login(user_id, email) {
        if (typeof user_id !== "number") 
            throw "user_id must be a number"
        if (typeof email !== "string")
            throw "email must be a string"

        console.log(`user logged in as ${user_id}`)
        this.#user_id = user_id
        this.#email = email

        // Check if the user has submitted the account creation page yet by checking their first name
        const response = await backend.get('/profile', {
            params: { user_id: currentUser.user_id },
            withCredentials: true,
        });
        const profileData = response.data;

        this.#account_created = profileData.first_name !== null && profileData.first_name !== '' && profileData.first_name !== undefined;

        console.log("Account created: " + this.#account_created + " First name: " + profileData.first_name);
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

    get account_created(){
        return this.#account_created
    }
}

const currentUser = new User()

export default currentUser