import React, { useState, useEffect } from 'react';
import backend from "../../../backend";
import ApartmentTag from "./ApartmentTag.jsx";

export default function Poll({revealAnswers, user_id, broadcaster}) {
  const defaultPollData = {
    question: "Question Here",
    answers: [
      { answer: "Option A", votes: 0 },
      { answer: "Option B", votes: 0 },
      { answer: "Option C", votes: 0 },
      { answer: "Option D", votes: 0 },
    ],
  };

  const [pollData, setPollData] = useState(defaultPollData);
  const [answerRevealed, setAnswerRevealed] = useState(revealAnswers);
  const [voteTotal, setVoteTotal] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const pollOps = await backend.get('/profile/poll-options', {
          params: {
            user_id: user_id
          }
        });

        const pollQs = await backend.get('/profile/poll-questions', {
          params: {
            user_id: user_id
          }
        });

        if (pollOps.data.length >= 2 && pollQs.data) {
          const options = pollOps.data.map(option => ({
            answer: option.option_text,
            votes: option.num_votes
          }));

          setPollData({
            answers: options
          });
        }

        if (pollQs.data){
          setPollData(prevPollData => ({
            ...prevPollData,
            question: pollQs.data[0]?.question_text
          }));
        }
      } catch (error) {
        console.error('Error fetching poll data:', error);
      }
    }

    fetchData();
    
    for (let i = 0; i < pollData.answers.length; i++){
      setVoteTotal(voteTotal + pollData.answers[i].votes);
    }

  }, [user_id], pollData);

  function displayResults(index){
      /*backend should be linked here to add a vote */
      setVoteTotal(voteTotal+1);
      setAnswerRevealed(prev => !prev);
  }

  const changeAnswer = (answerIndex, newAnswerText) => {
    setPollData(prevPollData => ({
      ...prevPollData,
      answers: prevPollData.answers.map((answer, index) => 
        index === answerIndex 
          ? { ...answer, answer: newAnswerText }
          : answer
      )
    }));
  };

  const changeQuestion = (newQuestion) => {
    setPollData(prevPollData => ({
      ...prevPollData,
      question: newQuestion 
    }));
  };

  const removeAnswer = (answerIndex) => {
    setPollData(prevPollData => ({
      ...prevPollData,
      answers: prevPollData.answers.filter((_, index) => index !== answerIndex)
    }));
  };

  const addAnswer = () => {
    const newAnswer = { answer: "New Option", votes: 0 };
    setPollData(prevPollData => ({
      ...prevPollData,
      answers: [...prevPollData.answers, newAnswer]
    }));
  };

  useEffect(() => {
    // add backend post request for poll here
    if (broadcaster) {
        const cb = () =>
          backend.put('/profile/poll-question', {
            user_id: user_id,
            question_text: pollData.question
          });

        broadcaster.connect(cb)
        return () => broadcaster.disconnect(cb)
    }
}, [broadcaster, pollData])

  return (
    <div className={"w-full h-full rounded-lg border-solid border-2 border-maroon text-lg font-roboto_slab font-medium"}>
      <div className={"flex w-full h-full flex-col"}>
        {/*Top headers*/}
        <p className={"flex justify-center w-full"}>
          <span className={"text-center"}>
            {broadcaster ? 
              <input
                id="Question"
                className="text-center border-2 rounded-lg text-black"
                value={pollData.question}
                onChange={(e) => changeQuestion(e.target.value)}
              /> 
            : pollData.question}
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
            <>
            {pollData.answers.map((newAnswer, index) => (
              <p key={index} className={"flex justify-center w-full mt-[1vh]"}>
                <div className={"rounded-lg w-[97%] h-[33px] relative border-maroon text-xs text-white bg-maroon"}>
                  {!broadcaster && <div style={{ width: `${(pollData.answers[index].votes / voteTotal * 100)}%` }} className={`bg-dark_maroon rounded-lg flex h-[100%]`}/>}
                  <div className={"absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]"}>
                    {broadcaster ? 
                      <input
                        id={"Answer" + index}
                        className="text-center border-2 rounded-lg text-black"
                        value={newAnswer.answer}
                        onChange={(e) => changeAnswer(index, e.target.value)}
                      /> 
                      : newAnswer.answer}
                  </div>
                  <div className={"absolute left-[92.5%] top-[50%] translate-x-[-50%] translate-y-[-50%]"}>
                    {broadcaster ? 
                      <>
                        {pollData.answers.length > 2 && <button onClick={() => removeAnswer(index)}>
                          X
                        </button> } 
                      </>
                      : 
                      <>
                      {voteTotal > 0 ? `${(newAnswer.votes / voteTotal * 100).toFixed(1)}%` : "0%"}
                      </>
                    }
                  </div>
                </div>
              </p>
            ))}
              {(broadcaster && pollData.answers.length < 4) && (
                <div className="flex justify-center w-full mt-[1vh]">
                  <button onClick={addAnswer}>
                    ➕
                  </button>
                </div>
              )}
          </>
          :
            pollData.answers.map((newAnswer, index) => (
              <p key={index} className={"flex justify-center w-full mt-[1vh]"}>
                <button className={"rounded-lg px-3 w-[97%] h-[33px] flex items-center justify-center border-solid border-2 border-maroon text-xs text-white bg-maroon"} onClick={() => displayResults(index)}>
                  {newAnswer.answer}
                </button>
              </p>
            ))
          }
        </div>
      </div>
    </div>
  );
}   