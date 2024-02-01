import React from 'react';
import { Link } from 'react-router-dom';
import '../../output.css';

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-red-200 via-red-100 to-green-100 min-h-screen flex flex-col items-center size-full">
      <header className="text-maroon mb-12 text-4x1 font-bold">
        GopherMatch
      </header>

      <div className="flex justify-end m-4 space-x-4 absolute top-0 right-0">
        <Link to="/landing/go-to-login" className="text-black">
          Login
        </Link>
        <Link to="/landing/go-to-signup" className="text-black">
          Signup
        </Link>
      </div>
    </div>
  );
};



export default LandingPage;
