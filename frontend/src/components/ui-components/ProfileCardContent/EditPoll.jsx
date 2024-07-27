import React, { useState, useEffect } from 'react';
import ApartmentTag from "./ApartmentTag.jsx";

export default function EditPoll({pollData}) {
  let [answersState, setAnswersState] = useState(pollData.answers);
  function changeQuestion(newQuestion){
    pollData.question = newQuestion;
    console.log(pollData);
  }
  function changeAnswer(index, newAnswer){
    pollData.answers[index].answer = newAnswer;
    pollData.answers[index].votes = 0;
    console.log(pollData);
  }
  function removeAnswer(oldAnswer) {
    const desiredIndex = pollData.answers.indexOf(oldAnswer);
    if (desiredIndex !== -1) {
        pollData.answers = [
            ...pollData.answers.slice(0, desiredIndex),
            ...pollData.answers.slice(desiredIndex + 1)
        ];
    }
    setAnswersState(pollData.answers);
    console.log(pollData);
  }
  function addAnswer() {
    pollData.answers = [
      ...pollData.answers,
      { answer: "New answer", votes: 0 }
    ];
    setAnswersState(pollData.answers);
    console.log(pollData);
  }
  return (
    <div className={"w-full h-full rounded-lg border-solid border-2 border-maroon text-lg font-roboto_slab font-medium"}>
      <div className={"flex w-full h-full flex-col"}>
        {/*Top headers*/}
        <p className={"flex justify-center w-full"}>
          <span>Q:  </span>
          <input id="questionInput" className={"text-center"} value = {pollData.question}>
            
          </input>
          <button onClick={() => changeQuestion(document.getElementById("questionInput").value)}>✅</button>
        </p>
        <div className={"flex h-0 w-[100%] border-solid border-b-[1px] border-maroon"}></div>

        {/*Bottom panel with tags*/}
        <div className={"flex w-full p-2 max-h-[80%] grow-[0] flex-col gap-1 overflow-y-scroll"} style={{
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',

          '&::-webkit-scrollbar': {
            width: '0'
          }
        }}>
        {
        answersState.map((newAnswer, index) =>
          <p className={"flex justify-center w-full mt-[1vh]"}>
            <span className={"rounded-lg px-3 w-[20%] h-[33px] mr-1 flex items-center justify-center border-solid border-2 border-maroon text-xs text-white bg-maroon"}>
              A{index+1}:
            </span>
            <input id={index+100} className={"text-center border-2 rounded-lg"} value={newAnswer.answer}>
            
            </input>
            <button onClick={() => changeAnswer(index, document.getElementById(index+100).value)}>✅</button>
            <button onClick={() => removeAnswer(newAnswer)}>➖</button>
          </p>  
        )}
        {answersState.length < 4 && <button onClick={() => addAnswer()}>➕</button>}
        </div>
      </div>
    </div>
  );
}   