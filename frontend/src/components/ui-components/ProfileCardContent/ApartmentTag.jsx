import React from "react";

export default function ApartmentTag({text}) {
  return (
    <div className={"rounded-full m-0 px-3 h-[30px] flex items-center justify-center border-solid border-2 border-maroon text-sm text-white bg-maroon"}>
      {text}
    </div>
  );
}