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

    //email
    const [otp, setOtp] = React.useState('');
    const [showOtpInput, setShowOtpInput] = React.useState(false);


    async function enterKeyPress(event) {
        if (event.key !== `Enter` && event.keyCode  !== 13) return
        if (email && password && password2) onSignupAttempt()
    }

    async function onSignupAttempt() {
        if (!email) {
            setSignupErr("Email missing");
            return;}
        // } else if (!email.endsWith("@umn.edu")) {
        //     setSignupErr("Email must be an umn email");
        //     return;
        // }
    
        if (!password) {
            setSignupErr("Password missing");
            return;
        } else if (!password2) {
            setSignupErr("Please re-enter password");
            return;
        } else if (password !== password2) {
            setSignupErr("Re-entered password does not match your password");
            return;
        }

        // Request OTP
        try {
            await backend.post("/email-auth/request-otp", { email });
            setShowOtpInput(true); // Show OTP input after successfully sending the OTP
        } catch(err) {
            console.error(err);
            // Handle errors (e.g., error sending OTP)
            setSignupErr("Failed to send OTP. Please try again.");
        }
    }
    

    async function onVerifyOtp() {
        try {
            const res = await backend.post("/email-auth/verify-otp", {
                email,
                password, // Make sure to securely handle the password
                otp
            });
            // Account creation success
            const user_id = res.data.user_id;
            currentUser.login(user_id, email); // no need to store password
            navigate("/");
        } catch(err) {
            console.error(err);
            // Handle errors (e.g., invalid or expired OTP)
            setSignupErr("Invalid or expired OTP. Please try again.");
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
                    {showOtpInput && (
                        <>
                            <p>OTP</p>
                            <input type="text" value={otp} onChange={(event) => setOtp(event.target.value)} />
                        </>
                    )}
                    <div className={styles.login_failure}>{signupErr}</div>
                    {!showOtpInput ? (
                        <button onClick={onSignupAttempt}>Sign up</button>
                    ) : (
                        <button onClick={onVerifyOtp}>Verify OTP</button>
                    )}
                    <div className={styles.signup_link_container}>
                        <Link to="/login">Already have an account? Log in</Link>
                    </div>
                </div>
            </div>
        </div>
    );
    
}