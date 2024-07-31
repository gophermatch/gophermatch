// Global state of current user's information, including login state, user id, etc.
// Singleton

import backend from "./backend.js";

class User {
    #user_id;  // private member
    #account_created;
    #gen_data;

    constructor() {
        this.#setDefaults()
    }

    #setDefaults() {
        this.#user_id = -1
    }

    // returns true if user is logged in
    get logged_in() {
        return this.#user_id !== -1
    }

    // Stores login information
    async login(user_id) {
        if (typeof user_id !== "number") 
            throw "user_id must be a number"

        console.log(`user logged in as ${user_id}`)
        this.#user_id = user_id

        this.#gen_data = await this.getAccount()
        this.#account_created = this.#gen_data.first_name != "";

        console.log("Account created: " + this.#account_created);
    }

     async getAccount(){
        // Check if the user has submitted the account creation page yet by checking their first name
        const response = await backend.get('/profile/get-gendata', {
            params: { user_id: this.#user_id },
            withCredentials: true,
        });

        console.log("Logged in user data: ", response.data[0]);

        return response.data[0];
    }

    // Delete login information
    logout() {
        this.#setDefaults()
    }

    get user_id() {
        return this.#user_id
    }

    get account_created(){
        return this.#gen_data != null;
    }

    get gen_data(){
        return this.#gen_data;
    }

    set gen_data(data){
        this.#account_created = true;
        this.#gen_data = data;
    }
}

const currentUser = new User()

export default currentUser