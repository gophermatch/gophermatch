import React from 'react';

const ProfileTab = ({onToggleVisible, onChangeTab, dormActive, apartmentActive}) =>
{

    const selectedTabIndex = 0;

    const setTab = (index) => {
      selectedTabIndex = index;
      onChangeTab(index);
    }

    return (
        <div className={"flex mr-[40vw]"}>
        <div className={`flex flex-row-reverse font-roboto_slab text-white w-[12vw] justify-center items-center rounded-t-[1vw] ${
            selectedTabIndex == 0 ? 'bg-maroon' : 'bg-dark_maroon'
        }`}>
          <button className={"ml-[0.5vw]"} onClick={setTab(0)}>Dorm</button>
          <div
            className={`w-[2.66vw] h-[1.33vw] flex items-center bg-gray-300 rounded-full p-0 cursor-pointer ${
            !dormActive ? 'bg-black p-0' : 'bg-gray p-[0.2vw]'
          }`}
            onClick={onToggleVisible("dorm")}
          >
        <div
        className={`w-[1.33vw] h-[1.33vw] rounded-full shadow-md transform duration-300 ease-in-out ${
          selectedTabIndex == 0 ? 'translate-x-0 bg-dark_maroon' : 'translate-x-[1.13vw] bg-maroon'
        }`}
      ></div>
    </div>
          </div>
          <div className={`flex flex-row-reverse font-roboto_slab text-white w-[12vw] justify-center items-center rounded-t-[1vw] ${
            selectedTabIndex == 1 ? 'bg-maroon' : 'bg-dark_maroon'
          }`}>
                <button className={"ml-[0.5vw]"} onClick={setTab(1)}>Apartment</button>
                <div
                  className={`w-[2.66vw] h-[1.33vw] flex items-center bg-gray-300 rounded-full p-0 cursor-pointer ${
                  !apartmentActive ? 'bg-gray p-[0.2vw]' : 'bg-black p-0'
                }`}
                  onClick={onToggleVisible("apartment")}
                >
              <div
              className={`bg-dark_maroon w-[1.33vw] h-[1.33vw] rounded-full shadow-md transform duration-300 ease-in-out ${
                selectedTabIndex == 1 ? 'translate-x-[1.13vw] bg-maroon' : 'translate-x-0 bg-dark_maroon'
              }`}
            > 
            </div>
          </div>
        </div>
      </div>
    );
};

export default ProfileTab;