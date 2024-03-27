// import everything from user_data
// Make save button, and function that creates json with data from all editable fields, pressing save button sends it to a route
// backend.post('/account/update)
// Make function in useEffect backend.get(/account/fetch), take json data file and make the fields in it connect to the text box
import backend from '../../backend';
import currentUser from '../../currentUser';
import React, { useState, useEffect } from "react";

export default function Settings() {
    const[userInfo, setUserInfo] = useState([""]);

    const fetchUserInfo = async () => {
        try {
            const response = await backend.get('/account/fetch', {
                params: {user_id: currentUser.user_id}
            });
            if (response.status === 200) {
                const data = response.data.data;
                const filteredData = Object.entries(data).filter(([key, value]) => key !== 'user_id' && key !== 'hear_about_us');
                setUserInfo(filteredData);

                console.log(userInfo);

                return data;
            }
            else {
                console.log('Error fetching user data');
            }
        }
        catch (error) {
            console.log('Error fetching user data');
        }
    }

    useEffect(() => {
        fetchUserInfo();

        const saveUserInfo = async () => {
            const response = await backend.post('/account/update', {
                params: {user_id: currentUser.user_id},
                name: newName,

            })
        }
    }, [])

    const getLabel = (key) => {
        switch (key) {
            case 'first_name':
                return 'First name'
            case 'last_name':
                return 'Last name';
            case 'date_of_birth':
                return 'Date of Birth';
            case 'hometown':
                return 'Hometown';
            case 'housing_preference':
                return 'Housing Preference';
            case 'college':
                return 'College';
            case 'major':
                return 'Major';
            case 'graduating_year':
                return 'Graduation Year'
            case 'gender':
                return 'Gender';
            case 'contact_email':
                return 'Email'
            case 'contact_phone':
                return 'Phone Number';
            case 'contact_snapchat':
                return 'Snapchat';
            case 'contact_instagram':
                return 'Instagram';
        }
    }

    return (
        <div className="flex flex-col h-screen w-screen font-lora bg-doc">
            <h1 className="ml-10 mt-10 font-lora text-4xl text-maroon">First Name</h1>
            <div className="ml-10 mt-20 h-1 w-[44.6rem] bg-maroon"></div>
            <div className="ml-10 mt-20 flex flex-col w-full flex-grow items-start text-maroon text-xl font-lora">
            {userInfo.map(([key, value], index) => (
                <div key={index} className="font-lora text-xl">
                    <p>{getLabel(key)}: {value}</p>
                </div>
                ))}
            </div>
        </div>
    );
}