import backend from '../../backend';
import currentUser from '../../currentUser';
import React, { useState, useEffect } from "react";

export default function Settings() {
    const [userInfo, setUserInfo] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editKey, setEditKey] = useState(null);
    const [editValues, setEditValues] = useState({});

    const fetchUserInfo = async () => {
        try {
            const response = await backend.get('/account/fetch', {
                params: { user_id: currentUser.user_id }
            });
            if (response.status === 200) {
                const data = response.data.data;
                const filteredData = Object.entries(data).filter(([key, value]) => key !== 'user_id' && key !== 'hear_about_us' && key !== 'date_of_birth');
                setUserInfo(filteredData);
                setEditValues(Object.fromEntries(filteredData.map(([key, value]) => [key, ""])));
                console.log(userInfo);
                return data;
            } else {
                console.log('Error fetching user data');
            }
        } catch (error) {
            console.log('Error fetching user data');
        }
    }

    useEffect(() => {
        fetchUserInfo();
        const updateUserInfo = async () => {
            try {
                const response = await backend.post('/account/update', {
                    params: { user_id: currentnUser.user_id }
                    
                })
            }
            catch (error) {
                console.log('Error updating user info');
            }
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
            default:
                return key;
        }
    }

    const handleEditProfileClick = () => {
        setEditMode(true);
    };

    const handleInputChange = (key, value) => {
        setEditValues({ ...editValues, [key]: value });
    };

    const handleSaveChangesClick = async () => {
        setEditMode(false);
        // Save changes using editValues
    }

    const handleEditClick = (key) => {
        setEditKey(key);
        setEditMode(true);
    };

    return (
        <div className="flex flex-col h-screen w-screen font-comfortaa bg-doc">
            <h1 className="ml-10 mt-10 font-lora text-4xl text-maroon">
                {editMode ? 'Edit Profile' : 'Settings'}
            </h1>
            <div className="ml-10 mt-[4vh] h-1 w-[65vw] bg-maroon"></div>
            <div className="ml-10 mt-[4vh] w-[65vw] flex flex-col justify-center items-center">
                <button className="bg-maroon text-doc rounded-full w-[10vw] h-[4vh] text-xl" onClick={editMode ? handleSaveChangesClick : handleEditProfileClick}>
                    {editMode ? 'Save Changes' : 'Edit Profile'}
                </button>
            </div>
            <div className="ml-10 mt-[6vh] flex flex-col w-full justify-between text-maroon text-xl font-comfortaa">
            {userInfo.map(([key, value], index) => (
                <div key={index} className="font-comfortaa text-2xl mt-[1vh] justify-between flex h-[4vh] w-[65vw]">
                    <div className="flex justify-start items-center w-[20vw]">
                        <p className="">{getLabel(key)}:</p>
                    </div>
                    <div className="flex justify-center items-center w-[35vw]">
                        {editMode && editKey === key ? (
                            <input
                                type="text"
                                value={editValues[key]}
                                onChange={(e) => handleInputChange(key, e.target.value)}
                            />
                        ) : (
                            <p className="">{value}</p>
                        )}
                    </div>
                    <div className="flex justify-end items-center w-[10vw]">
                        {editMode && editKey === key && (
                            <p className="cursor-pointer hover:text-gold" onClick={() => handleSaveChangesClick(key)}>Save</p>
                        )}
                        {editMode && editKey !== key && (
                            <p className="cursor-pointer hover:text-gold" onClick={() => handleEditClick(key)}>Edit</p>
                        )}
                    </div>
                </div>
                ))}
            </div>
        </div>
    );
}
