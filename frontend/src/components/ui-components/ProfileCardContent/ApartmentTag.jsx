import React from "react";

export default function ApartmentTag({value, text, id, editing, toggleFunction}) {
  return (
    <div>
    {value || editing ? (<div className={`rounded-full m-0 px-3 h-[25px] flex items-center justify-center border-solid border-2 text-xs text-white ${value ? "border-maroon bg-maroon" : "bg-inactive_gray border-inactive_gray"}`}>
      {text}
    </div>) : null}
    </div>
  );
}