import React from "react";

function TopFive(props){

  return (<div className={"flex-col w-full pl-5 pr-5"}>
    <p className={"flex-1"}>{props.question}</p>
    <p className={"truncate"}>
      {props.rankings.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </p>
  </div>);
}

export default TopFive;