import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../assets/css/signin.module.css';

const LandingPage = () => {

  return (
    <>
      <div className="bg-maroon h-[7vh] flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-start h-[7vh]">
            <p className="text-offwhite font-lora mt-[.4vh] ml-[0.52vw] text-[3.5vh]">GopherMatch</p>
            <img src="/assets/images/logo.png" alt="Description of the image" className="w-[2.75vw] mt-[0.5vh] ml-[0.5vw] items-start" />
          </div>
        </div>
        <div className="flex justify-end items-center">
          <Link to="/landing/go-to-login" className="text-doc text-[2.75vh] mr-[1.7vw] mb-[1vh] hover:text-gold">
            Login
          </Link>
          <Link to="/landing/go-to-signup" className="text-doc text-[2.75vh] mr-[1.5vw] mb-[1vh] hover:text-gold">
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
          <div className="ml-[6vw] h-[0.125vh] w-[86vw] mt-[35vh] bg-maroon"></div>
        </header>
        <div className="bg-offwhite flex flex-col items-center justify-center h-screen">
          <div className="mt-[10vh] flex flex-wrap justify-center">
            {/* Top four profiles */}
            <div className="p-[1vh] rounded-lg mb-[3vh] mx-[1.5vh] h-[27vh] w-[16vw] flex flex-col items-center border border-gray">
              <img src="assets/images/AJ.jpg" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
              <div className="text-center">
                <h3 className="font-bold text-maroon text-[2.5vh] mt-[0.75vh]">Adam</h3>
                <p className="text-[1.75vh] text-black font-thin mt-[0.2vh]">Job description</p>
                <div className="flex justify-center">
                  <a href="www.linkedin.com/in/andrew-lange-461678288" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/linkedin.png" alt="LinkedIn" className="w-[3.5vh] h-[3.5vh] mt-[1vh]" />
                  </a>
                  <a href="https://github.com/AndrewLange1" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/github.png" alt="GitHub" className="w-[3.5vh] h-[3.5vh] ml-[1vh] mt-[1vh]" />
                  </a>
                </div>
              </div>
            </div>
            <div className="p-[1vh] rounded-lg mb-[3vh] mx-[1.5vh] h-[27vh] w-[16vw] flex flex-col items-center border border-gray">
              <img src="assets/images/AJ.jpg" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
              <div className="text-center">
                <h3 className="font-bold text-maroon text-[2.5vh] mt-[0.75vh]">Adhi</h3>
                <p className="text-[1.75vh] text-black font-thin mt-[0.2vh]">Job description</p>
                <div className="flex justify-center">
                  <a href="www.linkedin.com/in/andrew-lange-461678288" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/linkedin.png" alt="LinkedIn" className="w-[3.5vh] h-[3.5vh] mt-[1vh]" />
                  </a>
                  <a href="https://github.com/AndrewLange1" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/github.png" alt="GitHub" className="w-[3.5vh] h-[3.5vh] ml-[1vh] mt-[1vh]" />
                  </a>
                </div>
              </div>
            </div>
            <div className="p-[1vh] rounded-lg mb-[3vh] mx-[1.5vh] h-[27vh] w-[16vw] flex flex-col items-center border border-gray">
              <img src="assets/images/AJ.jpg" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
              <div className="text-center">
                <h3 className="font-bold text-maroon text-[2.5vh] mt-[0.75vh]">AJ</h3>
                <p className="text-[1.75vh] text-black font-thin mt-[0.2vh]">Job description</p>
                <div className="flex justify-center">
                  <a href="www.linkedin.com/in/andrew-lange-461678288" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/linkedin.png" alt="LinkedIn" className="w-[3.5vh] h-[3.5vh] mt-[1vh]" />
                  </a>
                  <a href="https://github.com/AndrewLange1" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/github.png" alt="GitHub" className="w-[3.5vh] h-[3.5vh] ml-[1vh] mt-[1vh]" />
                  </a>
                </div>
              </div>
            </div>
            <div className="p-[1vh] rounded-lg mb-[3vh] mx-[1.5vh] h-[27vh] w-[16vw] flex flex-col items-center border border-gray">
              <img src="assets/images/AJ.jpg" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
              <div className="text-center">
                <h3 className="font-bold text-maroon text-[2.5vh] mt-[0.75vh]">Allen</h3>
                <p className="text-[1.75vh] text-black font-thin mt-[0.2vh]">Job description</p>
                <div className="flex justify-center">
                  <a href="www.linkedin.com/in/andrew-lange-461678288" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/linkedin.png" alt="LinkedIn" className="w-[3.5vh] h-[3.5vh] mt-[1vh]" />
                  </a>
                  <a href="https://github.com/AndrewLange1" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/github.png" alt="GitHub" className="w-[3.5vh] h-[3.5vh] ml-[1vh] mt-[1vh]" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <div className='flex flex-wrap justify-center'>
            <div className="p-[1vh] rounded-lg mb-[3vh] mx-[1vh] h-[27vh] w-[16vw] flex flex-col items-center border border-gray">
              <img src="assets/images/AJ.jpg" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
              <div className="text-center">
                <h3 className="font-bold text-maroon text-[2.5vh] mt-[0.75vh]">Alex</h3>
                <p className="text-[1.75vh] text-black font-thin mt-[0.2vh]">Job description</p>
                <div className="flex justify-center">
                  <a href="www.linkedin.com/in/andrew-lange-461678288" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/linkedin.png" alt="LinkedIn" className="w-[3.5vh] h-[3.5vh] mt-[1vh]" />
                  </a>
                  <a href="https://github.com/AndrewLange1" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/github.png" alt="GitHub" className="w-[3.5vh] h-[3.5vh] ml-[1vh] mt-[1vh]" />
                  </a>
                </div>
              </div>
            </div>
            <div className="p-[1vh] rounded-lg mb-[3vh] mx-[1vh] h-[27vh] w-[16vw] flex flex-col items-center border border-gray">
              <img src="assets/images/AJ.jpg" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
              <div className="text-center">
                <h3 className="font-bold text-maroon text-[2.5vh] mt-[0.75vh]">Tony</h3>
                <p className="text-[1.75vh] text-black font-thin mt-[0.2vh]">Job description</p>
                <div className="flex justify-center">
                  <a href="www.linkedin.com/in/andrew-lange-461678288" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/linkedin.png" alt="LinkedIn" className="w-[3.5vh] h-[3.5vh] mt-[1vh]" />
                  </a>
                  <a href="https://github.com/AndrewLange1" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/github.png" alt="GitHub" className="w-[3.5vh] h-[3.5vh] ml-[1vh] mt-[1vh]" />
                  </a>
                </div>
              </div>
            </div>
            <div className="p-[1vh] rounded-lg mb-[3vh] mx-[1vh] h-[27vh] w-[16vw] flex flex-col items-center border border-gray">
              <img src="assets/images/AJ.jpg" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
              <div className="text-center">
                <h3 className="font-bold text-maroon text-[2.5vh] mt-[0.75vh]">Quang</h3>
                <p className="text-[1.75vh] text-black font-thin mt-[0.2vh]">Job description</p>
                <div className="flex justify-center">
                  <a href="www.linkedin.com/in/andrew-lange-461678288" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/linkedin.png" alt="LinkedIn" className="w-[3.5vh] h-[3.5vh] mt-[1vh]" />
                  </a>
                  <a href="https://github.com/AndrewLange1" target="_blank" rel="noopener noreferrer">
                    <img src="assets/images/github.png" alt="GitHub" className="w-[3.5vh] h-[3.5vh] ml-[1vh] mt-[1vh]" />
                  </a>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;

