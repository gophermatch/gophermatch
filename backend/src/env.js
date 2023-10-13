require('dotenv').config();  // load .env file into to the object process.env

// export all the env variables used in the backend
module.exports = {
    port: process.env.PORT,

    db: {
        name: process.env.DB_NAME,
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },

    sessoon: {
        secret: process.env.SESSION_SECRET
    }
}