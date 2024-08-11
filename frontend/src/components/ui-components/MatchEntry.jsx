import {React, useEffect, useState} from "react";

import kanye from '../../assets/images/kanye.png';
import backend from '../../backend.js';

export default function MatchEntry ({user_id, deleteMatch}) {

    useEffect(() => {
        fetchUserData();
        fetchFirstPicture();
    }, [user_id]);

    const [userData, setUserData] = useState({});
    const [picUrl, setPicUrl] = useState({});

    async function fetchUserData () {
        
        const columns = ["first_name", "last_name", "contact_email", "contact_phone", "contact_snapchat", "contact_instagram"]
        
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

    function getValidContact() {
        return userData.contact_phone || 
               userData.contact_snapchat || 
               userData.contact_instagram || 
               userData.contact_email;
    }

    return (
        <div className="flex flex-col h-[18%] w-full duration-200 hover:bg-gray cursor-pointer" key={user_id}>
        <div className="flex">
            <div className="flex flex-row w-full">
                <img
                    src={picUrl || kanye}
                    className="rounded-[5%] h-[98px] w-[98px] aspect-square mt-[2%] ml-[2%]"
                    alt={`Profile`}
                />
                <div className="flex flex-col w-full text-start justify-start">
                    <div className="flex flex-row">
                        <div className="text-[18px] mt-[6.5%] ml-[5%] font-roboto_slab text-black font-[390]">{`${userData.first_name} ${userData.last_name}`}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="ml-[5%] text-[18px] font-[200] text-black">{`Contact at ${getValidContact()}`}</div>
                    </div>
                </div>
                <div className="flex flex-col mt-[4%] mr-[5%] items-center justify-center">
                    <button className="h-[20px] w-[20px]" onClick={() => deleteMatch(user_id)}>
                        <img src="../../assets/images/people_remove.svg" alt="Remove" className="w-[100%] h-[100%] object-contain text-maroon fill-current duration-200 hover:brightness-0" />
                    </button>
                </div>
            </div>
        </div>
        <div className="w-[95%] h-[1px] ml-[2.5%] bg-maroon font-thin mt-[2.85%]"></div>
    </div>
    );
}