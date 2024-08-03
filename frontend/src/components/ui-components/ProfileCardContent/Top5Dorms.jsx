import { useState, useEffect } from "react";
import backend from "../../../backend";
import currentUser from '../../../currentUser.js';

export default function Top5Dorms({ top5Data }) {
    const [holdPos, setHoldPos] = useState(null);
    const [holdBase, setHoldBase] = useState(null);
    const [heldDorm, setHeldDorm] = useState('');
    const mousePos = useMousePosition();

    const [top5Dorms, setTop5Dorms] = useState(top5Data.inputs);
    const [minPeople, setMinPeople] = useState(2);
    const [maxPeople, setMaxPeople] = useState(4);
    const [semesters, setSemesters] = useState("Both Semesters");

    useEffect(() => {
        setTop5Dorms(top5Data.inputs);
    }, [top5Data]);

    function handleChangePeople(value, stateDispatch) {
        const digit = value.slice(-1);
        if (!isNaN(digit)) {
            stateDispatch(digit);
        }
    }

    const offset = holdPos ? mousePos.y - holdPos.y : undefined;

    const updateTop5Order = async (updatedDorms) => {
        try {
            await backend.put('/profile/insert-topfive', {
                user_id: currentUser.user_id,
                question: top5Data.question,
                input1: updatedDorms[0],
                input2: updatedDorms[1],
                input3: updatedDorms[2],
                input4: updatedDorms[3],
                input5: updatedDorms[4]
            });
        } catch (error) {
            console.error('Error updating top 5 order:', error);
        }
    };

    useEffect(() => {
        if (!holdPos) {
            return;
        }
        const dormIndex = top5Dorms.findIndex(dorm => dorm === heldDorm);

        if (offset < -35 && dormIndex > 0) { // raised up a position
            [top5Dorms[dormIndex], top5Dorms[dormIndex - 1]] = [top5Dorms[dormIndex - 1], top5Dorms[dormIndex]];
            setTop5Dorms([...top5Dorms]);
            setHoldBase(v => v + offset);
            setHoldPos(mousePos);
            updateTop5Order(top5Dorms); // Update backend with new order
        }

        if (offset > 35 && dormIndex < top5Dorms.length - 1) { // lowered down a position
            [top5Dorms[dormIndex], top5Dorms[dormIndex + 1]] = [top5Dorms[dormIndex + 1], top5Dorms[dormIndex]];
            setTop5Dorms([...top5Dorms]);
            setHoldBase(v => v + offset);
            setHoldPos(mousePos);
            updateTop5Order(top5Dorms); // Update backend with new order
        }
    }, [mousePos]);

    return (
        <div className="flex flex-col border-2 border-solid border-maroon_new rounded-md w-full h-full p-[5px] font-roboto_slab">
            <div className="basis-[30px] flex">
                <div>
                    <input type="text" value={minPeople} onChange={e => handleChangePeople(e.target.value, setMinPeople)} className="ml-[10px] w-[15px] bg-offwhite inline-block" />
                    <div className="inline-block">-</div>
                    <input type="text" value={maxPeople} onChange={e => handleChangePeople(e.target.value, setMaxPeople)} className="w-[15px] bg-offwhite inline-block" />
                    <div className="inline-block">People</div>
                </div>
                <div className="ml-auto w-[200px] text-right">{semesters}</div>
                <button className="ml-[10px] bg-maroon text-white px-1 h-[20px] rounded-xl" onClick={() => setSemesters(semesters === "Both Semesters" ? "1 Semester" : "Both Semesters")}>^</button>
            </div>
            <hr className="border-t-1 bordet-top-solid border-maroon_new"></hr>
            <div className="flex-1 overflow-auto">
                <p className="text-sm">{top5Data.question}</p>
                <div className="relative">
                    {top5Dorms.map((dorm, i) => {
                        const isHeld = heldDorm === dorm;
                        const basePosition = 35 * i;
                        return (
                            <div
                                key={dorm}
                                className={`bg-maroon w-[calc(100%-30px)] leading-[30px] pl-[5px] rounded-md text-white select-none absolute ${!isHeld && 'transition-all'}`}
                                style={{
                                    top: isHeld ? holdBase + offset : basePosition,
                                    left: "30px",
                                    zIndex: heldDorm === dorm ? 1 : 0,
                                }}
                                onMouseDown={() => { setHoldPos(mousePos); setHoldBase(basePosition); setHeldDorm(dorm); }}
                                onMouseUp={() => { setHoldPos(null); setHoldBase(null); setHeldDorm(''); }}
                                onMouseLeave={() => { setHoldPos(null); setHoldBase(null); setHeldDorm(''); }}
                            >
                                {dorm}
                            </div>
                        );
                    })}
                    {[0, 0, 0, 0, 0].map((_, i) => (
                        <div key={i} className="absolute bg-maroon w-[25px] leading-[30px] text-white text-center rounded-md" style={{ top: 35 * i }}>
                            {i + 1}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const useMousePosition = () => {
    const [mousePosition, setMousePosition] = useState({ x: null, y: null });
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
