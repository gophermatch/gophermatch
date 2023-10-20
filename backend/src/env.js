import 'dotenv/config.js'       // load .env file into to the object process.env

// export all the env variables used in the backend
export const port = process.env.PORT

export const db = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
}

export const session = {
    secret: process.env.SESSION_SECRET
}