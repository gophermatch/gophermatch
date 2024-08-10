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
        <div className="flex flex-col h-[11vh] w-full" key={0}>
        <div className="flex">
            <div className="flex flex-row w-full">
                <img
                    src={picUrl || kanye}
                    className="rounded-full h-[8vh] w-[8vh] mt-[0.5vh] ml-[0.5vw] cursor-pointer"
                    onClick={() => displayProfile(person)}
                    alt={`Kanye's profile`}
                />
                <div className="flex flex-col w-full text-start justify-start">
                    <div className="flex flex-row">
                        <button className="text-[2.5vh] mt-[1.5vh] ml-[1vw] font-roboto font-[390] text-maroon" onClick={() => displayProfile(person)}>{`${userData.first_name} ${userData.last_name}`}</button>
                    </div>
                    <div className="flex flex-row">
                        <button className="ml-[1vw] text-[2vh] font-[200] text-black" onClick={() => displayProfile(person)}>{getValidContact()}</button>
                    </div>
                </div>
                <div className="flex flex-col items-end justify-end">
                    <button className="" onClick={() => match(person.user_id)}>
                        <svg width="3vw" height="3vh" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" fill="none" className="hover:stroke-gold" stroke="#000000"><polyline points="12 28 28 44 52 20" /></svg>
                    </button>
                    <button className="hover:text-maroon text-inactive_gray mr-[1.1vw] text-[2.125vh]" onClick={() => removeSave(person.user_id)}>X</button>
                </div>
            </div>
        </div>
        <div className="w-[95%] h-[1%] ml-[2.5%] bg-gray font-thin mt-[1.75vh]"></div>
    </div>
    );
}