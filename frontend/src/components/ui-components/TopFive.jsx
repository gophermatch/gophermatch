import React from "react";
import styles from "../../assets/css/profile.module.css";

function TopFive(props){

  return (<div className={"flex-col w-full pl-5 pr-5"}>
    <p className={"flex-1"}>{props.question}</p>
    <p className={"truncate"}>
      {props.rankings.map((item, index) => (
        props.editing ? (
            <textarea
              className={"inline-block flex h-[2rem] resize-none border"}
              value={item || ''}
              onChange={null}
            />
          ) : (
            <p className={"inline-block flex h-[2rem]"}>{index+1}. {item}</p>
          )
      ))}
    </p>
  </div>);
}

export default TopFive;