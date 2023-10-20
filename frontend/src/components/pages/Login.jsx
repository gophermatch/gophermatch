import '../../assets/css/login.css'
import React from 'react'

export default function Login() {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [loginErr, setLoginErr] = React.useState('')

    function onLoginAttempt() {
        let result = Math.random()
        if (result < 0.2) {
            // switch to match page?
        } else if (result < 0.6) {
            setLoginErr("Incorrect email or password")
        } else {
            setLoginErr("Server error please try again later")
        }
    }

    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Gopher Match</h1>
                <div className="login-form">
                    <p>Email</p>
                    <input type="text" value={username} onChange={() => setUsername(event.target.value)}/>
                    <p>Password</p>
                    <input type="password" value={password} onChange={() => setPassword(event.target.value)}/>
                    <div className="login-failure">{loginErr}</div>
                    <button onClick={onLoginAttempt}>Login</button>
                </div>
            </div>
        </div>
    )
}
