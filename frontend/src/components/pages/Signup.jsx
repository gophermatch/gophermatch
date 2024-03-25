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
            return;
        } else if (!email.endsWith("@umn.edu")) {
            setSignupErr("Email must be an umn email");
            return;
        }
    
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
            history.push("/account")
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
            <div className="bg-doc w-screen h-screen">
                <div className="bg-maroon h-[3.75rem] space-x-4 mt-auto">
                    <div className="flex justify-start items-start w-full">
                    <Link to="/landing" className="text-doc font-lora text-3xl ml-2 mt-2">GopherMatch</Link>
                </div>
                <div className = "flex flex-col font-lora text-maroon mt-10 text-center items-center">
                    <h1 className = "font-lora text-[4rem] mt-[4rem]">Sign Up</h1>
                    <div className="font-lora">
                        <div>
                            <input className="mt-[2.5rem]" placeholder="Email" type="text"  value={email} onChange={(event) => setEmail(event.target.value)} autoFocus onKeyUp={enterKeyPress}/>
                        </div>
                        <div>
                            <input className="mt-[1.5rem]" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyUp={enterKeyPress}/>
                        </div>
                            <input className="mt-[1.5rem]" placeholder = "Re-enter Password" type="password" value={password2} onChange={(event) => setPassword2(event.target.value)} onKeyUp={enterKeyPress}/>
                            {showOtpInput && (
                                <>
                                    <input className="mt-[1.5rem]" placeholder="OTP" type="text" value={otp} onChange={(event) => setOtp(event.target.value)} />
                                </>
                            )}
                        <div className={styles.login_failure}>{signupErr}</div>
                        {!showOtpInput ? (
                            <button className="bg-maroon hover:bg-login text-doc font-bold py-2 w-[11.5rem] rounded mt-12" onClick={onSignupAttempt}>Sign up</button>
                        ) : (
                            <button className="hover:text-gold mt-[1.5rem]" onClick={onVerifyOtp}>Verify OTP</button>
                        )}
                        <div className="mt-[2rem] text-lg flex items-center">
                            <p>Already have an account?</p>
                            &nbsp;
                            <Link className="hover:text-gold" to="/login"> Log in</Link>
                        </div>
                    </div>
            </div>
            </div>
            <div className="bg-maroon h-[3.75rem] justify-end space-x-4 mt-auto fixed bottom-0 left-0 w-full"></div>
        </div>
    );
    
}