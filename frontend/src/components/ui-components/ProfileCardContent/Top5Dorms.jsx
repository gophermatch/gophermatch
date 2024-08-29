import { useState, useEffect } from "react";
import backend from "../../../backend";
import currentUser from '../../../currentUser.js';
import hamburger from "../../../assets/images/hamburger.svg";

const DORM_OPTIONS = [
    "Comstock",
    "Middlebrook",
    "17th",
    "Pioneer",
    "Bailey",
    "Centennial",
    "Frontier",
    "Sanford",
]

const peopleDict = {
    "1": "Single",
    "2": "Double",
    "3": "Triple",
    "4": "Quad",
}

export default function Top5Dorms({user_id, broadcaster}) {

    //TODO: add better defaults or some other loading state
    const [top5Data, setTop5Data] = useState({
        inputs: ["Pioneer", "17th", "Frontier", "Comstock", "Middlebrook"],
        question: "Top 5 Dorms?" //TODO: question should not exist in backend, should be hardcoded into html
    });

    const [holdPos, setHoldPos] = useState(null);
    const [holdBase, setHoldBase] = useState(null);
    const [heldDorm, setHeldDorm] = useState('');
    const [openedDropdown, setOpenedDropdown] = useState(undefined); // integer representing index
    const mousePos = useMousePosition();

    const [top5Dorms, setTop5Dorms] = useState(top5Data.inputs); //TODO: this seems like duplicate state
    const [numPeople, setNumPeople] = useState(1);

    const unusedOptions = DORM_OPTIONS.filter(option => !top5Dorms.includes(option));

    function swapDormOption(i, value) {
        const dorms = [...top5Dorms]
        dorms[i] = value
        setTop5Dorms(dorms)
        setOpenedDropdown(undefined)
    }

    useEffect(() => {
        if (broadcaster) {
            const cb = () => {
                return Promise.all([
                    backend.put('/profile/insert-topfive', {
                        user_id: user_id,
                        question: top5Data.question,
                        input1: top5Dorms[0],
                        input2: top5Dorms[1],
                        input3: top5Dorms[2],
                        input4: top5Dorms[3],
                        input5: top5Dorms[4]
                    }),
                    backend.post('profile/set-gendata', {
                        user_id: user_id,
                        data: {num_residents: numPeople}
                    })
                ])
            }

            broadcaster.connect(cb)
            return () => broadcaster.disconnect(cb)
        }
      }, [broadcaster, top5Dorms, numPeople])

    useEffect(() => {
        async function fetchData() {
          backend.get('/profile/get-gendata', {params: {
            user_id: user_id,
            filter: ['num_residents']
          }}).then(res => setNumPeople(res.data[0].num_residents));
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
              setTop5Dorms([
                topfive.data.input1,
                topfive.data.input2,
                topfive.data.input3,
                topfive.data.input4,
                topfive.data.input5
              ])
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }

        fetchData();
      }, [user_id]);

    const offset = holdPos ? mousePos.y - holdPos.y : undefined;

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
        }

        if (offset > 35 && dormIndex < top5Dorms.length - 1) { // lowered down a position
            [top5Dorms[dormIndex], top5Dorms[dormIndex + 1]] = [top5Dorms[dormIndex + 1], top5Dorms[dormIndex]];
            setTop5Dorms([...top5Dorms]);
            setHoldBase(v => v + offset);
            setHoldPos(mousePos);
        }
    }, [mousePos]);

    return (
        <div className="flex flex-col border-2 border-solid border-maroon_new rounded-md w-full h-full p-[5px] font-roboto_slab custom-scrollbar">
            <div className="basis-[30px] flex">
                <div className="w-1/5">
                    {peopleDict[String(numPeople)]}
                </div>
                {broadcaster ?
                    <button onClick={() => setNumPeople(num => (num % 4) + 1)} className="bg-maroon text-white px-1 rounded-full">-&gt;</button>
                    :
                    <></>
                }
            </div>
            <hr className="border-t-1 bordet-top-solid border-maroon_new"></hr>
            <div className="flex-1 overflow-auto custom-scrollbar pr-[5px]">
                <p className="text-sm">{top5Data.question}</p>
                <div className="relative">
                    {top5Dorms.map((dorm, i) => {
                        const isHeld = heldDorm === dorm;
                        const basePosition = 35 * i;
                        return (
                            <div
                                key={dorm}
                                className={`bg-maroon w-[calc(100%-30px)] leading-[30px] pl-[5px] rounded-md text-white select-none absolute flex align-middle ${!isHeld && 'transition-all'}`}
                                style={{
                                    top: isHeld ? holdBase + offset : basePosition,
                                    left: "30px",
                                    zIndex: heldDorm === dorm || openedDropdown === i ? 1 : 0,
                                }}
                                onMouseLeave={() => { setHoldPos(null); setHoldBase(null); setHeldDorm(''); }}
                                onMouseUp={() => { setHoldPos(null); setHoldBase(null); setHeldDorm(''); }}
                            >
                                {broadcaster ?
                                    <>
                                    <div
                                        className="h-[30px] w-[18px] flex align-middle cursor-grab"
                                        onMouseDown={() => { setHoldPos(mousePos); setHoldBase(basePosition); setHeldDorm(dorm); }}
                                        >
                                        <img src={hamburger} draggable="false" />
                                    </div>
                                    <div
                                        className="border-[1px] border-white border-solid pl-[4px] m-[4px] leading-[22px] h-[22px] w-[50%] cursor-pointer relative"
                                        onClick={openedDropdown !== i ? () => setOpenedDropdown(i): () => {}}
                                    >
                                        {openedDropdown === i ?
                                            <div className="absolute top-0 right-0 left-0 bg-white text-maroon border-[1px] border-solid border-inactive_gray">
                                                <button className="block w-full text-left hover:bg-offwhite" onClick={() => setOpenedDropdown(undefined)}>{dorm}</button>
                                                {unusedOptions.map(option => (
                                                    <button
                                                        key={option}
                                                        className="block w-full text-left hover:bg-offwhite border-t-inactive_gray border-t-[1px] border-t-solid"
                                                        onClick={() => swapDormOption(i, option)}
                                                        >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                            :
                                            dorm
                                        }

                                    </div>
                                    </>
                                    :
                                    dorm
                                }
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
