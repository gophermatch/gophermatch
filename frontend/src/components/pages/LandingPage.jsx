import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../assets/css/signin.module.css';

const LandingPage = () => {
  return (
    <>
      <div className="bg-maroon h-[8vh] flex justify-between items-center px-4">
        <div className="flex items-center">
          <div className="flex items-start h-[7vh]">
            <p className="text-doc font-lora mt-[.25vh] text-[4vh]">GopherMatch</p>
            <img src="/assets/images/logo.png" alt="Description of the image" className="w-[3vw] mt-[0.5vh] ml-[0.5vw] items-start" />
          </div>
        </div>
        <div className="flex justify-end items-center">
          <Link to="/landing/go-to-login" className="text-doc text-[3vh] mr-[1.7vw] mb-[1vh] hover:text-gold">
            Login
          </Link>
          <Link to="/landing/go-to-signup" className="text-doc text-[3vh] mb-[1vh] hover:text-gold">
            Signup
          </Link>
        </div>
      </div>
      <div className="bg-offwhite flex flex-col px-4 overflow-y-auto h-[92vh]">
        <header className="text-maroon mt-[20vh] text-[11vh] font-lora">
          <span className="font-bold ml-[5vw]">GopherMatch</span>
          <p className="text-[5vh] mt-[1vh] ml-[5vw]">University of Minnesota Roommate Finder</p>
          <Link to="/signup" className="text-maroon flex items-center h-[2rem] mt-4 w-[9rem] ml-[5rem] group">
            <span className="text-xl text-maroon flex items-center group-hover:text-gold">
              Get started
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-maroon group-hover:text-gold">
                <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
              </svg>
            </span>
          </Link>
        </header>
        {/* Additional section for scrolling */}
        <div className="bg-offwhite flex flex-col items-center justify-center h-screen mt-[35vh]">
          <Link to="#scroll-to-content" className="text-maroon h-10 w-10 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-maroon group-hover:text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </Link>
          <div className="mt-[30vh]">
              <h3>AJ</h3>
              <h3>Adhi</h3>
              <h3>Tony</h3>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;

