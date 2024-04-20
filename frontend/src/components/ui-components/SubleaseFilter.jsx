import React, { useState } from 'react';
import currentUser from '../../currentUser';
import backend from '../../backend';
import qnaOptions from './qnaOptions.json';

export default function SubleaseFilter({filterSetter}) {
  const [shouldShowUI, setShowUI] = useState(false);

  function expandFilterUI() {
    setShowUI(!shouldShowUI);
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

    let convertedValue = value;

    setFilter({
      ...filter,
      [name]: convertedValue
    });
  };

  const handleApplyFilters = async () => {
    console.log("Applying filters");
    filterSetter(filter);
  };

  return(
    <div>
        <div className={`flex absolute bg-dark_maroon h-[6vh] w-[80vw] left-[3%] rounded-b-xl items-center justify-center transition-transform duration-500 ${shouldShowUI ? "translate-y-[0vh]" : "translate-y-[-6vh]"}`}>
          <div
            className="flex space-x-[0.5vw] text-black font-normal text-[1.1vw] font-inconsolata border-5 items-center">
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

      <div className="flex justify-center">
        <img
          className={`h-[10vh] w-[18vh] p-5 transition-transform duration-500 ${shouldShowUI ? "translate-y-[4.5vh] scale-y-[1]" : "translate-y-[-2vh] scale-y-[-1]"} opacity-50 hover:opacity-100`}
          src="../assets/images/TabArrow.png" onClick={expandFilterUI}>
        </img>
      </div>
    </div>
  );

}
