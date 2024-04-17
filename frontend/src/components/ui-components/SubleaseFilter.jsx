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
    rent_range: "any"
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    let convertedValue = value;

    // Convert "Yes" to true and "No" to false

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
          <div className="flex space-x-[0.5vw] text-black font-normal text-[1.1vw] font-inconsolata border-5 items-center">
            <select name="rent_range" id="rent_range"
                    className="bg-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh] hover:bg-gold hover:text-white" onChange={handleChange}>
              <option value="any">Rent</option>
              <option value="0-499">$0-499</option>
              <option value="500-749">$500-749</option>
              <option value="750-999">$750-999</option>
              <option value="1000-1499">$1000-$1499</option>
              <option value="1500-+">$1500+</option>
            </select>
            <button className="bg-maroon_new text-white w-[9.4vw] h-[4.5vh] rounded-xl px-[1.5vw] py-[1vh]" onClick={handleApplyFilters}>
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
