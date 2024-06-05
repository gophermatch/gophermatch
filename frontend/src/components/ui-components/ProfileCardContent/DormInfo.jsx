import React from "react";
import ApartmentTag from "./ApartmentTag.jsx";

export default function ApartmentInfo({qnaInfo}) {
  return (
    <div className={"w-full h-full rounded-lg border-solid border-2 border-maroon text-lg font-roboto_slab font-medium"}>
      <div className={"flex w-full h-full flex-col"}>
        {/*Top headers*/}
        <p className={"flex justify-between w-full"}>
          <span className={"ml-[1.5vw] mt-[1vh]"}>
            2-4 People
          </span>
          <span className={"inline-block text-right mr-[1.5vw] mt-[1vh]"}>
            Both Semesters
          </span>
        </p>
        <div className={"flex h-0 w-[95%] border-solid border-b-[1px] border-maroon"}></div>

        <span className={"text-xs grow-1 ml-[1vw] mt-[1vh]"}>Top 5 Dorms</span>

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
          <p className={"flex justify-between w-full"}>
            <span className={"rounded-lg m-0 px-3 w-[5%] h-[25px] flex items-center justify-center border-solid border-2 border-maroon text-xs text-white bg-maroon"}>
              1.
            </span>
            <span className={"rounded-lg m-0 px-3 w-[92%] h-[25px] flex items-center border-solid border-2 border-maroon text-xs text-white bg-maroon"}>
              Pioneer
            </span>
          </p>
          <p className={"flex justify-between w-full"}>
            <span className={"rounded-lg m-0 px-3 w-[5%] h-[25px] flex items-center justify-center border-solid border-2 border-maroon text-xs text-white bg-maroon"}>
              2.
            </span>
            <span className={"rounded-lg m-0 px-3 w-[92%] h-[25px] flex items-center border-solid border-2 border-maroon text-xs text-white bg-maroon"}>
              17th Avenue
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}