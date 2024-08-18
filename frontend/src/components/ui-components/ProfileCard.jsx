import React from 'react';
import Carousel from "./ProfileCardContent/Carousel";
import NameAndBio from "./ProfileCardContent/NameAndBio";
import Top5Dorms from "./ProfileCardContent/Top5Dorms";
import ApartmentInfo from "./ProfileCardContent/ApartmentInfo";
import Poll from "./ProfileCardContent/Poll";
import Qna from "./ProfileCardContent/Qna";


// user_id: number, isDorm: boolean, showApt: boolean, broadcaster?: SignalBroadcaster
export function ProfileCard({user_id, isDorm, broadcaster, dormToggle, profileMode, save_func}) {
  return ( // TODO
    <div className={`m-auto 2xl:w-[80rem] xl:w-[60rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] h-screen flex items-center justify-center flex-col font-profile font-bold text-maroon_new relative z-10`}>
      {profileMode &&
      <div className={"flex mr-[40vw]"}>
        <div className={`flex flex-row-reverse font-roboto_slab text-white w-[12vw] justify-center items-center rounded-t-[1vw] ${
            isDorm ? 'bg-maroon' : 'bg-dark_maroon'
        }`}>
          <button className={"ml-[0.5vw]"}>Dorm</button>
          <div
            className={`w-[2.66vw] h-[1.33vw] flex items-center bg-gray-300 rounded-full p-0 cursor-pointer ${
            isDorm ? 'bg-black p-0' : 'bg-gray p-[0.2vw]'
          }`}
            onClick={dormToggle}
          >
        <div
        className={`w-[1.33vw] h-[1.33vw] rounded-full shadow-md transform duration-300 ease-in-out ${
          isDorm ? 'translate-x-0 bg-dark_maroon' : 'translate-x-[1.13vw] bg-maroon'
        }`}
      ></div>
    </div>
          </div>
          <div className={`flex flex-row-reverse font-roboto_slab text-white w-[12vw] justify-center items-center rounded-t-[1vw] ${
            isDorm ? 'bg-dark_maroon' : 'bg-maroon'
          }`}>
                <button className={"ml-[0.5vw]"}>Apartment</button>
                <div
                  className={`w-[2.66vw] h-[1.33vw] flex items-center bg-gray-300 rounded-full p-0 cursor-pointer ${
                  isDorm ? 'bg-gray p-[0.2vw]' : 'bg-black p-0'
                }`}
                  onClick={dormToggle}
                >
              <div
              className={`bg-dark_maroon w-[1.33vw] h-[1.33vw] rounded-full shadow-md transform duration-300 ease-in-out ${
                isDorm ? 'translate-x-[1.13vw] bg-maroon' : 'translate-x-0 bg-dark_maroon'
              }`}
            > 
            </div>
          </div>
        </div>
      </div>
      }
      <div className={"relative w-full aspect-[1.8475] h-auto flex flex-col mb-[4vh] bg-white rounded-lg overflow-hidden"}>
      {/*Bookmark button to save the profile to inbox, calls routes from Match.jsx*/}
      <button onClick={save_func}
                      className="w-[4%] h-[7%] absolute top-[5%] right-[3%] bg-maroon_new rounded-full hover:bg-maroon_dark shadow-md">
                  <img src="assets/images/match-save.svg" alt="Save" className="w-[50%] h-[50%] m-auto" />
              </button>
        <div className={"flex p-[4vh] h-full w-full gap-[3.6%]"}>
          <div className="w-[30vh] h-full min-w-[25%]">
          <Carousel user_id={user_id} editable={broadcaster ? true : false}></Carousel>
          </div>
          <div className="flex flex-col gap-[3.6%] grow">
            <div>
              <NameAndBio user_id={user_id} broadcaster={broadcaster} />
            </div>
            <div className="flex grow-[3] gap-[3.6%]">
              <div className="grow-[2] flex flex-col overflow-x-hidden max-w-[60%] gap-[3.6%]">
                <div className={"flex grow-[5] border-none border-2 border-maroon overflow-y-auto overflow-x-hidden max-h-40"}>
                  {/*How should we really pass this? Match and Profile page will end up passing it differently, but we could use the same prop*/}
                  {isDorm ?
                    <Top5Dorms user_id={user_id} broadcaster={broadcaster} />
                    :
                    <ApartmentInfo user_id={user_id} broadcaster={broadcaster} />
                  }
                </div>
                  <div className={"flex grow-[3]"}>
                    <Qna user_id={user_id} broadcaster={broadcaster} />
                  </div>
                </div>
              <div className="grow-[2] flex flex-col gap-[3.6%]">
                <div className={"flex grow-[3] border-none border-2 border-maroon"}>
                  <Poll revealAnswers={true} user_id={user_id} broadcaster={broadcaster} />
                </div>
                <div className={"flex grow-[1] border-dashed border-2 border-maroon"}>
                  {/* Sleep schedule */}
                  Sleep sched here
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
