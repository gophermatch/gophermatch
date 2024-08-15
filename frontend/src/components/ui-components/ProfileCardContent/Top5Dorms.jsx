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
        inputs: ["comstock", "middlebrook", "something", "idk", "idk2"],
        question: "Top 5??" //TODO: question should not exist in backend, should be hardcoded into html
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

    const getTopValue = (isHeld, holdBase, offset, basePosition, index) => {
        const topValue = isHeld ? holdBase + offset : basePosition;
        if (window.innerWidth >= 1024) { // Adjust for large screens
          return topValue + (index * 20);
        }
        return topValue;
      };
    
      return (
        <div className="flex flex-col border-[1.5px] border-solid border-maroon_new rounded-md w-[100%] h-full p-[5px] font-roboto_slab">
          <div className="h-[15%] flex justify-center text-center text-[7px] lg:text-[15px] md:text-[12px] sm:text-[8px]">
            <div className="flex flex-row justify-center h-full">
              <input type="text" value={minPeople} onChange={e => handleChangePeople(e.target.value, setMinPeople)} className="ml-[0px] aspect-square h-[80%] text-center bg-offwhite" />
              <div className="ml-[2px] mr-[2px] mt-[-5%]">-</div>
              <input type="text" value={maxPeople} onChange={e => handleChangePeople(e.target.value, setMaxPeople)} className="aspect-square h-[80%] text-center bg-offwhite" />
              <div className="ml-[3px] md:ml-[5px] h-full leading-none">People</div>
            </div>
            <div className="w-full text-right leading-none">{semesters}</div>
            {broadcaster && <button className="ml-[10px] bg-maroon text-white px-1 h-[20px] rounded-xl" onClick={() => setSemesters(semesters === "Both Semesters" ? "1 Semester" : "Both Semesters")}>^</button>}
          </div>
          <hr className="border-t-1 border-t-solid border-maroon_new mt-[1.5%]"></hr>
          <div className="flex-1 overflow-y-scroll custom-scrollbar">
            <p className="text-[10px] sm:text-[10px] lg:text-[14px]">Dorms</p>
            <div className="relative">
              {top5Dorms.map((dorm, i) => {
                const isHeld = heldDorm === dorm;
                const basePosition = 20 * i;
                return (
                  <div
                    key={dorm}
                    className={`bg-maroon w-[calc(100%-30px)] h-[13px] text-[9px] lg:text-[13px] lg:h-[1.3rem] flex items-center ml-[-3px] pl-[5px] rounded-[3px] lg:rounded-[5px] text-white select-none absolute ${!isHeld && 'transition-all'}`}
                    style={{
                      top: window.innerWidth >= 1024 ? 25 * i : 18 * i ,
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
                <div key={i} className="absolute bg-maroon w-[13px] h-[13px] text-[9px] lg:text-[12px] lg:h-[1.3rem] lg:w-[1.3rem] flex items-center justify-center text-white text-center rounded-[3px] lg:rounded-[5px]" style={{ top: window.innerWidth >= 1024 ? 25 * i : 18 * i }}>
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
