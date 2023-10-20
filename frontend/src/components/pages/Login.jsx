import '../../assets/css/login.css'
import React from 'react'

export default function Login() {
    const [username, setUsername] = React.useState('')
    const [password, setPassword] = React.useState('')
    function onLoginAttempt() {
        // do stuff probably
    }
    return (
        <div className="login-page">
            <div className="login-container">
                <h1>Gopher Match</h1>
                <div className="login-form">
                    <p>Username</p>
                    <input type="text" value={username} onChange={() => setUsername(event.target.value)}/>
                    <p>Password</p>
                    <input type="text" value={password} onChange={() => setPassword(event.target.value)}/>
                </div>
                <button onClick={onLoginAttempt}>Login</button>
            </div>
        </div>
    )
}
