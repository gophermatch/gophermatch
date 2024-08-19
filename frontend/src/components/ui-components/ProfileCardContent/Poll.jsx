import React, { useState, useEffect } from 'react';
import backend from "../../../backend";
import ApartmentTag from "./ApartmentTag.jsx";
import closeImg from "../../../assets/images/close.svg"

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

  function votePercent(votes) {
    if (voteTotal === 0) {
      return 0;
    }
    return Math.round((votes / voteTotal) * 100);
  }

  function displayResults(){
      /*backend should be linked here to add a vote */
      setVoteTotal(voteTotal+1);
      setAnswerRevealed(true);
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
          <span className={"text-center p-2"}>
            {broadcaster ?
              <input
                id="Question"
                className="text-center rounded-lg bg-offwhite"
                value={pollData.question}
                onChange={(e) => changeQuestion(e.target.value)}
              />
            : pollData.question}
          </span>
        </p>
        <div className={"flex h-0 border-solid border-b-[1px] mx-2 border-maroon"}></div>

        {/*Bottom panel with tags*/}
        <div className={"flex w-full p-2 max-h-[80%] grow-[0] flex-col gap-2 overflow-y-scroll text-white text-xs"} style={{
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',

          '&::-webkit-scrollbar': {
            width: '0'
          }
        }}>
          {pollData.answers.map((answer, index) => (
            <div key={index} className="relative w-full h-[38px] rounded-lg flex flex-col justify-center align-middle bg-maroon">
              {broadcaster ?
                <>
                <input
                  id={"Answer" + index}
                  className="text-center rounded-lg mx-auto h-full my-2 bg-dark_maroon"
                  value={answer.answer}
                  onChange={(e) => changeAnswer(index, e.target.value)}
                />
                <button onClick={() => removeAnswer(index)} className="absolute right-3">
                  <img src={closeImg} />
                </button>
                </>
                :
                <>
                <p className="text-center z-10">{answer.answer}</p>
                {answerRevealed ?
                  <>
                  <div className={`absolute rounded-lg ${`w-[${votePercent(answer.votes)}%]`} h-full left-0 bg-dark_maroon`} />
                  <p className="absolute right-2">{votePercent(answer.votes)}%</p>
                  </>
                  :
                  <button className="absolute w-full h-full z-20" onClick={displayResults} />
                }
                </>
              }
            </div>
          ))}
          {broadcaster && pollData.answers.length < 4 && (
            <div className="flex justify-center">
              <button onClick={addAnswer} className="px-4 py-1 rounded-lg text-sm bg-maroon">
                Add option
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
