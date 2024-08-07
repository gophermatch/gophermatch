import { useState, useEffect } from "react";
import backend from "../../../backend";
import currentUser from '../../../currentUser.js';

/*
    Currently only the button to switch between both semesters and
    one semester in conditional based on edit mode. The min and max
    people also needs to be made conditional, and the UI should be
    cleaned up a bit in edit mode. The component is in view mode
    if broadcaster is null, otherwise its in edit mode.

    Data should ONLY be saved inside the broadcaster useEffect. It
    looks like the order is immediately being sent to the backend, this
    needs to be switched to all be done while saving. Please delete
    this comment once its fixed so some pour soul doesn't have to try
    to figure out where the saving issue is.
*/

export default function Top5Dorms({user_id, broadcaster}) {

    //TODO: add better defaults or some other loading state
    const [top5Data, setTop5Data] = useState({
        inputs: ["comstock", "middlebrook", "something", "idk", "idk2"],
        question: "Top 5??" //TODO: question should not exist in backend, should be hardcoded into html
    });

    const [holdPos, setHoldPos] = useState(null);
    const [holdBase, setHoldBase] = useState(null);
    const [heldDorm, setHeldDorm] = useState('');
    const mousePos = useMousePosition();

    const [top5Dorms, setTop5Dorms] = useState(top5Data.inputs); //TODO: this seems like duplicate state
    const [minPeople, setMinPeople] = useState(2);
    const [maxPeople, setMaxPeople] = useState(4);
    const [semesters, setSemesters] = useState("Both Semesters");

    useEffect(() => {
        if (broadcaster) {
            const cb = () => {
                //TODO: should be able to swap this return out for just `return backend.put(...)` for data saving
                return new Promise((resolve) => {
                    console.log("Saving data")
                    resolve()
                })
            }

            broadcaster.connect(cb)
            return () => broadcaster.disconnect(cb)
        }
      }, [broadcaster])

    useEffect(() => {
        async function fetchData() {
          try {

            const topfive = await backend.get('/profile/get-topfive', {
              params: {
                user_id: user_id
              }
            });

            if (topfive.data) {
              setTop5Data({
                question: topfive.data.question,
                inputs: [
                    topfive.data.input1,
                    topfive.data.input2,
                    topfive.data.input3,
                    topfive.data.input4,
                    topfive.data.input5,
                ]
              });
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }

        fetchData();
      }, [user_id]);

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
                {/* if the broadcaster exists then the component is in edit mode */}
                {broadcaster && <button className="ml-[10px] bg-maroon text-white px-1 h-[20px] rounded-xl" onClick={() => setSemesters(semesters === "Both Semesters" ? "1 Semester" : "Both Semesters")}>^</button>}
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
