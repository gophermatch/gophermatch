import { Link, useNavigate } from 'react-router-dom'
import styles from '../../assets/css/login.module.css'
import React from 'react'
import backend from "../../backend.js"
import currentUser from "../../currentUser.js"

export default function Login() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loginErr, setLoginErr] = React.useState('')

    // Get the page path that redirected to this page
    const params = new URLSearchParams(location.search);
    const from = params.get("from") || "/";
    const navigate = useNavigate()  // used to navigate away to another page

    async function enterKeyPress(event) {
        if (event.key !== `Enter` && event.keyCode  !== 13) return
        if (email && password) onLoginAttempt()
    }

    async function onLoginAttempt() {
        if (!email) {
            setLoginErr("Email missing")
            return
        } else if (!email.endsWith("@umn.edu")) {
            setLoginErr("Email must be an umn email")
            return
        }

        if (!password) {
            setLoginErr("Password missing")
            return
        }

        try {
            const res = await backend.put("/login", {
                email,
                password
            })

            // data is the request body, put it INSIDE the config object in the second argument
            // For Get requests:
            // use routing parameters at the end of url (i.e. ?key1=val1&key2=val2) for get requests
            // put the routing parameters as an object inside the second argument, the config obj goes in the third argument
            // dont send data on get requests (it won't be sent)
            const user_id = res.data.user_id
            await currentUser.login(user_id, email)   // no need to store password
            navigate(from)      // redirect to where we redirected from
        } catch(err) {
            console.error(err)

            if (err.serverResponds) {
                // if server responds with error (http status code not in 200 range)
                // have access to err.request and err.response
                setLoginErr(err.response.data.error_message)
            } else if (err.requestSent) {
                // if server never responded (timeout?)
                // have access to err.request
                setLoginErr("Server timed out...")
            } else {
                // if no request sent, must mean request was malformed (fault in our code, not user's fault)
                // all hell breaks lose
                setLoginErr("shit... our fault")
            }
        }
    }

    return (
        <div className={styles.login_page}>
            <div className={styles.login_container}>
                <h1>Gopher Match</h1>
                <div className={styles.login_form}>
                    <p>Email</p>
                    <input type="text" value={email} onChange={(event) => setEmail(event.target.value)} autoFocus onKeyUp={enterKeyPress}/>
                    <p>Password</p>
                    <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyUp={enterKeyPress}/>
                    <div className={styles.login_failure}>{loginErr}</div>
                    <button onClick={onLoginAttempt}>Login</button>
                    <div className={styles.signup_link_container}>
                        <Link to="/signup">Sign up</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
