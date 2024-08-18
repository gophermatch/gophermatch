import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from '../../assets/css/signin.module.css';

const reviews = [
  {
    name: "Kanye West",
    text: "“GoferMatch changed my life. Now I will never go back”",
  },
  {
    name: "42 Doug",
    text: "“This website helped me find my best friend BabyGav. Where would I be without you guys!”",
  },
  {
    name: "Goldy Gofer",
    text: "“Hey guys! Goldy here and I just want to let everyone know that this site rocks”",
  },
  {
    name: "Anonymous User",
    text: "“I like this site. It is a very nice site. Use this site right now.”"
  },
  {
    name: "Lebron James",
    text: "“Hey guys Lebron James here! This website helped me win four league mvps!”"
  }
];

const LandingPage = () => {
  const [currentReview, setCurrentReview] = useState(0);
  const [animationState, setAnimationState] = useState('active'); // 'active' or 'exit'

  useEffect(() => {
    const reviewInterval = setInterval(() => {
      setAnimationState('exit');
      setTimeout(() => {
        setCurrentReview(prevReview => (prevReview + 1) % reviews.length);
        setAnimationState('active');
      }, 500);
    }, 6000);

    return () => clearInterval(reviewInterval);
  }, []);

  const handleReviewChange = (index) => {
    setAnimationState('exit');
    setTimeout(() => {
      setCurrentReview(index);
      setAnimationState('active');
    }, 500); // Matches the CSS transition duration
  };

  const getButtonSize = (index) => {
    const diff = Math.abs(currentReview - index);
    if (diff === 0) return 3; // middle button is largest
    if (diff === 1) return 2.5; // buttons next to the middle are slightly smaller
    return 2; // other buttons are smallest
  };

  return (
    <>
      <div className="bg-maroon_new h-[7vh] flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-start h-[7vh]">
            <p className="text-offwhite font-lora mt-[.4vh] text-[3.5vh] ml-[0.52vw]">GoferMatch</p>
            <img src="/assets/images/logo.png" alt="Description of the image" className="w-[2.75vw] mt-[0.5vh] ml-[0.5vw] items-start" />
          </div>
        </div>
        <div className="flex justify-end items-center">
          <Link to="/landing/go-to-login" className="text-offwhite text-[2.75vh] mr-[1.7vw] mb-[1vh] hover:text-gold">
            Login
          </Link>
          <Link to="/landing/go-to-signup" className="text-offwhite text-[2.75vh] mr-[1.5vw] mb-[1vh] hover:text-gold">
            Signup
          </Link>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="bg-offwhite flex flex-col px-4 overflow-y-auto h-[92vh] w-full">
          <header className="flex mt-[20vh] ml-[40px]">
            <div className="text-maroon_new text-[11vh] font-lora w-[80%]">
              <span className="font-bold">GoferMatch</span>
              <p className="text-[5vh] mt-[1vh]">University of Minnesota Roommate Finder</p>
              <Link to="/signup" className="text-maroon flex items-center h-[2rem] mt-4 w-[9rem] group">
                <span className="text-xl text-maroon_new flex items-center group-hover:text-gold">
                  Get started
                  <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="text-maroon_new group-hover:text-gold">
                    <path d="M21.883 12l-7.527 6.235.644.765 9-7.521-9-7.479-.645.764 7.529 6.236h-21.884v1h21.883z" />
                  </svg>
                </span>
              </Link>
            </div>
            <div className="flex flex-col items-start w-[40%] h-full mt-[1.5%] ml-[5vw]">
                <div
                className={`${styles.reviewSlide} ${
                  animationState === 'enter' ? styles.enter : animationState === 'exit' ? styles.exit : styles.active
                }`}
                key={currentReview}
              >
                <p className="text-[2.5vh] text-black font-thin mt-[1vh]">
                  {reviews[currentReview].text}
                </p>
                <div className="text-right mt-[5%]">
                  <h3 className="text-black font-thin text-[175%] mr-[10%]">- {reviews[currentReview].name}</h3>
                </div>
              </div>
              <div className="h-[0.85px] w-[95%] ml-[2.5%] mt-[5%] bg-gold"></div>
              <div className={`${styles['review-container']} flex justify-center ml-[28%] items-center mt-[10%]`}>
                {reviews.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleReviewChange(index)}
                    style={{
                      height: `${getButtonSize(index)}vh`,
                      width: `${getButtonSize(index)}vh`,
                    }}
                    className={`rounded-full mx-[1vh] ${
                      currentReview === index ? 'bg-maroon_new' : 'bg-gray'
                    }`}
                  />
                ))}
              </div>
            </div>
          </header>
          <div className="ml-[6vw] h-[20px] w-[86vw] mt-[35vh] bg-maroon_new"></div>
          <div className="bg-offwhite flex flex-col items-center justify-center h-screen">
            <div className="mt-[10vh] flex flex-wrap justify-center">
              <div className="p-[1vh] rounded-lg mb-[3vh] mx-[1.5vh] h-[27vh] w-[16vw] flex flex-col items-center border border-gray">
                <img src="assets/images/profile.png" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
                <div className="text-center">
                  <h3 className="font-bold text-maroon_new text-[2.5vh] mt-[0.75vh]">Adam</h3>
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
                <img src="assets/images/profile.png" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
                <div className="text-center">
                  <h3 className="font-bold text-maroon_new text-[2.5vh] mt-[0.75vh]">Adhi</h3>
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
                <img src="assets/images/AJ2.jpg" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
                <div className="text-center">
                  <h3 className="font-bold text-maroon_new text-[2.5vh] mt-[0.75vh]">AJ</h3>
                  <p className="text-[1.75vh] text-black font-thin mt-[0.2vh]">Project Lead</p>
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
                <img src="assets/images/profile.png" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
                <div className="text-center">
                  <h3 className="font-bold text-maroon_new text-[2.5vh] mt-[0.75vh]">Allen</h3>
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
                <img src="assets/images/profile.png" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
                <div className="text-center">
                  <h3 className="font-bold text-maroon_new text-[2.5vh] mt-[0.75vh]">Alex</h3>
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
                <img src="assets/images/profile.png" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
                <div className="text-center">
                  <h3 className="font-bold text-maroon_new text-[2.5vh] mt-[0.75vh]">Tony</h3>
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
                <img src="assets/images/Quang2.jpg" alt="Profile" className="w-[7vw] h-[12vh] rounded-full" />
                <div className="text-center">
                  <h3 className="font-bold text-maroon_new text-[2.5vh] mt-[0.75vh]">Quang</h3>
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
      </div>
    </>
  );
};

export default LandingPage;

