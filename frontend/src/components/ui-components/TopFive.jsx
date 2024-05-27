import React from "react";
import styles from "../../assets/css/profile.module.css";

//props: rankings: string[], question: string, editing: boolean, update: () => (), question: () => (), updateQuestion: () => ()
function TopFive(props){
  const slots = ['', '', '', '', '']
  props.rankings.forEach((ranking, index) => slots[index] = ranking)
  return (<div className={"flex-col w-full pl-[2.5vw] pr-[2.5vw]"}>
    {props.editing ? (
      <textarea
        className="flex h-[4vh] resize-none"
        value={props.question}
        onChange={(e) => {
          props.updateQuestion(e.target.value)
        }}
      />
    ) : (
      <p className={"flex-1"}>{props.question}</p>
    )}
    <p className={"truncate"}>
      {slots.map((item, index) => (
        props.editing ? (
            <textarea
              className={"flex h-[3.5vh] resize-none border"}
              value={item || ''}
              onChange={(e) => {
                props.update((prev) => {
                  const newTop5 = [...prev]
                  newTop5[index] = e.target.value
                  return newTop5
                })
              }}
            />
          ) : (
            <p className={"flex h-[3.5vh]"}>{index+1}. {item}</p>
          )
      ))}
    </p>
  </div>);
}

export default TopFive;