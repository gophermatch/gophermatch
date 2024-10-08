import {React, useEffect, useState} from "react";

import kanye from '../../assets/images/kanye.png';
import backend from '../../backend.js';

export default function SubleaseInboxEntry ({sublease_id, deleteSub, setDisplay}) {

    useEffect(() => {
        if(sublease_id > 0) fetchSubleaseData();
    }, [sublease_id]);

    const handleRemoveClick = (event) => {
        event.stopPropagation(); // Prevents the event from reaching the parent which would show the profile
        deleteSub(sublease_id);
    };

    const [subleaseData, setSubleaseData] = useState({});
    const [userData, setUserData] = useState({});
    const [picUrl, setPicUrl] = useState({});

    async function fetchSubleaseData () {
        
        const result = await backend.get('/sublease/get', {params: {
            sublease_id: sublease_id,
        }});

        await setSubleaseData(result.data);

        await fetchUserData(result.data.user_id);
    }

    async function fetchUserData (user_id) {
        
        const columns = ["first_name", "last_name", "contact_email", "contact_phone", "contact_snapchat", "contact_instagram"]
        
        const result = await backend.get('/profile/get-gendata', {params: {
            user_id: user_id,
            filter: columns
        }});

        await setUserData(result.data[0]);

        fetchFirstPicture(user_id);
    }

    async function fetchFirstPicture (user_id) {
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
               userData.contact_email || "No contact info found";
    }

    return (
        <div className="flex flex-col h-[18%] w-full border-inactive_gray border-b-[1px] duration-200 hover:bg-gray cursor-pointer" onClick={() => setDisplay({id: sublease_id, display_type: "sublease"})} key={sublease_id}>
            <div className="flex flex-row w-full h-full">
                <img
                    src={picUrl || kanye}
                    className="rounded-[10%] p-[1%] w-[20%] h-full aspect-square"
                    alt={`Profile`}
                />
                <div className="flex flex-grow flex-col w-full text-start justify-center overflow-hidden">
                    <div className="flex flex-row">
                        <div className="text-[18px] ml-[5%] font-roboto_slab text-black font-[390]">{`${subleaseData.building_name}`}</div>
                    </div>
                    <div className="flex flex-row">
                        <div className="ml-[5%] text-[18px] font-[200] text-black">{`$${subleaseData.rent_amount}/month`}</div>
                    </div>
                    <div className="flex flex-row">
                     <div className="ml-[5%] text-[18px] font-[200] text-black">{getValidContact()}</div>
                 </div>
                </div>
                <div className="flex flex-col gap-[10%] w-[20%] items-center justify-center overflow-hidden">
                    <button className="" onClick={handleRemoveClick}>
                        <img src="../../assets/images/people_remove.svg" alt="Remove" className="w-[100%] h-[100%] object-contain text-maroon fill-current duration-200 hover:brightness-0" />
                    </button>
                </div>
            </div>
        <div className="w-[95%] h-[1px] ml-[2.5%] bg-maroon font-thin mt-[2.85%]"></div>
    </div>
    );
}