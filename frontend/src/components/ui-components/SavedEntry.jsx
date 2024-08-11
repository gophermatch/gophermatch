import {React, useEffect, useState} from "react";

import kanye from '../../assets/images/kanye.png';
import backend from '../../backend.js';

export default function SavedEntry ({user_id, deleteMatch, acceptMatch}) {

    useEffect(() => {
        fetchUserData();
        fetchFirstPicture();
    }, [user_id]);

    const [userData, setUserData] = useState({});
    const [picUrl, setPicUrl] = useState({});

    async function fetchUserData () {
        
        const columns = ["first_name", "last_name"]
        
        const result = await backend.get('/profile/get-gendata', {params: {
            user_id: user_id,
            filter: columns
        }});

        setUserData(result.data[0]);
    }

    async function fetchFirstPicture () {
        try {
            if (!user_id) {
                console.error("User ID is missing");
                return;
            }

            const response = await backend.get("/profile/user-pictures", {
                params: { user_id: user_id },
                withCredentials: true,
            });

            if (response && response.data)
            {
                setPicUrl(response.data.pictureUrls[0]);
            }
        } catch (error) {
            console.error("Error fetching picture URLs:", error);
        }
    };

    return (<div className="flex flex-col h-[18%] w-full border-inactive_gray border-b-[1px] duration-200 hover:bg-gray cursor-pointer" key={user_id}>
            <div className="flex flex-row w-full h-full">
                <img
                    src={picUrl || kanye}
                    className="rounded-[10%] p-[1%] w-[20%] h-full aspect-square"
                    alt={`Profile`}
                />
                <div className="flex flex-grow flex-col w-full text-start justify-center overflow-hidden">
                    <div className="flex flex-row">
                        <div className="text-[18px] ml-[5%] font-roboto_slab text-black font-[390]">{`${userData.first_name} ${userData.last_name}`}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="ml-[5%] text-[18px] font-[200] text-black">{`Major, Class`}</div>
                    </div>
                </div>
                <div className="flex flex-col gap-[10%] w-[20%] items-center justify-center overflow-hidden">
                    <button className="" onClick={() => acceptMatch(user_id)}>
                        <img src="../../assets/images/people_accept.svg" alt="Match" className="w-[100%] h-[100%] object-contain text-maroon fill-current duration-200 hover:brightness-0" />
                    </button>
                    <button className="" onClick={() => deleteMatch(user_id)}>
                        <img src="../../assets/images/people_remove.svg" alt="Remove" className="w-[100%] h-[100%] object-contain text-maroon fill-current duration-200 hover:brightness-0" />
                    </button>
                </div>
            </div>
        <div className="w-[95%] h-[1px] ml-[2.5%] bg-maroon font-thin mt-[2.85%]"></div>
    </div>);
   }