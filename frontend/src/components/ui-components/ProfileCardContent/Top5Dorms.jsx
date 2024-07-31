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

    const [minPeople, setMinPeople] = useState(TEMP_DATA.numPeople.min);
    const [maxPeople, setMaxPeople] = useState(TEMP_DATA.numPeople.max);

    const [semesters, setSemesters] = useState(TEMP_DATA.semesters);

    function handleChangePeople(value, stateDispatch) {
        const digit = value.slice(-1)
        if (!isNaN(digit)) {
            stateDispatch(digit)
        }
    }

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
            setHoldBase(v => v + offset)
            setHoldPos(mousePos)
            console.log("Passed down")
        }
    }, [mousePos]);


    return (
        <div className="flex flex-col border-2 border-solid border-maroon_new rounded-md w-full h-full p-[5px] font-roboto_slab">
            <div className="basis-[30px] flex">
                <div>
                    <input type="text" value={minPeople} onChange={e => handleChangePeople(e.target.value, setMinPeople)} className="ml-[10px] w-[15px] bg-offwhite inline-block" on />
                    <div className="inline-block">-</div>
                    <input type="text" value={maxPeople} onChange={e => handleChangePeople(e.target.value, setMaxPeople)} className="w-[15px] bg-offwhite inline-block" />
                    <div className="inline-block">People</div>
                </div>
                <div className="ml-auto w-[200px] text-right">{semesters}</div>
                <button className="ml-[10px] bg-maroon text-white px-1 h-[20px] rounded-xl" onClick={() => setSemesters(semesters === "Both Semesters" ? "1 Semester" : "Both Semesters")}>^</button>
            </div>
            <hr className="border-t-1 bordet-top-solid border-maroon_new"></hr>
            <div className="flex-1 overflow-auto">
                <p className="text-sm">Top 5 Dorms</p>
                <div className="relative">
                    {TEMP_DATA.top5Dorms.map((dorm, i) => {
                        const isHeld = heldDorm === dorm;
                        const basePosition = 35 * i;
                        return (
                            <div // would have liked to keep the numbers in here but didn't work easily with keys
                                key={dorm}
                                className={`bg-maroon w-[calc(100%-30px)] leading-[30px] pl-[5px] rounded-md text-white select-none absolute ${!isHeld && 'transition-all'}`}
                                style={{
                                    // top: `${35*i + (offset && heldDorm === dorm ? offset : 0)}px`,
                                    top: isHeld ? holdBase + offset : basePosition,
                                    left: "30px",
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
                    {[0, 0, 0, 0, 0].map((_, i) => ( // new Array(5) wasn't working, ended up ugly but works fine
                        <div className="absolute bg-maroon w-[25px] leading-[30px] text-white text-center rounded-md" style={{top: 35 * i}}>
                            {i + 1}
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
