import { useState, useEffect } from "react";

const TEMP_DATA = {
    type: "dorm",
    // top5Dorms: ["Comstock", "Middlebrook", "Territorial", "Centennial", "17th"],
    top5Dorms: ["Comstock"],
    numPeople: {min: 2, max: 4},
    semesters: "Both Semesters",
}

export default function Top5Dorms({top5Dorms, setTop5Dorms}) {
    const [holdPos, setHoldPos] = useState(null);
    const mousePos = useMousePosition();

    const offset = holdPos ? mousePos.y - holdPos.y : undefined;
    console.log(offset && offset || "none");

    return (
        <div className="flex flex-col border-2 border-solid border-maroon_new rounded-md w-full h-full p-[5px]">
            <div className="basis-[30px] flex">
                <p>{TEMP_DATA.numPeople.min}-{TEMP_DATA.numPeople.max} People</p>
                <p className="ml-auto">{TEMP_DATA.semesters}</p>
            </div>
            <hr className="border-t-1 bordet-top-solid border-maroon_new"></hr>
            <div className="flex-1 overflow-auto">
                <p className="text-sm">Top 5 Dorms</p>
                <div className="flex flex-col gap-[5px] relative">
                    {TEMP_DATA.top5Dorms.map((dorm) => (
                        <div
                            // className="bg-maroon h-[30px] leading-[30px] pl-[5px] rounded-md text-white"
                            className={`bg-maroon leading-[30px] pl-[5px] rounded-md text-white absolute`}
                            style={{ top: offset ? `${offset}px` : "0" }}
                            onMouseDown={() => setHoldPos(mousePos)}
                            onMouseUp={() => setHoldPos(null)}
                            onMouseLeave={() => setHoldPos(null)}
                        >
                            {dorm}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}


const useMousePosition = () => {
    const [
      mousePosition,
      setMousePosition
    ] = useState({ x: null, y: null });
    useEffect(() => {
      const updateMousePosition = ev => {
        setMousePosition({ x: ev.clientX, y: ev.clientY });
      };
      window.addEventListener('mousemove', updateMousePosition);
      return () => {
        window.removeEventListener('mousemove', updateMousePosition);
      };
    }, []);
    return mousePosition;
};
