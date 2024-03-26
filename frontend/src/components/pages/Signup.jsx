import { useNavigate, Link } from "react-router-dom";
import styles from '../../assets/css/login.module.css';
import React from "react";
import backend from "../../backend";
import currentUser from "../../currentUser";

export default function Signup() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [signupErr, setSignupErr] = React.useState('');
    const [otp, setOtp] = React.useState(['', '', '', '', '', '']);
    const [showOtpInput, setShowOtpInput] = React.useState(false);
    const [otpSent, setOtpSent] = React.useState(false);
    const navigate = useNavigate();

    async function enterKeyPress(event) {
        if (event.key !== `Enter` && event.keyCode !== 13) return;
        if (email && password && password2 && showOtpInput) {
            onVerifyOtp();
        } else if (email && password && password2) {
            onSignupAttempt();
        }
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
            setShowOtpInput(true);
            setOtpSent(true);
            setSignupErr('');
        } catch (err) {
            console.error(err);
            setSignupErr("Failed to send OTP. Please try again.");
        }
    }

    async function onVerifyOtp() {
        try {
            const otpValue = otp.join('');
            const res = await backend.post("/email-auth/verify-otp", {
                email,
                password,
                otp: otpValue
            });
            const user_id = res.data.user_id;
            currentUser.login(user_id, email);
            navigate("/");
        } catch (err) {
            console.error(err);
            setSignupErr("Invalid or expired OTP. Please try again.");
        }
    }

    const handleOtpChange = (index, value, event) => {
        const newOtp = [...otp];
        newOtp[index] = value;
    
        if (value.length === 1 && index < 5) {
            const nextIndex = index + 1;
            document.getElementById(`otp-${nextIndex}`).focus();
        } else if (value.length === 0) {
            const prevIndex = index - 1;
            if (prevIndex >= 0) {
                document.getElementById(`otp-${prevIndex}`).focus();
            }
        }
        setOtp(newOtp);
    };         

    return (
        <div className="bg-doc w-screen h-screen">
            <div className="bg-maroon h-[3.75rem] space-x-4 mt-auto">
                <div className="flex justify-start items-start w-full">
                    <Link to="/landing" className="text-doc font-lora text-3xl ml-2 mt-2">GopherMatch</Link>
                </div>
                <div className="flex flex-col font-lora text-maroon mt-10 text-center items-center">
                    { !showOtpInput && (
                        <h1 className="font-lora text-[4rem] mt-[4rem]">Sign Up</h1>
                    )}
                    <div className="font-lora">
                        {!showOtpInput && (
                            <>
                                <div>
                                    <input className="mt-[2.5rem]" placeholder="Email" type="text" value={email} onChange={(event) => setEmail(event.target.value)} autoFocus onKeyUp={enterKeyPress} />
                                </div>
                                <div>
                                    <input className="mt-[1.5rem]" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyUp={enterKeyPress} />
                                </div>
                                <div>
                                    <input className="mt-[1.5rem]" placeholder="Re-enter Password" type="password" value={password2} onChange={(event) => setPassword2(event.target.value)} onKeyUp={enterKeyPress} />
                                </div>
                                <button className="bg-maroon hover:bg-login text-doc font-bold py-2 w-[11.5rem] rounded mt-12" onClick={onSignupAttempt}>Sign up</button>
                                <div className="mt-[2rem] text-lg flex items-center">
                                    <p>Already have an account?</p>
                                    &nbsp;
                                    <Link className="hover:text-gold" to="/login"> Log in</Link>
                                </div>
                            </>
                        )}
                        {showOtpInput && (
                            <div>
                                <div className="text-2xl mt-[8rem]">A verification code was sent to your email</div>
                                <div className="mt-[3.5rem] flex items-center text-center justify-center">
                                    {otp.map((digit, index) => (
                                        <div key={index} className="h-[4rem] w-[4rem] mr-1 flex justify-center items-center">
                                            <input
                                                id={`otp-${index}`}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(event) => handleOtpChange(index, event.target.value, event)} // Pass the event object here
                                                onKeyDown={enterKeyPress}
                                                className="w-full h-full bg-transparent text-2xl text-center"
                                                style={{ borderBottom: "2px solid black", outline: "none" }}
                                            />
                                        </div>
                                    ))}
                                </div>
                                <button className="bg-maroon hover:bg-login text-doc text-xl font-bold py-2 w-[14rem] rounded mt-[6rem]" onClick={onVerifyOtp}>Verify Account</button>
                            </div>
                        )}
                        <div className={styles.login_failure}>{signupErr}</div>
                    </div>
                </div>
            </div>
            <div className="bg-maroon h-[3.75rem] justify-end space-x-4 mt-auto fixed bottom-0 left-0 w-full"></div>
        </div>
    );
}
