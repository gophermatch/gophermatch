import React, { useEffect, useState } from "react";
import Carousel from './Carousel';
import styles from '../../assets/css/profile.module.css';
import kanye from '../../assets/images/kanye.png';
import other from '../../assets/images/testprofile.png';
import TopFive from "./TopFive.jsx";
import qnaData from "./qnaOptions.json";
import currentUser from "../../currentUser.js";
import backend from "../../backend.js";

export default function Profile(props) {

  const { profile_data, user_data, editable, handleBioChange, handleQnaChange, qnaAnswers } = props;
  let pictures = [kanye, other, kanye];
  const [pictureUrls, setPictureUrls] = useState(["", "", ""]);

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
    if (Array.isArray(qnaAnswers)) {
      const answer = qnaAnswers.find(ans => ans.question_id === questionId);
      return answer ? answer.option_id : null;
    }
    return null;
  };

  const qnaItems = qnaData.map((item, index) => (
    <div key={item.id} className={`flex w-full pl-5 pr-5 border-b ${index !== qnaData.length - 1 ? 'mb-2' : ''} ${index === 0 ? 'mt-3' : ''}`} style={{ minHeight: '1rem' }}>
      <p className="flex-1 flex items-center" style={{ lineHeight: '2' }}>{item.question}</p>
      {editable ? (
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
      ) : (
        <p className="truncate whitespace-nowrap">
          {item.options.find(o => o.option_id === getSelectedOptionId(item.id))?.text || 'N/A'}
        </p>
      )}
    </div>
  ));         

  return (
      <div className={"m-auto w-[65vw] h-screen flex items-center justify-center font-profile font-bold text-maroon_new"}>
        <div className={"m-auto w-full flex flex-col p-[1.5vw] h-[75vh] bg-white rounded-3xl overflow-hidden"}>
          <div className={"flex h-[27.25vh] "}>
            <div className={"w-[12vw] bg-white rounded-3xl mt-[1vh]"}>
              <Carousel pictureUrls={pictureUrls} editable={editable}></Carousel>
            </div>
            <div className={"flex-grow flex flex-col bg-white"}>
              <div className={"pl-10 h-10"}>
                <p className={"text-[1.33vw] inline-block"}>{props.user_data.first_name} {props.user_data.last_name}, {props.user_data.gender.charAt(0).toUpperCase() + props.user_data.gender.slice(1)}, {props.user_data.major} Major, {props.user_data.college.toUpperCase()} Class of {props.user_data.graduating_year}</p>
              </div>
              <div className={"flex-grow ml-5 px-5 py-3 rounded-3xl border-2 border-maroon_new overflow"}>
                <p className={"w-full"}>
                  {editable ? (
                            <textarea
                              className={styles.bioTextArea}
                              value={props.editedBio || ''}
                              onChange={handleBioChange}
                            />
                          ) : (
                            <p>{props.editedBio}</p>
                          )}
                </p>
              </div>
            </div>
          </div>
          <div className={"flex flex-grow"}>
            <div className={"flex-1 flex-col m-[5%] ml-0 mb-[0%] rounded-3xl border-2 border-maroon_new overflow-hidden text-[1.2vw]"}>
              {qnaItems.slice(0,7)}
            </div>
            <div className={"flex-1 flex-col flex m-[5%] ml-0 mb-0 rounded-3xl border-2 border-maroon_new overflow-hidden truncate text-[1.2vw]"}>
              {qnaItems.slice(8,15)}
            </div>
            <div className={"flex-1 m-[5%] mx-0 mb-0 pt-[1vh] rounded-3xl border-2 border-maroon_new text-[1.2vw]"}>
              <TopFive question={"My Top 5 Superheroes"} rankings={["Ironman", "Batman", "Spiderman", "Black Widow", "Captain America"]} editing={editable}></TopFive>
            </div>
          </div>
        </div>
      </div>
  );
}