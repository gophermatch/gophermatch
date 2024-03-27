import React from 'react';
import Carousel from './Carousel';
import styles from '../../assets/css/profile.module.css';
import kanye from '../../assets/images/kanye.png';
import other from '../../assets/images/testprofile.png';
import TopFive from "./TopFive.jsx";
import qnaData from "./qnaOptions.json";

export default function Profile(props) {

  const { profile_data, user_data, editable, handleBioChange, handleQnaChange, qnaAnswers } = props;
  let pictures = [kanye, other, kanye];

  // Function to find the selected option_id for a given question_id
  const getSelectedOptionId = (questionId) => {
    if (Array.isArray(qnaAnswers)) {
      const answer = qnaAnswers.find(ans => ans.question_id === questionId);
      return answer ? answer.option_id : null;
    }
    return null;
  };

  const qnaItems = qnaData.map((item) => (
    <div key={item.id} className={"flex w-full pl-5 pr-5 border-b"}>
      <p className={"flex-1"}>{item.question}</p>
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
        <p className={"truncate"}>
          {item.options.find(o => o.option_id === getSelectedOptionId(item.id))?.text || 'N/A'}
        </p>
      )}
    </div>
  ));

  return (
      <div className={"m-auto w-[60vw] h-screen flex items-center justify-center font-profile font-bold text-maroon_new"}>
        <div className={"m-auto w-full flex flex-col p-8 h-2/3 bg-white rounded-3xl overflow-hidden"}>
          <div className={"flex h-[12vw]"}>
            <div className={"w-[12vw] bg-white rounded-3xl border-4 border-maroon_new"}>
              <Carousel pictures={pictures} editable={editable}></Carousel>
            </div>
            <div className={"flex-grow flex flex-col bg-white"}>
              <div className={"pl-10 h-10 text-2xl"}>
                <p className={"text-lg inline-block"}>{props.user_data.first_name} {props.user_data.last_name}, {props.user_data.gender.charAt(0).toUpperCase() + props.user_data.gender.slice(1)}, {props.user_data.major} Major, {props.user_data.college.toUpperCase()} Class of {props.user_data.graduating_year}</p>
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
            <div className={"flex-1 flex-col m-[5%] ml-0 mb-[0%] rounded-3xl border-2 border-maroon_new overflow-hidden"}>
              {qnaItems.slice(0,7)}
            </div>
            <div className={"flex-1 flex-col flex m-[5%] ml-0 mb-0 rounded-3xl border-2 border-maroon_new overflow-hidden truncate"}>
              {qnaItems.slice(8,15)}
            </div>
            <div className={"flex-1 m-[5%] mx-0 mb-0 pt-[0.75rem] rounded-3xl border-2 border-maroon_new"}>
              <TopFive question={"My Top 5 Superheroes"} rankings={["Ironman", "Batman", "Spiderman", "Black Widow", "Captain America"]} editing={editable}></TopFive>
            </div>
          </div>
        </div>
      </div>
  );
}