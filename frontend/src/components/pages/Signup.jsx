import { useNavigate, Link } from "react-router-dom";
import styles from '../../assets/css/login.module.css';
import React, { useEffect } from "react";
import backend from "../../backend";
import currentUser from "../../currentUser";

export default function Signup() {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [password2, setPassword2] = React.useState('');
    const [signupErr, setSignupErr] = React.useState('');
    const navigate = useNavigate();

    async function enterKeyPress(event) {
        if (event.key !== `Enter` && event.keyCode !== 13) return;
        if (email && password && password2) {
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
        
        try {
            // Directly create account without OTP
            const res = await backend.post("/account", {
                email,
                password
            });
            const user_id = res.data.user_id;
            currentUser.login(user_id, email);
            navigate("/account");  // Navigate to account creation page after signup
            setSignupErr('');
        } catch (err) {
            console.error(err);
            setSignupErr("Failed to create account. Please try again.");
        }
    }

    return (
        <div className="bg-offwhite w-screen h-screen">
            <div className="bg-maroon_new h-[3.75rem] space-x-4 mt-auto">
                <div className="flex justify-start items-start w-full">
                    <Link to="/landing" className="text-offwhite font-lora text-3xl ml-2 mt-2">GopherMatch</Link>
                </div>
                <div className="flex flex-col font-lora text-maroon_new mt-10 text-center items-center">
                    <h1 className="font-lora text-[4rem] mt-[4rem]">Sign Up</h1>
                    <div className="font-lora">
                        <div>
                            <input className="mt-[2.5rem]" placeholder="Email" type="text" value={email} onChange={(event) => setEmail(event.target.value)} autoFocus onKeyUp={enterKeyPress} />
                        </div>
                        <div>
                            <input className="mt-[1.5rem]" placeholder="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} onKeyUp={enterKeyPress} />
                        </div>
                        <div>
                            <input className="mt-[1.5rem]" placeholder="Re-enter Password" type="password" value={password2} onChange={(event) => setPassword2(event.target.value)} onKeyUp={enterKeyPress} />
                        </div>
                        <button className="bg-maroon_new hover:bg-login text-offwhite font-bold py-2 w-[11.5rem] rounded mt-12" onClick={onSignupAttempt}>Sign up</button>
                        <div className={'${styles.login_failure}, text-xl mt-12'}>{signupErr}</div>
                    </div>
                </div>
            </div>
            <div className="bg-maroon_new h-[3.75rem] justify-end space-x-4 mt-auto fixed bottom-0 left-0 w-full"></div>
        </div>
    );
}
