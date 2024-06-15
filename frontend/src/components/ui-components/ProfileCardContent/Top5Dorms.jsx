import { useState, useEffect } from "react";

const TEMP_DATA = {
    type: "dorm",
    top5Dorms: ["Comstock", "Middlebrook", "Territorial", "Centennial", "17th"],
    // top5Dorms: ["Comstock"],
    numPeople: {min: 2, max: 4},
    semesters: "Both Semesters",
}

export default function Top5Dorms({top5Dorms, setTop5Dorms}) {
    const [holdPos, setHoldPos] = useState(null);
    const [holdBase, setHoldBase] = useState(null)
    const [heldDorm, setHeldDorm] = useState('');
    const mousePos = useMousePosition();

    const offset = holdPos ? mousePos.y - holdPos.y : undefined;
    
    useEffect(() => {
        if (!holdPos) {
            return
        }
        const dormIndex = TEMP_DATA.top5Dorms.findIndex(dorm => dorm === heldDorm);

        if (offset < -35 && dormIndex > 0) { // raised up a position
            [TEMP_DATA.top5Dorms[dormIndex], TEMP_DATA.top5Dorms[dormIndex - 1]] = [TEMP_DATA.top5Dorms[dormIndex - 1], TEMP_DATA.top5Dorms[dormIndex]];
            setHoldBase(v => v + offset)
            setHoldPos(mousePos)
            console.log("Passed up")
        }

        if (offset > 35 && dormIndex < TEMP_DATA.top5Dorms.length - 1) { // lowered down a position
            [TEMP_DATA.top5Dorms[dormIndex], TEMP_DATA.top5Dorms[dormIndex + 1]] = [TEMP_DATA.top5Dorms[dormIndex + 1], TEMP_DATA.top5Dorms[dormIndex]];
            setHoldBase(v => v - offset)
            setHoldPos(mousePos)
            console.log("Passed down")
        }
    }, [mousePos]);


    return (
        <div className="flex flex-col border-2 border-solid border-maroon_new rounded-md w-full h-full p-[5px]">
            <div className="basis-[30px] flex">
                <p>{TEMP_DATA.numPeople.min}-{TEMP_DATA.numPeople.max} People</p>
                <p className="ml-auto">{TEMP_DATA.semesters}</p>
            </div>
            <hr className="border-t-1 bordet-top-solid border-maroon_new"></hr>
            <div className="flex-1 overflow-auto">
                <p className="text-sm">Top 5 Dorms</p>
                <div className="relative">
                    {TEMP_DATA.top5Dorms.map((dorm, i) => {
                        const isHeld = heldDorm === dorm;
                        const basePosition = 35 * i;
                        return (
                            <div
                                className={`bg-maroon leading-[30px] pl-[5px] rounded-md text-white select-none absolute`}
                                style={{
                                    // top: `${35*i + (offset && heldDorm === dorm ? offset : 0)}px`,
                                    top: isHeld ? holdBase + offset : basePosition,
                                    zIndex: heldDorm === dorm ? 1 : 0,
                                }}
                                onMouseDown={() => {setHoldPos(mousePos); setHoldBase(basePosition); setHeldDorm(dorm);}}
                                onMouseUp={() => {setHoldPos(null); setHoldBase(null); setHeldDorm('');}}
                                onMouseLeave={() => {setHoldPos(null); setHoldBase(null); setHeldDorm('');}}
                            >
                                {dorm}
                            </div>
                        )
                    })}
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
