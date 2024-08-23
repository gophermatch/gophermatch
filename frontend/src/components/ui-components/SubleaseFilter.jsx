import React, { useState } from 'react';
import currentUser from '../../currentUser';
import backend from '../../backend';
import qnaOptions from './qnaOptions.json';

export default function SubleaseFilter({ filterSetter }) {
  const [shouldShowUI, setShowUI] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  function expandFilterUI() {
    setShowUI(!shouldShowUI);
    setIsOpen(isOpen => !isOpen); // Toggle `isOpen` state
  }

  const [filter, setFilter] = useState({
    rent_range: "any",
    num_roommates: "any",
    num_bedrooms: "any",
    num_bathrooms: "any",
    is_furnished: "any",
    has_parking: "any",
    has_kitchen: "any"
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFilter({
      ...filter,
      [name]: value
    });
  };

  const handleApplyFilters = async () => {
    console.log("Applying filters");
    filterSetter(filter);
  };

  return (
    <div>
      <div className={`z-50 flex absolute bg-dark_maroon h-[6vh] w-[80vw] left-[3%] rounded-b-xl items-center justify-center transition-transform duration-500 ${shouldShowUI ? "translate-y-[0vh]" : "translate-y-[-6vh]"}`}>
        <div className="flex space-x-[0.5vw] text-black font-normal text-[1.1vw] font-inconsolata border-5 items-center">
          <select name="rent_range" id="rent_range"
            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white"
            onChange={handleChange}>
            <option value="any">Rent</option>
            <option value="0-499">$0-499</option>
            <option value="500-749">$500-749</option>
            <option value="750-999">$750-999</option>
            <option value="1000-1499">$1000-$1499</option>
            <option value="1500-+">$1500+</option>
          </select>
          <select name="num_roommates" id="num_roommates"
            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white"
            onChange={handleChange}>
            <option value="any">Roommates</option>
            <option value="0">None</option>
            <option value="1">1 Roommate</option>
            <option value="2">2 Roommates</option>
            <option value="3">3 Roommates</option>
            <option value="4">4 Roommates</option>
            <option value="5+">5+ Roommates</option>
          </select>
          <select name="num_bedrooms" id="num_bedrooms"
            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white"
            onChange={handleChange}>
            <option value="any">Bedrooms</option>
            <option value="1">1 Bedroom</option>
            <option value="2">2 Bedrooms</option>
            <option value="3">3 Bedrooms</option>
            <option value="4">4 Bedrooms</option>
            <option value="5+">5+ Bedrooms</option>
          </select>
          <select name="num_bathrooms" id="num_bathrooms"
            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white"
            onChange={handleChange}>
            <option value="any">Bathrooms</option>
            <option value="1">1 Bathroom</option>
            <option value="2">2 Bathrooms</option>
            <option value="3">3 Bathrooms</option>
            <option value="4">4 Bathrooms</option>
            <option value="5+">5+ Bathrooms</option>
          </select>
          <select name="has_parking" id="has_parking"
            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white"
            onChange={handleChange}>
            <option value="any">Parking</option>
            <option value="Included">Included</option>
            <option value="Additional Cost">Additional Cost</option>
            <option value="None">None</option>
          </select>
          <select name="has_kitchen" id="has_kitchen"
            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white"
            onChange={handleChange}>
            <option value="any">Kitchen</option>
            <option value="Full">Full</option>
            <option value="Partial">Partial</option>
            <option value="None">None</option>
          </select>
          <select name="is_furnished" id="is_furnished"
            className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white"
            onChange={handleChange}>
            <option value="any">Furnished</option>
            <option value="Fully">Fully</option>
            <option value="Partially">Partially</option>
            <option value="No">No</option>
          </select>
          <button className="bg-maroon_new text-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh]"
            onClick={handleApplyFilters}>
            Apply
          </button>
        </div>
      </div>

      <div className="flex justify-center z-0">
        <svg
          onClick={expandFilterUI}
          className={`absolute duration-[400ms] right-[70vh] ml-auto mr-auto cursor-pointer`}
          viewBox="0 -4.5 20 20"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{
            transform: isOpen ? "rotateX(180deg) translateY(-5.5vh)" : "rotateX(0deg) translateY(0)",
            transition: "transform 0.45s ease", // Smooth rotation and translation
            width: "10%", // Ensure the SVG scales correctly within the container
            height: "10%",
            transformStyle: "preserve-3d", // Enable 3D transformation
            opacity: isOpen ? 1 : 0.5, // Adjust opacity based on the `isOpen` state
          }}
        >
          <g
            id="Page-1"
            stroke="none"
            strokeWidth="0.5"
            fill="none"
            fillRule="evenodd"
          >
            <g
              id="Dribbble-Light-Preview"
              transform="translate(-220.000000, -6684.000000)"
              fill="#000000"
            >
              <g id="icons" transform="translate(56.000000, 160.000000)">
                <path
                  d="M164.292308,6524.36583 L164.292308,6524.36583 C163.902564,6524.77071 163.902564,6525.42619 164.292308,6525.83004 L172.555873,6534.39267 C173.33636,6535.20244 174.602528,6535.20244 175.383014,6534.39267 L183.70754,6525.76791 C184.093286,6525.36716 184.098283,6524.71997 183.717533,6524.31405 C183.328789,6523.89985 182.68821,6523.89467 182.29347,6524.30266 L174.676479,6532.19636 C174.285736,6532.60124 173.653152,6532.60124 173.262409,6532.19636 L165.705379,6524.36583 C165.315635,6523.96094 164.683051,6523.96094 164.292308,6524.36583"
                  id="arrow_down-[#338]"
                />
              </g>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
