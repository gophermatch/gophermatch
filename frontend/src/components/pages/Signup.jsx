import { useNavigate, Link } from "react-router-dom";
import styles from '../../assets/css/login.module.css';
import React from "react";
import backend from "../../backend";
import currentUser from "../../currentUser";

export default function Signup() {
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [password2, setPassword2] = React.useState('')
    const [signupErr, setSignupErr] = React.useState('')
    const navigate = useNavigate()

    async function enterKeyPress(event) {
        if (event.key !== `Enter` && event.keyCode  !== 13) return
        if (email && password && password2) onSignupAttempt()
    }

    async function onSignupAttempt() {
        if (!email) {
            setSignupErr("Email missing")
            return
        } else if (!email.endsWith("@umn.edu")) {
            setSignupErr("Email must be an umn email")
            return
        }

        if (!password) {
            setSignupErr("Password missing")
            return
        } else if (!password2) {
            setSignupErr("Please re-enter password")
            return
        } else if (password !== password2) {
            setSignupErr("Re-entered password does not match your password")
            return
        }

        try {
            const res = await backend.post("/account", {
                email,
                password
            })
            // any result from backend means success
            const user_id = res.data.user_id
            currentUser.login(user_id, email)   // no need to store password
            navigate("/")

        } catch(err) {
            console.error(err)

            if (err.serverResponds) {
                setSignupErr(err.response.data.error_message)
            } else if (err.requestSent) {
                setSignupErr("Server timed out...")
            } else {
                setSignupErr("shit... our fault")
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
                    <p>Re-enter Password</p>
                    <input type="password" value={password2} onChange={(event) => setPassword2(event.target.value)} onKeyUp={enterKeyPress}/>
                    <div className={styles.login_failure}>{signupErr}</div>
                    <button onClick={onSignupAttempt}>Sign up</button>
                    <div className={styles.signup_link_container}>
                        <Link to="/login">Already have an account? Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}