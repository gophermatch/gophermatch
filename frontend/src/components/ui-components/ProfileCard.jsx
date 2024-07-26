import { useState } from "react";
import NameAndBio from "./ProfileCardContent/NameAndBio";
import Top5Dorms from "./ProfileCardContent/Top5Dorms";
import ApartmentInfo from "./ProfileCardContent/ApartmentInfo";
import Qna from "./ProfileCardContent/Qna";
import Poll from "./ProfileCardContent/Poll";
import SleepSchedule from "./ProfileCardContent/SleepSchedule";
import Carousel from "./ProfileCardContent/Carousel";

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
export function ProfileCard({
  name,
  major,
  bio,
  pictureUrls,
  qna,
  sleepSchedule,
  pollData,
  aptOrDormData,
}) {
  pollData = {
    question: "What is your favorite color?",
    answers: [
      { answer: "Red", votes: 15 },
      { answer: "Blue", votes: 20 },
      { answer: "Green", votes: 10 },
      { answer: "Yellow", votes: 5 }
    ]
  };
  return (
    <div className={`m-auto 2xl:w-[80rem] xl:w-[60rem] lg:w-[45rem] md:w-[30rem] sm:w-[20rem] h-screen flex items-center justify-center font-profile font-bold text-maroon_new`}>
      <div className={"w-full aspect-[1.8475] h-auto flex flex-col mb-[4vh] bg-white rounded-lg overflow-hidden"}>
        <div className={"flex p-[4vh] h-full w-full lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem]"}>
          <div className="w-[30vh] h-full border-dashed border-2 border-maroon min-w-[25%]">
            Carousel here
            {/* <Carousel editable={false} pictureUrls={pictureUrls}></Carousel> */}
          </div>
          <div className="flex flex-col lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem] grow">
            <div className="flex grow-[2] flex-col border-dashed border-2 border-maroon">
              <NameAndBio name={name} major={major} bio={bio} />
            </div>
            <div className="flex grow-[3] lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem]">
              <div className="grow-[2] flex flex-col overflow-x-hidden max-w-[60%] lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem]">
                <div className={"flex grow-[5] border-none border-2 border-maroon overflow-y-auto overflow-x-hidden max-h-40"}>
                  {aptOrDormData && aptOrDormData.type === "dorm" ? <Top5Dorms dormData={aptOrDormData}/> : <ApartmentInfo aptData={aptOrDormData}/>}
                </div>
                  <div className={"flex grow-[3] border-dashed border-2 border-maroon"}>
                    <Qna qna={qna} />
                  </div>
                </div>
              <div className="grow-[2] flex flex-col lg:gap-[1.5rem] md:gap-[1rem] sm:gap-[0.5rem]">
                <div className={"flex grow-[3] border-dashed border-2 border-maroon"}>
                  <Poll pollData={pollData} revealAnswers={false}/>
                </div>
                <div className={"flex grow-[1] border-dashed border-2 border-maroon"}>
                  <SleepSchedule sleepSchedule={sleepSchedule} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}






// import React, { useEffect, useState } from "react";
// import Carousel from './Carousel';
// import styles from '../../assets/css/profile.module.css';
// import kanye from '../../assets/images/kanye.png';
// import other from '../../assets/images/testprofile.png';
// import TopFive from "./TopFive.jsx";
// import qnaData from "./qnaOptions.json";
// import currentUser from "../../currentUser.js";
// import backend from "../../backend.js";
// import InputRange from 'react-input-range';
// import 'react-input-range/lib/css/index.css';
// import sliderStyles from '../../assets/css/slider.module.css';

// export default function Profile({ user_data, editable, handleBioChange, handleQnaChange, qnaAnswers, editedBio, apartmentData, dormMode, top5, setTop5, top5Question, setTop5Question }) {

//   const [pictureUrls, setPictureUrls] = useState(["", "", ""]);
//   const [sliderValue, setSliderValue] = useState({ min: 80, max: 144 });
//   const [isEditing, setIsEditing] = useState(false);

//   const formatTime = (value) => {
//     const hours = Math.floor(value / 4);
//     const minutes = (value % 4) * 15;
//     const ampm = hours < 12 ? "am" : "pm";
//     const formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

//     // Special case when the slider passes 12pm
//     if (value === 144) {
//         return `12pm+`;
//     }

//     // Special case when the slider passes 12
//     if (hours >= 24) {
//         if (hours === 24) {
//           return `12:${minutes === 0 ? "00" : minutes}am`;
//         }
//         return `${hours - 24}:${minutes === 0 ? "00" : minutes}am`;
//     }

//     return `${formattedHours}:${minutes === 0 ? "00" : minutes}${ampm}`;
// };  

//   useEffect(() => {
//     fetchPictureUrls();
//   }, [user_data]);

//   const fetchPictureUrls = async () => {
//     try {
//       const response = await backend.get("/profile/user-pictures", {
//         params: {user_id: user_data.user_id},
//         withCredentials: true,
//       });
//       if (response) {
//         const data = response.data;

//         setPictureUrls(data.pictureUrls)
//       } else {
//         throw new Error("Failed to fetch picture URLs");
//       }
//     } catch (error) {
//       console.error("Error fetching picture URLs:", error);
//     }
//   };

//   // Function to find the selected option_id for a given question_id
//   const getSelectedOptionId = (questionId) => {
//     const monthNumbers = {};

//     for (let i = 1; i <= 12; i++) {
//       const monthNumber = i.toString().padStart(2, '0');
//       const monthIndex = 96 + i - 1;
//       monthNumbers[monthNumber] = monthIndex;
//     }

//     if(questionId == 14){
//       const moveIn = apartmentData ? apartmentData.move_in_date : null;
//       if(moveIn != null && !editable){
//         return apartmentData ? monthNumbers[moveIn.slice(5,7)] : null;
//       }
//     } else if(questionId == 15){
//       const moveOut = apartmentData ? apartmentData.move_out_date : null;
//       if(moveOut != null && !editable){
//         return apartmentData ? monthNumbers[moveOut.slice(5,7)]+12 : null;
//       }
//     }

//     if (Array.isArray(qnaAnswers)) {
//       const answer = qnaAnswers.find(ans => ans.question_id === questionId);
//       return answer ? answer.option_id : null;
//     }
//     return null;
//   };

//   const getSelectedTextField = (questionId) => {
//     if(questionId == 16){
//       return apartmentData ? apartmentData.rent : null;
//     }
//     return null;
//   };

//   const qnaItems = qnaData.map((item, index) => (
//     <div key={item.id} className={`flex w-full pl-[0.75vw] pr-[1vw] border-b ${index !== qnaData.length - 1 ? 'mb-[0.1vh]' : ''} ${index === 0 ? 'mt-[0.25vh]' : ''} ${index === 3 ? 'mt-[0.25vh]' : ''} ${index===6 ? 'border-b-0' : ''} ${index===2 ? 'border-b-0' : ''}`} style={{ minHeight: '1vh' }}>
//       <p className="flex-[1vh] flex items-center" style={{ lineHeight: '1.875' }}>{item.question}</p>
//       {editable && item.isTextField ? (
//         <input
//           type="text"
//           className="text-right"
//           // write function below
//           onChange={(event) => handleTextChange(event, item.id)}
//         />
//       ) : null}
//       {editable && !item.isTextField ? (
//         <select
//           className={"text-right"}
//           value={getSelectedOptionId(item.id) || ''}
//           onChange={(event) => handleQnaChange(event, item.id)}
//         >
//           {item.options.map((option) => (
//             <option key={option.option_id} value={option.option_id}>
//               {option.text}
//             </option>
//           ))}
//         </select>
//       ) : ( null)}
//       {(!editable && !item.isTextField) && <p className="truncate whitespace-nowrap mt-[0.4vh]">
//           {item.options.find(o => o.option_id === getSelectedOptionId(item.id))?.text || 'N/A'}
//         </p>}
//       {(!editable && item.isTextField) && <p className="truncate whitespace-nowrap">
//         {getSelectedTextField(item.id)}
//       </p>}
//     </div>
//   ));
  
//   const toggleEditMode = () => {
//     if (isEditing) {
//       setEditedProfile(profile);
//     }
//     setIsEditing(prev => !prev);
//   };

//   return (
//     <>
//       <div className={`m-auto w-[65vw] h-screen flex items-center justify-center font-profile font-bold text-maroon_new`}>
//         <div className={"w-full flex flex-col h-[70vh] mb-[4vh] bg-white rounded-3xl overflow-hidden"}>
//           <div className={"flex h-[35vh] "}>
//             <div className={"w-[24vw] h-[24vh] bg-white rounded-3xl mt-[4vh] ml-[-1.6vh]"}>
//               <Carousel pictureUrls={pictureUrls} editable={editable}></Carousel>
//             </div>
//             <div className={"flex-grow flex flex-col bg-white"}>
//               <div className={"h-[3vh]"}>
//               <p className={"text-[1.22vw] ml-[-0.625vw] mt-[3vh] inline-block flex flex-col"}>
//                 <span className="font-bold text-[1.7vw]">{user_data?.first_name} {user_data?.last_name}</span>
//                 <span>{user_data?.major} Major</span>
//               </p>
//               </div>
//               <div className={"flex-grow rounded-2xl w-[40.5vw] ml-[-0.5vw] mt-[9vh] mb-[1.5vh] border-2 border-maroon_new overflow"}>
//                 <p className={"w-full h-full"}>
//                   {editable ? (
//                             <textarea
//                             className={`${styles.bioTextArea} ${editable ? 'w-full h-full' : ''}`}
//                             value={editedBio || ''}
//                               onChange={handleBioChange}
//                               placeholder="Edit Bio"
//                             />
//                           ) : (
//                             <p className={`${styles.bioTextArea}`}>{editedBio}</p>
//                             )}
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className={`${dormMode === 0 ? "block" : "hidden"} flex flex-grow`}>
//             <div className={"flex-1 flex-col h-[16.5vh] m-[3%] mt-[6vh] ml-[2vw] mb-[0%] rounded-3xl border-2 border-maroon_new overflow-hidden text-[2vh]"}>
//               {qnaItems.slice(0,1)}
//               {qnaItems.slice(4,7)}
//             </div>
//             <div className={"flex-1 flex-col flex h-[16.5vh] mt-[6vh] mr-[3vw] ml-0 mb-0 rounded-3xl border-2 overflow-hidden text-[2vh]"}>
//               <div className="flex flex-row mt-[0.5vh]">
//                 <span className="ml-[0.75vw]">Gender:</span>
//                 <span className="flex items-end ml-auto mr-[0.75vw]">{user_data?.gender.charAt(0).toUpperCase() + user_data?.gender.slice(1)}</span>
//               </div>
//               <div className="bg-maroon h-[0.125vh] w-full mt-[0.25vh]"></div>
//                 <div className="flex flex-row mt-[0.5vh]">
//                   <span className="ml-[0.75vw]">College:</span>
//                   <span className="flex items-end ml-auto mr-[0.75vw]">
//                    {['Carlson', 'Nursing', 'Design'].includes(user_data?.college)
//                      ? user_data?.college.charAt(0).toUpperCase() + user_data?.college.slice(1)
//                      : user_data?.college.toUpperCase()}
//                   </span>
//               </div>
//               <div className="bg-maroon h-[0.125vh] w-full mt-[0.25vh]"></div>
//               <div className="flex flex-row mt-[0.5vh]">
//                 <span className="ml-[0.75vw]">Graduation Year:</span>
//                 <span className="flex items-end ml-auto mr-[0.75vw]">{user_data.graduating_year}</span>
//               </div>
//               <div className="bg-maroon h-[0.125vh] w-full mt-[0.25vh]"></div>
//               <div className="flex flex-row mt-[0.5vh]">
//                 <span className="ml-[0.75vw]">Hometown: </span>
//                 <span className="flex items-end ml-auto mr-[0.75vw]">{user_data.hometown}</span>
//               </div>
//             </div>
//             <div className={"flex-1 m-[1vw] mx-0 mb-0 pt-[1vh] h-[25vh] mt-[6vh] mr-[2vw] rounded-3xl border-2 border-maroon_new text-[2vh]"}>
//               <TopFive question={top5Question} updateQuestion={setTop5Question} rankings={top5} update={setTop5} editing={editable}></TopFive>
//             </div>
//           </div>
//           <div className={`${dormMode === 1 || dormMode === 2 ? "block" : "hidden"} flex flex-grow`}>
//             <div className={"flex-1 flex-col h-[25vh] m-[5%] mt-[6vh] ml-[2vw] mb-[0%] rounded-3xl border-2 border-maroon_new overflow-hidden text-[2vh]"}>
//               {qnaItems.slice(0,1)}
//               {qnaItems.slice(6,11)}
//             </div>
//             <div className={"flex-1 flex-col flex h-[25vh] mt-[6vh] mr-[3vw] ml-0 mb-0 rounded-3xl border-2 overflow-hidden text-[2vh]"}>
//               {qnaItems.slice(11, 16)}
//             </div>
//             {/* <div className={"flex-1 m-[1vw] mx-0 mb-0 pt-[1vh] h-[25vh] mt-[6vh] mr-[2vw] rounded-3xl border-2 border-maroon_new text-[2vh]"}>
//               <TopFive question={"My Top 5 Superheroes"} rankings={["Ironman", "Batman", "Spiderman", "Black Widow", "Captain America"]} editing={editable}></TopFive>
//             </div> */}
//           </div>
//           <div className="absolute bottom-[19vh] left-[19vw] w-[30%]">
//           <span className="ml-[8.75vw] text-[2.25vh]">Sleep Schedule</span>

//             <InputRange
//               draggableTrack
//               maxValue={144}
//               minValue={80}
//               value={sliderValue}
//               onChange={value => setSliderValue(value)}
//               formatLabel={() => null}
//               className={{
//                 slider: 'maroon',
//                 track: 'maroon',
//                 activeTrack: 'maroon',
//                 labelContainer: 'maroon',
//               }}
//               />
//             <div className="flex justify-between">
//               <span className="text-[2.25vh]">{formatTime(sliderValue.min)}</span>
//               <span className="text-[2.25vh]">{formatTime(sliderValue.max)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }