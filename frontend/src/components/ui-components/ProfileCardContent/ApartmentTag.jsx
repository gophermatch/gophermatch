import React from "react";

export default function ApartmentTag({value, text, id, editing, toggleFunction}) {
  return (
    <div>
    {value || editing ? (
    editing ? (<button onClick={() => {toggleFunction(id)}} className={`rounded-full m-0 px-3 h-[25px] flex items-center justify-center border-solid border-2 text-xs text-white ${value ? "border-maroon bg-maroon hover:border-dark_maroon hover:bg-dark_maroon" : "bg-inactive_gray border-inactive_gray hover:bg-dark_inactive_gray hover:border-dark_inactive_gray"} active:border-white`}>
      {text}
    </button>) 
    : <div className={`rounded-full m-0 px-3 h-[25px] flex items-center justify-center border-solid border-2 text-xs text-white ${value ? "border-maroon bg-maroon" : "bg-inactive_gray border-inactive_gray"}`}>
      {text}
    </div>
    ) : null}
    </div>
  );
}