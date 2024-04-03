import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <>
      <div className="bg-maroon h-[10vh] justify-end items-center space-x-4 mt-auto">
        <div className="flex justify-end items-center space-x-6 mr-4">
          <Link to="/landing/go-to-login" className="text-doc text-[3.5vh] mt-3 hover:text-gold">
            Login
          </Link>
          <Link to="/landing/go-to-signup" className="text-doc text-[3.5vh] mt-3 hover:text-gold">
            Signup
          </Link>
        </div>
      </div>
      <div className="bg-doc min-h-screen flex items-start px-4 ">
        <header className="text-maroon mt-[30vh] text-[12.5vh] font-lora">
          <span className="font-bold ml-[5vw]">GopherMatch</span>
          <p className="text-[5vh] mt-[2vh] ml-[5vw]">University of Minnesota Roommate Finder</p>
            <a href="/landing/go-to-signup" className="text-maroon flex items-center">
              <p className="text-[3vh] text-maroon ml-[5vw] mt-[2vh] hover:text-gold">Get started</p>
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" className="text-maroon mt-5 ml-2">
                <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" fill="currentColor" className="hover:text-gold" />
              </svg>
            </a>
        </header>
        <div className="flex justify-start items-center h-screen flex-grow max-w-md">
          <img src="/assets/images/logo.png" alt="Description of the image" className="w-[20vw] h-auto ml-[10vw] mb-[10vh]" />
        </div>
      </div>
      <div className="bg-maroon h-[10vh] justify-end space-x-4 mt-auto fixed bottom-0 left-0 w-full"></div>


 
      
    </>
  );
};

export default LandingPage;
