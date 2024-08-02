import EditPoll from "./ProfileCardContent/EditPoll";
import React, { useState, useEffect, useMemo } from 'react';
import NameAndBio from "./ProfileCardContent/NameAndBio";
import pencil from "../../assets/images/pencil.svg";
import close from "../../assets/images/red_x.svg";

/*
interface qna {
  [question: string]: [answer: string]
}
interface pollData {
  question: string
  answers: { answer: string, votes: number }[]
}
interface dormData {
  type: "dorm"
  top5Dorms: string[]
  ...maybe other dorm data later
}
interface aptData {
  type: "apartment"
  aptName:? string
  beds: number
  baths: number
  monthlyRent: { min: number, max: number }
  tags: { tag: string, enabled: boolean }
}
interface profileData {
  name: string
  major: string
  bio: string
  pictureUrls: string[]
  qna: qna,
  sleepSchedule: { start: number, end: number }
  pollData: pollData
  aptOrDormData: aptData | dormData
}
*/
class SaveBroadcaster {
  callbacks = [];

  async fire() {
    return Promise.all(this.callbacks.map(cb => cb()));
  }

  connect(callback) {
    this.callbacks.push(callback);
  }

  disconnect(callback) {
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    }
  }
}


export function EditProfileCard({user_id}) {
  const broadcaster = useMemo(() => new SaveBroadcaster(), []);
  const [isSaving, setIsSaving] = useState(false); // waiting for backend response
  const [isEditing, setIsEditing] = useState(false); // editing profile data
  const [isDorm, setIsDorm] = useState(false); // dorm or apartment mode

  function onSaveClick() {
    if (isSaving) {
      return
    }
    setIsSaving(true)
    broadcaster.fire()
      .catch((e) => console.error("SAVE NOT SUCCESSFUL: ", e))
      .then(() => setIsSaving(false))
      .finally(() => setIsEditing(false)) //TODO: increment profile card key should cause elements to refresh
  }

  const save_or_cancel = (isEditing ?
    <div className="absolute flex align-middle justify-between top-[40px] right-[40px] h-[4vh]">
      <button onClick={onSaveClick} className={`rounded-lg px-[35px] font-roboto_slab text-white ${isSaving ? "bg-newwhite" : "bg-maroon"}`}>Save Changes</button>
      <button onClick={() => setIsEditing(false)} className="w-[20px] ml-[15px]">
        <img src={close} />
      </button>
    </div>
    :
    <button onClick={() => setIsEditing(true)} className="absolute top-[40px] right-[40px] w-[5vh] h-[5vh]">
      <img src={pencil} />
    </button>
  )

  return ( // TODO
    <div className={`m-auto 2xl:w-[80rem] xl:w-[60rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] h-screen flex items-center justify-center font-profile font-bold text-maroon_new`}>
      <div className={"relative w-full aspect-[1.8475] h-auto flex flex-col mb-[4vh] bg-white rounded-lg overflow-hidden"}>
        <div className={"flex p-[4vh] h-full w-full lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem]"}>
          <div className="w-[30vh] h-full border-dashed border-2 border-maroon min-w-[25%]">
            EDITING
            {/* Carousel */}
          </div>
          <div className="flex flex-col lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem] grow">
            <div className="flex grow-[2] flex-col">
              <div className={"flex grow-[2] border-dashed border-2 border-black"}>
                <NameAndBio name={"Joe"} major={"CSE"} bio={"Very cool"} broadcaster={broadcaster} />
              </div>
              <div className={"flex grow-[5] border-dashed border-2 border-maroon"}>
                {/* Bio */}
                Bio here
              </div>
            </div>
            <div className="flex grow-[3] lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem]">
              <div className="grow-[2] flex flex-col overflow-x-hidden max-w-[60%] lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem]">
                <div className={"flex grow-[5] border-none border-2 border-maroon overflow-y-auto overflow-x-hidden max-h-40"}>
                  {/* Apt/Dorm */}
                  {/* <ApartmentInfo qnaAnswers={qnaAnswers} apartmentData={apartmentData}/> */}
                </div>
                  <div className={"flex grow-[3] border-dashed border-2 border-maroon"}>
                    {/* QNA */}
                    Qna here
                  </div>
                </div>
              <div className="grow-[2] flex flex-col lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem]">
                <div className={"flex grow-[3] border-dashed border-2 border-maroon"}>
                  {/* Poll */}
                  {/* <EditPoll pollData={pollData} updatePollData={updatePollData} userId={16}/>  */}
                </div>
                <div className={"flex grow-[1] border-dashed border-2 border-maroon"}>
                  {/* Sleep schedule */}
                  Sleep sched here
                </div>
              </div>
            </div>
          </div>
        </div>
        {save_or_cancel}
      </div>
    </div>
  )
}
