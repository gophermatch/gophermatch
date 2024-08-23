import React, { useState } from 'react';
import ApartmentTag from "./ApartmentTag.jsx";

export default function EditPoll({ pollData }) {
  const [question, setQuestion] = useState(pollData.question);
  const [answersState, setAnswersState] = useState(pollData.answers);

  function changeQuestion(newQuestion) {
    setQuestion(newQuestion);
    pollData.question = newQuestion;
    console.log(pollData);
  }

  function changeAnswer(index, newAnswer) {
    const updatedAnswers = answersState.map((answer, i) =>
      i === index ? { ...answer, answer: newAnswer, votes: 0 } : answer
    );
    setAnswersState(updatedAnswers);
    pollData.answers = updatedAnswers;
    console.log(pollData);
  }

  function removeAnswer(index) {
    const updatedAnswers = [
      ...answersState.slice(0, index),
      ...answersState.slice(index + 1)
    ];
    setAnswersState(updatedAnswers);
    pollData.answers = updatedAnswers;
    console.log(pollData);
  }

  function addAnswer() {
    const newAnswer = { answer: "New answer", votes: 0 };
    setAnswersState([...answersState, newAnswer]);
    pollData.answers = [...answersState, newAnswer];
    console.log(pollData);
  }

  return (
    <div className="w-full h-full rounded-lg border-solid border-2 border-maroon text-lg font-roboto_slab font-medium">
      <div className="flex w-full h-full flex-col">
        {/*Top headers*/}
        <p className="flex justify-center w-full">
          <span>Q: </span>
          <input
            id="questionInput"
            className="text-center"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={() => changeQuestion(question)}>✅</button>
        </p>
        <div className="flex h-0 w-[100%] border-solid border-b-[1px] border-maroon"></div>

        {/*Bottom panel with tags*/}
        <div className="flex w-full p-2 max-h-[80%] grow-[0] flex-col gap-1 overflow-y-scroll" style={{
          WebkitOverflowScrolling: 'touch',
          '&::WebkitScrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',

          '&::WebkitScrollbar': {
            width: '0'
          }
        }}>
          {answersState.map((newAnswer, index) => (
            <p key={index} className="flex justify-center w-full mt-[1vh]">
              <span className="rounded-lg px-3 w-[20%] h-[33px] mr-1 flex items-center justify-center border-solid border-2 border-maroon text-xs text-white bg-maroon">
                A{index + 1}:
              </span>
              <input
                id={index + 100}
                className="text-center border-2 rounded-lg"
                value={newAnswer.answer}
                onChange={(e) => changeAnswer(index, e.target.value)}
              />
              <button onClick={() => changeAnswer(index, newAnswer.answer)}>✅</button>
              <button onClick={() => removeAnswer(index)}>➖</button>
            </p>
          ))}
          {answersState.length < 4 && <button onClick={addAnswer}>➕</button>}
        </div>
      </div>
    </div>
  );
}
