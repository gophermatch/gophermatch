import { useEffect, useState } from "react";
import backend from "../../../backend";
import styles from '../../../assets/css/name.module.css';
import dropdownImg from "../../../assets/images/dropdown.png";
import dropupImg from "../../../assets/images/dropup.png";

const CHOICE_DICT = {
    "room_activity": ["Party", "Friends", "Empty"],
    "substances": ["Yes", "No"],
    "alcohol": ["Yes", "No"],
    "tidiness": ["Dirty", "Clean"],
}

function OptionDropdown({value, name, dropdown, setDropdown, dispatch}) {
    return(
        <div className={`relative w-[60%] ${dropdown === name ? "z-20" : "z-10"} flex justify-end`}>
            <select
                id="selectionBox"
                value={value}
                onChange={(e) => {dispatch(e.target.value)}}
                className="flex w-[5vw] mt-[0.5vh] text-center justify-center hover:bg-maroon_transparent2 cursor cursor-pointer"
            >
                {CHOICE_DICT[name].map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select> 
        </div>
    )
}

export default function Qna({user_id, broadcaster}) {
    const [room_activity, setRoomActivity] = useState("")
    const [substances, setSubstances] = useState("")
    const [alcohol, setAlcohol] = useState("")
    const [tidiness, setTidiness] = useState("")

    const [currentDropdown, setCurrentDropdown] = useState(undefined)

    useEffect(() => {
        backend.get('/profile/get-gendata', {params: {
            user_id: user_id,
            filter: ['room_activity', 'substances', 'alcohol', 'tidiness'],
        }}).then(res => {
            setRoomActivity(res.data[0].room_activity)
            setSubstances(res.data[0].substances)
            setAlcohol(res.data[0].alcohol)
            setTidiness(res.data[0].tidiness)
        }).catch(console.error)
    }, [])

    useEffect(() => {
        if (broadcaster) {
            const cb = () => backend.post('profile/set-gendata', {
                user_id: user_id,
                data: {room_activity, substances, alcohol, tidiness},
            })

            broadcaster.connect(cb)
            return () => broadcaster.disconnect(cb)
        }
    }, [broadcaster, room_activity, substances, alcohol])

    return (
    <div className={"w-full h-full rounded-lg border-solid border-2 border-maroon xl:text-lg lg: text-md md:text-sm sm:text-xs font-roboto_slab font-medium"}>
    <div className={"flex w-full h-full justify-center items-center flex-col px-[1%]"}>
        <div className={"flex w-full whitespace-nowrap"}>
            <div className={"flex-1"}>
                Preferred Room Activity Level
            </div>
            <div className={"flex-1 text-right flex justify-end align-middle"}>
                {broadcaster ?
                    <OptionDropdown
                        value={room_activity}
                        name={"room_activity"}
                        dropdown={currentDropdown}
                        setDropdown={setCurrentDropdown}
                        dispatch={setRoomActivity}
                    />
                    :
                    room_activity
                }
            </div>
        </div>

        <div className={"flex w-[97%] h-[5%] border-b"}></div>

        <div className={"flex w-full whitespace-nowrap"}>
            <div className={"flex-1"}>
                Substance Preference
            </div>
            <div className={"flex-1 text-right flex justify-end align-middle"}>
                {broadcaster ?
                    <OptionDropdown
                        value={substances}
                        name={"substances"}
                        dropdown={currentDropdown}
                        setDropdown={setCurrentDropdown}
                        dispatch={setSubstances}
                    />
                    :
                    substances
                }
            </div>
        </div>

        <div className={"flex w-[97%] h-[5%] border-b"}></div>

        <div className={"flex w-full whitespace-nowrap"}>
            <div className={"flex-1"}>
                Alcohol Preference
            </div>
            <div className={"flex-1 text-right flex justify-end align-middle"}>
                {broadcaster ?
                    <OptionDropdown
                        value={alcohol}
                        name={"alcohol"}
                        dropdown={currentDropdown}
                        setDropdown={setCurrentDropdown}
                        dispatch={setAlcohol}
                    />
                    :
                    alcohol
                }
            </div>
        </div>

        <div className={"flex w-[97%] h-[5%] border-b"}></div>

        <div className={"flex w-full whitespace-nowrap"}>
            <div className={"flex-1"}>
                Preferred Tidiness
            </div>
            <div className={"flex-1 text-right flex justify-end align-middle"}>
                {broadcaster ?
                    <OptionDropdown
                        value={tidiness}
                        name={"tidiness"}
                        dropdown={currentDropdown}
                        setDropdown={setCurrentDropdown}
                        dispatch={setTidiness}
                    />
                    :
                    tidiness
                }
            </div>
        </div>
    </div>
    </div>);
}
