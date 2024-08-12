import React from 'react';
import Carousel from "./ProfileCardContent/Carousel";
import NameAndBio from "./ProfileCardContent/NameAndBio";
import Top5Dorms from "./ProfileCardContent/Top5Dorms";
import ApartmentInfo from "./ProfileCardContent/ApartmentInfo";
import Poll from "./ProfileCardContent/Poll";
import Qna from "./ProfileCardContent/Qna";

// user_id: number, isDorm: boolean, broadcaster?: SignalBroadcaster
export function ProfileCard({user_id, isDorm, broadcaster, save_func}) {
  return ( // TODO
    <div className={`m-auto 2xl:w-[80rem] xl:w-[60rem] lg:w-[45rem] md:w-[35rem] sm:w-[30rem] w-[25rem] h-screen flex items-center justify-center font-profile font-bold text-maroon_new`}>
      <div className={"w-full aspect-[1.8475] relative h-auto flex flex-col mb-[4vh] bg-white rounded-lg overflow-hidden"}>
      {/*Bookmark button to save the profile to inbox, calls routes from Match.jsx*/}
      <button onClick={save_func}
                      className="w-[4%] h-[7%] absolute top-[5%] right-[3%] bg-maroon_new rounded-full hover:bg-maroon_dark shadow-md">
                  <img src="assets/images/match-save.svg" alt="Save" className="w-[50%] h-[50%] m-auto" />
              </button>
        <div className={"flex p-[2%] h-full w-full gap-[3.6%]"}>
          <div className="w-[25%] h-full min-w-[25%]">
          <Carousel user_id={user_id} editable={broadcaster ? true : false}></Carousel>
          </div>
          <div className="flex flex-col w-[70.5%] gap-[3.6%]">
            <div>
              <NameAndBio user_id={user_id} />
            </div>
            <div className="flex h-[50%] gap-[3.6%]">
              <div className="flex w-[55%] flex-col overflow-x-hidden gap-[7.2%]">
                <div className={"flex h-[65%] overflow-y-auto overflow-x-hidden"}>
                  {isDorm ?
                    <Top5Dorms user_id={user_id} broadcaster={broadcaster} />
                    :
                    <ApartmentInfo user_id={user_id} broadcaster={broadcaster} />
                  }
                </div>
                  <div className={"h-[40%]"}>
                    <Qna user_id={user_id} broadcaster={broadcaster} />
                  </div>
                </div>
              <div className="grow-[2] flex flex-col gap-[3.6%]">
                <div className={"flex grow-[3] border-dashed border-2 border-maroon overflow-hidden"}>
                  {/* don't know if passing reveal answers is necessary */}
                  <Poll revealAnswers={true} user_id={user_id} broadcaster={broadcaster} />
                </div>
                <div className={"flex grow-[1] border-dashed border-2 border-maroon overflow-hidden"}>
                  {/* Sleep schedule */}
                  <div>Sleep schedule here</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
