import React from 'react';
import Carousel from "./ProfileCardContent/Carousel";
import NameAndBio from "./ProfileCardContent/NameAndBio";
import Top5Dorms from "./ProfileCardContent/Top5Dorms";
import ApartmentInfo from "./ProfileCardContent/ApartmentInfo";
import Poll from "./ProfileCardContent/Poll";
import SleepSchedule from "./ProfileCardContent/SleepSchedule";
import Carousel from "./ProfileCardContent/Carousel";
import backend from "../../backend";
import currentUser from '../../currentUser.js';
import Qna from "./ProfileCardContent/Qna";

// user_id: number, isDorm: boolean, broadcaster?: SignalBroadcaster
export function ProfileCard({user_id, isDorm, broadcaster}) {
  return ( // TODO
    <div className={`m-auto 2xl:w-[80rem] xl:w-[60rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] h-screen flex items-center justify-center font-profile font-bold text-maroon_new`}>
      <div className={"w-full aspect-[1.8475] relative h-auto flex flex-col mb-[4vh] bg-white rounded-lg overflow-hidden"}>
      {/*Bookmark button to save the profile to inbox, calls routes from Match.jsx*/}
      <button onClick={save_func}
                      className="w-[4%] h-[7%] absolute top-[5%] right-[3%] bg-maroon_new rounded-full hover:bg-maroon_dark shadow-md">
                  <img src="assets/images/match-save.svg" alt="Save" className="w-[50%] h-[50%] m-auto" />
              </button>
        <div className={"flex p-[4vh] h-full w-full lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem]"}>
          <div className="w-[30vh] h-full min-w-[25%]">
          <Carousel user_id={user_id} editable={broadcaster ? true : false}></Carousel>
          </div>
          <div className="flex flex-col lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem] grow">
            <div>
              <NameAndBio user_id={user_id} />
            </div>
            <div className="flex grow-[3] lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem]">
              <div className="grow-[2] flex flex-col overflow-x-hidden max-w-[60%] lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem]">
                <div className={"flex grow-[5] border-none border-2 border-maroon overflow-y-auto overflow-x-hidden max-h-40"}>
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
              <div className="grow-[2] flex flex-col lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem]">
                <div className={"flex grow-[3] border-dashed border-2 border-maroon"}>
                  {/* don't know if passing reveal answers is necessary */}
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
