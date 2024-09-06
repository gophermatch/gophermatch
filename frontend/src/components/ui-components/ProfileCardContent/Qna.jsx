import { useEffect, useState } from "react";
import backend from "../../../backend";

const CHOICE_DICT = {
    "room_activity": ["Party", "Friends", "Empty"],
    "substances": ["Yes", "No"],
    "alcohol": ["Yes", "No"],
    "tidiness": ["Dirty", "Clean"],
};

export default function Qna({ user_id, broadcaster }) {
    const [room_activity, setRoomActivity] = useState("");
    const [substances, setSubstances] = useState("");
    const [alcohol, setAlcohol] = useState("");
    const [tidiness, setTidiness] = useState("");

    useEffect(() => {
        backend
            .get("/profile/get-gendata", {
                params: {
                    user_id: user_id,
                    filter: ["room_activity", "substances", "alcohol", "tidiness"],
                },
            })
            .then((res) => {
                setRoomActivity(res.data[0].room_activity);
                setSubstances(res.data[0].substances);
                setAlcohol(res.data[0].alcohol);
                setTidiness(res.data[0].tidiness);
            })
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (broadcaster) {
            const cb = () =>
                backend.post("profile/set-gendata", {
                    user_id: user_id,
                    data: { room_activity, substances, alcohol, tidiness },
                });

            broadcaster.connect(cb);
            return () => broadcaster.disconnect(cb);
        }
    }, [broadcaster, room_activity, substances, alcohol, tidiness]);

    return (
        <div className="w-full h-full rounded-lg border-solid border-2 border-maroon xl:text-lg lg: text-md md:text-sm sm:text-xs font-roboto_slab font-medium">
            <div className="flex w-full h-full justify-center items-center flex-col px-[1%]">
                {/* Room Activity Level */}
                <div className="flex w-full whitespace-nowrap">
                    <div className="flex-1">Preferred Room Activity Level</div>
                    <div className="flex-1 text-right">
                        {broadcaster ? (
                            <select
                                value={room_activity}
                                onChange={(e) => setRoomActivity(e.target.value)}
                                className="border border-gray-300 p-1"
                            >
                                {CHOICE_DICT["room_activity"].map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            room_activity
                        )}
                    </div>
                </div>

                <div className="flex w-[97%] h-[5%] border-b"></div>

                {/* Substance Preference */}
                <div className="flex w-full whitespace-nowrap">
                    <div className="flex-1">Substance Preference</div>
                    <div className="flex-1 text-right">
                        {broadcaster ? (
                            <select
                                value={substances}
                                onChange={(e) => setSubstances(e.target.value)}
                                className="border border-gray-300 p-1"
                            >
                                {CHOICE_DICT["substances"].map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            substances
                        )}
                    </div>
                </div>

                <div className="flex w-[97%] h-[5%] border-b"></div>

                {/* Alcohol Preference */}
                <div className="flex w-full whitespace-nowrap">
                    <div className="flex-1">Alcohol Preference</div>
                    <div className="flex-1 text-right">
                        {broadcaster ? (
                            <select
                                value={alcohol}
                                onChange={(e) => setAlcohol(e.target.value)}
                                className="border border-gray-300 p-1"
                            >
                                {CHOICE_DICT["alcohol"].map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            alcohol
                        )}
                    </div>
                </div>

                <div className="flex w-[97%] h-[5%] border-b"></div>

                {/* Tidiness Preference */}
                <div className="flex w-full whitespace-nowrap">
                    <div className="flex-1">Preferred Tidiness</div>
                    <div className="flex-1 text-right">
                        {broadcaster ? (
                            <select
                                value={tidiness}
                                onChange={(e) => setTidiness(e.target.value)}
                                className="border border-gray-300 p-1"
                            >
                                {CHOICE_DICT["tidiness"].map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            tidiness
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
