import backend from '../../backend';
import currentUser from '../../currentUser';
import React, { useState, useEffect } from "react";

export default function Settings() {
    const [userInfo, setUserInfo] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editKey, setEditKey] = useState(null);
    const [mode, setMode] = useState("Settings");

    const fetchUserInfo = async () => {
        try {
            const response = await backend.get('/account/fetch', {
                params: { user_id: currentUser.user_id }
            });
            if (response.status === 200) {
                const data = response.data.data;
                const filteredData = Object.entries(data).filter(([key, value]) => key !== 'user_id' && key !== 'hear_about_us' && key !== 'date_of_birth');
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
            default:
                return key;
        }
    }

    const handleEditProfileClick = () => {
        setMode("Edit Profile");
    };

    const handleInputChange = (key, value) => {
        setUserInfo(prevUserInfo => {
            const updatedUserInfo = [...prevUserInfo];
            const index = updatedUserInfo.findIndex(([k, v]) => k === key);
            if (index !== -1) {
                updatedUserInfo[index] = [key, value];
            }
            return updatedUserInfo;
        });
    }
    

    const handleSaveChangesClick = async () => {
        setMode("Settings");
    }

    const handleEditClick = (key) => {
        setEditKey(key);
    };

    return (
        <div className="flex flex-col h-screen w-screen font-comfortaa bg-doc">
            <h1 className="ml-10 mt-10 font-lora text-4xl text-maroon">
                {mode === 'Edit Profile' ? 'Edit Profile' : 'Settings'}
            </h1>
            <div className="ml-10 mt-[4vh] h-1 w-[65vw] bg-maroon"></div>
            <div className="ml-10 mt-[4vh] w-[65vw] flex flex-col justify-center items-center">
                <button className="bg-maroon text-doc rounded-full w-[10vw] h-[4vh] text-xl" onClick={mode === 'Settings' ? handleEditProfileClick : handleSaveChangesClick}>
                    {mode === 'Edit Profile' ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>
            <div className="ml-10 mt-[6vh] flex flex-col w-full flex-grow items-start text-maroon text-xl font-comfortaa">
                {userInfo.map(([key, value], index) => (
                    <div key={index} className="font-comfortaa text-2xl mt-[1vh] justify-between flex h-[4vh] w-[65vw]">
                        <p className="justify-start">{getLabel(key)}:</p>
                        {mode === 'Edit Profile' && (
                            <>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleInputChange(key, e.target.value)}
                                />
                            </>
                        )}
                        {mode === 'Settings' && <p className="justify-center">{value}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
