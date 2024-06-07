import React, { useEffect } from "react";
import ApartmentTag from "./ApartmentTag.jsx";

export default function ApartmentInfo({qnaAnswers, apartmentData}) {
  useEffect(() => {
    console.log(qnaAnswers);
    console.log(apartmentData)
  }, []);

  return (
    <div className={"w-full h-full rounded-lg border-solid border-2 border-maroon text-xl font-roboto_slab font-medium"}>
      <div className={"flex w-full h-full justify-center items-center flex-col"}>
        {/*Top header panel with apt name*/}
        <div className={"flex grow-[1]"}>
          Looking to live in {qnaAnswers[13]}
        </div>
        {/*Middle info panel with apt info*/}
        <div className={"flex grow-[1] w-full justify-center items-center flex-col font-[350]"}>
          <div className={"flex w-full justify-center gap-[1vw]"}>
            <span><b>3</b> bed</span>
            <span><b>3</b> bath</span>
            <span><b>$500</b> budget</span>
          </div>
          <div className={"flex h-0 w-[95%] border-solid border-b-[1px] border-maroon"}></div>
          <div className={"flex w-full justify-center gap-[1vw]"}>
            <span><b>3</b> roommates</span>
            <span>September to May</span>
          </div>
        </div>
        {/*Bottom panel with tags*/}
        <div className={"flex w-full p-2 max-h-[80%] grow-[0] flex-wrap gap-1 overflow-y-scroll"} style={{
          WebkitOverflowScrolling: 'touch',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            width: '0'
          }
        }}>
          <ApartmentTag text="Gym" />
        </div>
      </div>
    </div>
  );
}