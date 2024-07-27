import React, { useState, useEffect } from 'react';
import ApartmentTag from "./ApartmentTag.jsx";

export default function Poll({pollData, revealAnswers}) {
    const [answerRevealed, setAnswerRevealed] = useState(revealAnswers);
    let [answersState, setAnswersState] = useState(pollData.answers);

    let voteTotal = 0;
    for (let i = 0; i < pollData.answers.length; i++){
        voteTotal = voteTotal + pollData.answers[i].votes;
    }
    function displayResults(index){
        /*backend should be linked here to add a vote */
        pollData.answers[index].votes++;
        voteTotal++;
        setAnswerRevealed(prev => !prev);
        setAnswersState(pollData.answers);
    }
  return (
    <div className={"w-full h-full rounded-lg border-solid border-2 border-maroon text-lg font-roboto_slab font-medium"}>
      <div className={"flex w-full h-full flex-col"}>
        {/*Top headers*/}
        <p className={"flex justify-center w-full"}>
          <span className={"text-center"}>
            {pollData.question}
          </span>
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
        {answerRevealed ? 
        answersState.map((newAnswer, index) =>
          <p className={"flex justify-center w-full mt-[1vh]"}>
            <div className={"rounded-lg w-[97%] h-[33px] relative border-maroon text-xs text-white bg-maroon"}>
                <div style= {{ width: `${(answersState[index].votes/voteTotal*100)}%`}} className={`bg-dark_maroon rounded-lg flex h-[100%]`}></div>
                <div className={"absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"}>
                    {newAnswer.answer}
                </div>
                <div className = {"absolute left-[92.5%] top-[50%] translate-x-[-50%] translate-y-[-50%]"}>
                    {(newAnswer.votes/voteTotal*100).toFixed(1)}%
                </div>
            </div>
          </p>  
        )
        :
        answersState.map((newAnswer, index) =>
        <p className={"flex justify-center w-full mt-[1vh]"}>
          <button className={"rounded-lg px-3 w-[97%] h-[33px] flex items-center justify-center border-solid border-2 border-maroon text-xs text-white bg-maroon"} onClick={() => displayResults(index)}>
            {newAnswer.answer}
          </button>
        </p>)  }
        </div>
      </div>
    </div>
  );
}   