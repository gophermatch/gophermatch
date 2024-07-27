import React, { useEffect, useState } from "react";
import ApartmentTag from "./ApartmentTag.jsx";

export default function ApartmentInfo(aptData, editing) {
  useEffect(() => {
    console.log(aptData);
  }, []);

  const testTags = [
    { id: 1, name: 'Gym' },
    { id: 2, name: 'Pet' },
    { id: 3, name: 'Public Transport' },
    { id: 4, name: 'Pool' },
    { id: 5, name: 'Balcony' },
  ];

  const [testTagValues, setTestTagValues] = useState([
    { id: 1, value: true },
    { id: 2, value: true },
    { id: 3, value: true },
    { id: 4, value: true },
    { id: 5, value: false },
  ]);

  const onToggleTag = (id) => {
    setTestTagValues(prevValues =>
      prevValues.map(tag =>
        tag.id === id ? { ...tag, value: !tag.value } : tag
      )
    );
  }

  return (
    <div className={"w-full h-full rounded-lg border-solid border-2 border-maroon text-xl font-roboto_slab font-medium"}>
      <div className={"flex w-full h-full justify-center items-center flex-col"}>
        {/*Top header panel with apt name*/}
        <div className={"flex grow-[1]"}>
          Looking to live in Fieldhouse
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
        <div className={"flex w-[98%] p-2 max-h-[80%] grow-[0] flex-wrap gap-1 overflow-y-scroll custom-scrollbar"}>
          {testTags.map(tag => <ApartmentTag value = {testTagValues.find(t => t.id == tag.id).value} id={tag.id} text={tag.name} editing={true} toggleFunction={onToggleTag} />)}
        </div>
      </div>
    </div>
  );
}
