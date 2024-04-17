import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    // Check if user is already authenticated
    React.useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div>
            <div className="bg-maroon h-[10vh] space-x-4 mt-auto">
                <div className="flex justify-start items-start w-full">
                    <Link to="/landing" className="text-doc font-lora text-[5vh] ml-[1vw] mt-[1vh]">GopherMatch</Link>
                </div>
            </div>
            <div className="bg-offwhite w-screen h-screen flex flex-col font-lora">
                <div className="flex flex-col justify-center items-center w-screen text-maroon">
                    <h1 className="text-maroon font-lora text-[10vh] mt-[10vh]">Login</h1>
                    <div className="flex items-center justify-center mt-[3vh]">
                        <button onClick={() => loginWithRedirect()} className="bg-maroon hover:bg-yellow-700 text-doc font-bold py-[1.5vh] px-[6.5vw] rounded mt-[4vh] text-[3vh]">Login with Auth0</button>
                    </div>
                    <div className='flex items-center justify-center mt-[2vh]'>
                        <p className="text-maroon text-[3vh]">Don't have an account?</p>
                        <Link to="/signup" className="ml-[0.5vw] hover:text-yellow-500 text-[3vh]">Sign up</Link>
                    </div>
                </div>
            </div>
            <div className="bg-maroon h-[10vh] justify-end space-x-4 mt-auto fixed bottom-0 left-0 w-full"></div>
        </div>
    );
}
