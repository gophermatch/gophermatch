import React, { useEffect, useState } from "react";
import Carousel from './Carousel';
import styles from '../../assets/css/profile.module.css';
import kanye from '../../assets/images/kanye.png';
import other from '../../assets/images/testprofile.png';
import TopFive from "./TopFive.jsx";
import qnaData from "./qnaOptions.json";
import currentUser from "../../currentUser.js";
import backend from "../../backend.js";
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import sliderStyles from '../../assets/css/slider.module.css';

export default function Profile(props) {

  const { profile_data, user_data, editable, handleBioChange, handleQnaChange, handleTextChange, qnaAnswers, apartmentData, dormMode } = props;
  let pictures = [kanye, other, kanye];
  const [pictureUrls, setPictureUrls] = useState(["", "", ""]);
  const [sliderValue, setSliderValue] = useState({ min: 80, max: 144 });

  const formatTime = (value) => {
    const hours = Math.floor(value / 4);
    const minutes = (value % 4) * 15;
    const ampm = hours < 12 ? "am" : "pm";
    const formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    // Special case when the slider passes 12pm
    if (value === 144) {
        return `12pm+`;
    }

    // Special case when the slider passes 12
    if (hours >= 24) {
        if (hours === 24) {
          return `12:${minutes === 0 ? "00" : minutes}am`;
        }
        return `${hours - 24}:${minutes === 0 ? "00" : minutes}am`;
    }

    return `${formattedHours}:${minutes === 0 ? "00" : minutes}${ampm}`;
};  

  useEffect(() => {
    fetchPictureUrls();
  }, []);

  const fetchPictureUrls = async () => {
    try {
      const response = await backend.get("/profile/user-pictures", {
        params: {user_id: user_data.user_id},
        withCredentials: true,
      });
      if (response) {

        console.log(response);

        const data = response.data;

        setPictureUrls(data.pictureUrls)
      } else {
        throw new Error("Failed to fetch picture URLs");
      }
    } catch (error) {
      console.error("Error fetching picture URLs:", error);
    }
  };

  // Function to find the selected option_id for a given question_id
  const getSelectedOptionId = (questionId) => {
    const monthNumbers = {};

    for (let i = 1; i <= 12; i++) {
      const monthNumber = i.toString().padStart(2, '0');
      const monthIndex = 96 + i - 1;
      monthNumbers[monthNumber] = monthIndex;
    }

    if(questionId == 14){
      const moveIn = apartmentData ? apartmentData.move_in_date : null;
      if(moveIn != null && !editable){
        return apartmentData ? monthNumbers[moveIn.slice(5,7)] : null;
      }
    } else if(questionId == 15){
      const moveOut = apartmentData ? apartmentData.move_out_date : null;
      if(moveOut != null && !editable){
        return apartmentData ? monthNumbers[moveOut.slice(5,7)]+12 : null;
      }
    }

    if (Array.isArray(qnaAnswers)) {
      const answer = qnaAnswers.find(ans => ans.question_id === questionId);
      return answer ? answer.option_id : null;
    }
    return null;
  };

  const getSelectedTextField = (questionId) => {
    if(questionId == 16){
      return apartmentData ? apartmentData.rent : null;
    }
    return null;
  };

  const qnaItems = qnaData.map((item, index) => (
    <div key={item.id} className={`flex w-full pl-5 pr-5 border-b ${index !== qnaData.length - 1 ? 'mb-[0.1vh]' : ''} ${index === 0 ? 'mt-[0.25vh]' : ''} ${index === 3 ? 'mt-[0.25vh]' : ''} ${index===6 ? 'border-b-0' : ''} ${index===2 ? 'border-b-0' : ''}`} style={{ minHeight: '1vh' }}>
      <p className="flex-[1vh] flex items-center" style={{ lineHeight: '2' }}>{item.question}</p>
      {editable && item.isTextField ? (
        <input
          type="text"
          className="text-right"
          // write function below
          onChange={(event) => handleTextChange(event, item.id)}
        />
      ) : null}
      {editable && !item.isTextField ? (
        <select
          className={"text-right"}
          value={getSelectedOptionId(item.id) || ''}
          onChange={(event) => handleQnaChange(event, item.id)}
        >
          {item.options.map((option) => (
            <option key={option.option_id} value={option.option_id}>
              {option.text}
            </option>
          ))}
        </select>
      ) : ( null)}
      {(!editable && !item.isTextField) && <p className="truncate whitespace-nowrap">
          {item.options.find(o => o.option_id === getSelectedOptionId(item.id))?.text || 'N/A'}
        </p>}
      {(!editable && item.isTextField) && <p className="truncate whitespace-nowrap">
        {getSelectedTextField(item.id)}
      </p>}
    </div>
  ));         

  return (
    <>
      <div className={`m-auto w-[65vw] h-screen flex items-center justify-center font-profile font-bold text-maroon_new`}>
        <div className={"w-full flex flex-col  h-[70vh] mb-[6vh] bg-white rounded-3xl overflow-hidden"}>
          <div className={"flex h-[35vh] "}>
            <div className={"w-[18vw] h-[20vh] bg-white rounded-3xl mt-[4vh] ml-[3vh]"}>
              <Carousel pictureUrls={pictureUrls} editable={editable}></Carousel>
            </div>
            <div className={"flex-grow flex flex-col bg-white"}>
              <div className={"h-[3vh]"}>
              <p className={"text-[1.22vw] mt-[6vh] inline-block"}>
                <span className="font-bold ml-[1.3vw] text-[1.7vw]">{props.user_data.first_name} {props.user_data.last_name}:</span> {props.user_data.gender.charAt(0).toUpperCase() + props.user_data.gender.slice(1)}, {props.user_data.major} Major, {props.user_data.college.toUpperCase()} Class of {props.user_data.graduating_year}
              </p>
              </div>
              <div className={"flex-grow rounded-3xl w-[41.5vw] ml-[1.5vw] mt-[8vh] mb-[-0.48vh] border-2 border-maroon_new overflow"}>
                <p className={"w-full h-full"}>
                  {editable ? (
                            <textarea
                            className={`${styles.bioTextArea} ${editable ? 'w-full h-full' : ''}`}
                            value={props.editedBio || ''}
                              onChange={handleBioChange}
                              placeholder="Edit Bio"
                            />
                          ) : (
                            <p className={`${styles.bioTextArea}`}>{props.editedBio}</p>
                            )}
                </p>
              </div>
            </div>
          </div>
          <div className={`${dormMode === 0 ? "block" : "hidden"} flex flex-grow`}>
            <div className={"flex-1 flex-col h-[25vh] m-[5%] mt-[6vh] ml-[2vw] mb-[0%] rounded-3xl border-2 border-maroon_new overflow-hidden text-[2vh]"}>
              {qnaItems.slice(0,1)}
              {qnaItems.slice(4,7)}
            </div>
            <div className={"flex-1 flex-col flex h-[25vh] mt-[6vh] mr-[3vw] ml-0 mb-0 rounded-3xl border-2 overflow-hidden text-[2vh]"}>
              
            </div>
            <div className={"flex-1 m-[1vw] mx-0 mb-0 pt-[1vh] h-[25vh] mt-[6vh] mr-[2vw] rounded-3xl border-2 border-maroon_new text-[2vh]"}>
              <TopFive question={"My Top 5 Superheroes"} rankings={["Ironman", "Batman", "Spiderman", "Black Widow", "Captain America"]} editing={editable}></TopFive>
            </div>
          </div>
          <div className={`${dormMode === 1 || dormMode === 2 ? "block" : "hidden"} flex flex-grow`}>
            <div className={"flex-1 flex-col h-[25vh] m-[5%] mt-[6vh] ml-[2vw] mb-[0%] rounded-3xl border-2 border-maroon_new overflow-hidden text-[2vh]"}>
              {qnaItems.slice(0,1)}
              {qnaItems.slice(6,11)}
            </div>
            <div className={"flex-1 flex-col flex h-[25vh] mt-[6vh] mr-[3vw] ml-0 mb-0 rounded-3xl border-2 overflow-hidden text-[2vh]"}>
              {qnaItems.slice(11, 16)}
            </div>
            <div className={"flex-1 m-[1vw] mx-0 mb-0 pt-[1vh] h-[25vh] mt-[6vh] mr-[2vw] rounded-3xl border-2 border-maroon_new text-[2vh]"}>
              <TopFive question={"My Top 5 Superheroes"} rankings={["Ironman", "Batman", "Spiderman", "Black Widow", "Captain America"]} editing={editable}></TopFive>
            </div>
          </div>
          <div className="absolute bottom-[19vh] left-[13vw] w-[20%]">
          <span className="ml-[5vw]">Sleep Schedule</span>

            <InputRange
              draggableTrack
              maxValue={144}
              minValue={80}
              value={sliderValue}
              onChange={value => setSliderValue(value)}
              formatLabel={() => null}
              className={{
                slider: 'maroon',
                track: 'maroon',
                activeTrack: 'maroon',
                labelContainer: 'maroon',
              }}
              />
            <div className="flex justify-between">
              <span>{formatTime(sliderValue.min)}</span>
              <span>{formatTime(sliderValue.max)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}