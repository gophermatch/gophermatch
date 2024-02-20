import React from 'react';
import { Link } from 'react-router-dom';
import '../../output.css';

const LandingPage = () => {
  return (
    <>
      <div className="bg-maroon h-[3.75rem] justify-end space-x-4 mt-auto">
        <div className="flex justify-end space-x-6 mr-4">
          <Link to="/landing/go-to-login" className="text-doc text-lg mt-3 hover:text-yellow-500">
            Login
          </Link>
          <Link to="/landing/go-to-signup" className="text-doc text-lg mt-3 hover:text-yellow-500">
            Signup
          </Link>
        </div>
      </div>
      <div className="bg-doc min-h-screen flex items-start px-4 ">
        <header className="text-maroon mt-64 text-7xl font-lora">
          <span className="font-bold ml-20">GopherMatch</span>
          <p className="text-3xl mt-5 ml-20">University of Minnesota Roommate Finder</p>
            <a href="/landing/go-to-signup" className="text-maroon flex items-center border">
              <p className="text-xl text-maroon ml-20 mt-5 hover:text-yellow-500">Get started</p>
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" className ="text-maroon mt-5 ml-2 hover:text-yellow-500">
                <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" className = "fill-current"/>
              </svg>
            </a>
        </header>
        <div className="flex justify-start items-center h-screen flex-grow max-w-md">
          <img src="/assets/images/logo.png" alt="Description of the image" className="w-[17rem] h-auto ml-20 mb-20" />
        </div>
      </div>
      <div className="bg-maroon h-[3.75rem] justify-end space-x-4 mt-auto fixed bottom-0 left-0 w-full"></div>


 
      
    </>
  );
};

export default LandingPage;
