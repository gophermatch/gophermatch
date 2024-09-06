import React, { useState } from 'react';
import backend from "../../backend";
import Carousel from "./ProfileCardContent/Carousel";
import NameAndBio from "./ProfileCardContent/NameAndBio";
import Top5Dorms from "./ProfileCardContent/Top5Dorms";
import ApartmentInfo from "./ProfileCardContent/ApartmentInfo";
import Poll from "./ProfileCardContent/Poll";
import Qna from "./ProfileCardContent/Qna";
import preferenceIcon from "../../assets/images/housingPreferenceIcon.svg";
import SleepSchedule from './ProfileCardContent/SleepSchedule';
import pencil from "../../assets/images/pencil.svg";
import close from "../../assets/images/red_x.svg";
import hoverClose from '../../assets/images/gold_x.svg';

export function ProfileCard({ user_id, isDorm, switchProfileMode, broadcaster, dormToggle, profileMode, save_func, isDormBackend, pageType }) {
  const [reset, setReset] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    setIsCardHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setIsCardHovered(false);
  };

  async function resetProfile() {
    await backend.post('profile/reset-profile', {
      user_id: user_id
    });
    window.location.reload();
  }

  function onSaveClick() {
    if (isSaving) return;
    setIsSaving(true);
    setIsAnimating(true);
    broadcaster.fire()
      .catch((e) => console.error("SAVE NOT SUCCESSFUL: ", e))
      .finally(() => {
        setIsSaving(false);
        setIsEditing(false);
        setTimeout(() => setIsAnimating(false), 300); // Match the duration of the animation
      });
  }

  function discardChanges() {
    setIsEditing(false);
  }

  const save_or_cancel = isEditing ? (
    <div className="absolute flex align-middle justify-between top-[40px] right-[40px] h-[4vh]">
      <button
        onClick={onSaveClick}
        className={`rounded-lg px-[35px] font-roboto_slab text-white hover:bg-login ${isSaving ? "bg-newwhite" : "bg-maroon"}`}
        disabled={isSaving}
      >
        Save Changes
      </button>
      <button 
        onClick={discardChanges} 
        className="w-[20px] ml-[15px]" 
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img src={isHovered ? hoverClose : close} alt="Close" />
      </button>
    </div>
  ) : (
    pageType === 'profile' && (
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-[40px] right-[40px] w-[5vh] h-[5vh]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          transition: 'transform 0.3s ease',
          transform: isHovered ? 'scale(1.2)' : 'scale(1)'
        }}
      >
        <img src={pencil} alt="Edit" />
      </button>
    )
  );
  
  return (
    <div
      className={`m-auto 2xl:w-[80rem] xl:w-[60rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] h-screen flex items-center justify-center flex-col font-profile font-bold text-maroon_new relative z-10 card-container ${isCardHovered ? 'scale-up' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: 'transform 0.3s ease',
        transform: isAnimating ? 'scale(0.95)' : 'scale(1)',
        overflow: 'hidden'
      }}
    >
      {/* Profile Mode Header */}
      {profileMode && (
        <div className="flex mr-[35vw]">
          {/* Dorm / Apartment Toggle */}
          <div className={`flex flex-row-reverse font-roboto_slab text-white w-[12vw] h-[4vh] justify-center items-center rounded-t-[1vw] ${isDorm ? 'bg-maroon' : 'bg-dark_maroon'}`}>
            <button className="ml-[0.5vw]" onClick={switchProfileMode}>Dorm</button>
            {isDorm && <img src={preferenceIcon} width="20px" height="20px" alt="Dorm Icon" />}
          </div>
          <div className={`flex flex-row-reverse font-roboto_slab text-white w-[12vw] h-[4vh] justify-center items-center rounded-t-[1vw] ${isDorm ? 'bg-dark_maroon' : 'bg-maroon'}`}>
            <button className="ml-[0.5vw]" onClick={switchProfileMode}>Apartment</button>
            {!isDorm && <img src={preferenceIcon} width="20px" height="20px" alt="Apartment Icon" />}
          </div>
          {/* Dorm/Apartment Profile Toggle */}
          <div className="flex flex-column">
            <div
              className={`w-[2.66vw] h-[1.33vw] flex items-center bg-gray-300 rounded-full ml-[0.5vw] mt-[0.5vh] cursor-pointer ${isDormBackend ? 'bg-gray p-0' : 'bg-black p-[0.2vw]'}`}
              onClick={dormToggle}
            >
              <div
                className={`w-[1.33vw] h-[1.33vw] rounded-full shadow-md transform duration-300 ease-in-out ${isDormBackend ? 'translate-x-0 bg-dark_maroon' : 'translate-x-[1.13vw] bg-maroon'}`}
              />
            </div>
            <p className="ml-[0.5vw] mt-[0.66vh] w-[2.66vw] h-[1.33vw] whitespace-nowrap font-roboto_slab text-sm">
              {isDormBackend ? 'Dorm profile is public' : 'Apartment profile is public'}
            </p>
            {/* Reset Profile */}
            {!broadcaster && (
              <div className="absolute flex items-center right-0 mr-[2vw] whitespace-nowrap font-roboto_slab text-sm">
                <button className="mr-[0.25vw]" onClick={() => setReset(true)}>Reset Profile</button>
                {reset && (
                  <div>
                    <button onClick={resetProfile}>✅</button>
                    <button onClick={() => setReset(false)}>❎</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      {/* Profile Content */}
      <div className="relative w-full aspect-[1.8475] h-auto flex flex-col mb-[4vh] bg-white rounded-lg overflow-hidden">
        <div className="flex p-[4vh] h-full w-full gap-[3.6%]">
          <div className="w-[30vh] h-full min-w-[25%]">
            <Carousel user_id={user_id} editable={isEditing} />
          </div>
          <div className="flex flex-col gap-[3.6%] grow">
            <div>
              <NameAndBio user_id={user_id} broadcaster={isEditing ? broadcaster : null} editable={isEditing} />
            </div>
            <div className="flex grow-[3] gap-[3.6%]">
              <div className="grow-[2] flex flex-col overflow-x-hidden max-w-[60%] gap-[3.6%]">
                <div className="flex grow-[5] border-none border-2 border-maroon overflow-y-auto overflow-x-hidden max-h-40">
                  {isDorm ? <Top5Dorms user_id={user_id} broadcaster={isEditing ? broadcaster : null} editable={isEditing} /> : <ApartmentInfo user_id={user_id} broadcaster={isEditing ? broadcaster : null} editable={isEditing} />}
                </div>
                <div className="flex grow-[3]">
                  <Qna user_id={user_id} broadcaster={isEditing ? broadcaster : null} editable={isEditing} />
                </div>
              </div>
              <div className="grow-[2] flex flex-col gap-[3.6%]">
                <div className="flex h-[10%] border-none border-2 border-maroon">
                  <Poll answersRevealed={profileMode} user_id={user_id} broadcaster={isEditing ? broadcaster : null} editable={isEditing} />
                </div>
                <div className="flex  border-dashed border-2 border-maroon">
                  <SleepSchedule user_id={user_id} broadcaster={isEditing ? broadcaster : null} editable={isEditing} />
                </div>
              </div>
            </div>
          </div>
        </div>
        {save_or_cancel}
      </div>
    </div>
  );
}
