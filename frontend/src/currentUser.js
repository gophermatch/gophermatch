// Global state of current user's information, including login state, user id, etc.
// Singleton

import backend from "./backend.js";
import UserStateBroadcaster from "./UserStateBroadcaster.js";

class User {
    #user_id;  // private member
    #profile_completion;
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

        this.#user_id = user_id

        this.#gen_data = await this.getAccount()
        
        await this.updateProfileCompletion();
    }

    async updateProfileCompletion()
    {
        this.#profile_completion = await this.fetchProfileCompletion();
        UserStateBroadcaster.emit('profileStateChange', this.#profile_completion);
    }

    async fetchProfileCompletion()
    {
        var res = await backend.get('/profile/profile-state', { params: { user_id: this.#user_id } })

        return res.data.profile_completion;
        // Call the route here
    }

     async getAccount(){
        // Check if the user has submitted the account creation page yet by checking their first name
        const response = await backend.get('/profile/get-gendata', {
            params: { user_id: this.#user_id },
            withCredentials: true,
        });

        return response.data[0];
    }

    // Delete login information
    logout() {
        this.#setDefaults()
    }

    get user_id() {
        return this.#user_id
    }

    get gen_data(){
        return this.#gen_data;
    }

    get profile_completion()
    {
        return this.#profile_completion;
    }

    set gen_data(data)
    {
        this.#gen_data = data;
    }
}

const currentUser = new User()

export default currentUser