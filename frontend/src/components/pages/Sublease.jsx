import { useState } from "react";

export default function Sublease()
{
  const [subleases, setSubleases] = useState([]);

  return(
    <div className="h-screen w-screen bg-offwhite flex justify-center items-center">
      <div className={"flex flex-col height-[10vh] m-auto width-[70vh] bg-maroon_new"}>
        <button className={"width-[100%]"}>Create a sublease</button>
      </div>
    </div>
  )
}