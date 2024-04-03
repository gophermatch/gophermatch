import backend from '../../backend';
import currentUser from '../../currentUser';
import React, { useState, useEffect } from "react";

export default function Settings() {
    const [userInfo, setUserInfo] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editKey, setEditKey] = useState(null);
    const [editValues, setEditValues] = useState({});
    const [isEdited, setIsEdited] = useState(false);
    const [userID, setUserID] = useState(currentUser.user_id);

    const fetchUserInfo = async () => {
        try {
            const response = await backend.get('/account/fetch', {
                params: { user_id: userID }
            });
            if (response.status === 200) {
                const data = response.data.data;
                const filteredData = Object.entries(data).filter(([key, value]) => key !== 'user_id' && key !== 'hear_about_us' && key !== 'date_of_birth');
                setUserInfo(filteredData);
                setEditValues(Object.fromEntries(filteredData.map(([key, value]) => [key, value])));
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
            case 'major':
                return 'Major';
            case 'college':
                return 'College';
            case 'housing_preference':
                return 'Housing Preference';
            case 'graduating_year':
                return 'Graduation Year';
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
    const saveUserInfo = async () => {
        try {
            console.log('In try block')
            const response = await backend.post('/account/update', {
                userId: userID,
                ...editValues,
            });
            console.log('Account information successfully updated')
        }
        catch (error) {
            console.log('Error saving user data:', error)
        }
    }

    const handleInputChange = (key, value) => {
        setEditValues(prevValues => ({
            ...prevValues,
            [key]: value
        }));
        setIsEdited(true);
    };

    const handleSaveChangesClick = async () => {
        setEditMode(false);
        setIsEdited(false);
        saveUserInfo();
    }

    const handleEditClick = (key) => {
        setEditKey(key);
        setEditMode(true);
    };

    const colleges = ['CSE', 'CBS', 'Carlson', 'Design', 'CEHD', 'CFANS', 'Nursing', 'Other']
    const gradYear = ['2025', '2026', '2027', '2028', '2029', 'Other']
    const gender = ['Male', 'Female', 'Non-binary', 'Prefer Not to Say', 'Other']
    const housePref = ['Apartments', 'Dorms', 'Both']

    return (
        <div className="flex flex-col h-screen w-screen font-comfortaa bg-offwhite">
            <h1 className="ml-10 mt-10 font-lora text-4xl text-maroon">
                {editMode ? 'Edit Profile' : 'Settings'}
            </h1>
            <div className="ml-10 mt-[4vh] h-1 w-[80vw] bg-maroon"></div>
            <div className="ml-10 mt-[4vh] w-[80vw] mr-[1vw] flex flex-col justify-center items-center">
                <button
                    className={`text-doc rounded-full w-[10vw] h-[4vh] text-xl ${editMode ? 'bg-maroon' : 'bg-green-500'}`}
                    onClick={handleSaveChangesClick}
                    disabled={!isEdited}
                >
                    Save Changes
                </button>
            </div>
            <div className="flex flex-col w-full justify-center items-center text-maroon text-xl font-comfortaa">
                <div className="flex flex-wrap w-[65vw] mr-[8vw] justify-center">
                    {userInfo.map(([key, value], index) => (
                        <div key={index} className="font-comfortaa text-2xl mt-[1vh] justify-between flex flex-col w-[30%] mr-[3vw]">
                            <div className="flex justify-start items-center">
                                <p className="text-base mt-[3vh]">{getLabel(key)}</p>
                            </div>
                            <div className="flex justify-start items-center text-black text-xl">
                                {key === 'college' ? (
                                    <select
                                        value={editValues[key]}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        onClick={() => handleEditClick(key)}
                                        className="bg-gray-200 p-1 rounded-md w-full"
                                    >
                                        {colleges.map((college, index) => (
                                            <option key={index} value={college}>{college}</option>
                                        ))}
                                    </select>
                                ) : key === 'graduating_year' ? (
                                    <select
                                        value={editValues[key]}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        onClick={() => handleEditClick(key)}
                                        className="bg-gray-200 p-1 rounded-md w-full"
                                    >
                                        {gradYear.map((year, index) => (
                                            <option key={index} value={year}>{year}</option>
                                        ))}
                                    </select>
                                ) : key === 'gender' ? (
                                    <select
                                        value={editValues[key]}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        onClick={() => handleEditClick(key)}
                                        className="bg-gray-200 p-1 rounded-md w-full"
                                    >
                                        {gender.map((gender, index) => (
                                            <option key={index} value={gender}>{gender}</option>
                                        ))}
                                    </select>
                                ) : key === 'housing_preference' ? (
                                    <select
                                        value={editValues[key]}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        onClick={() => handleEditClick(key)}
                                        className="bg-gray-200 p-1 rounded-md w-full"
                                    >
                                        {housePref.map((pref, index) => (
                                            <option key={index} value={pref}>{pref}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        value={editValues[key]}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        onClick={() => handleEditClick(key)}
                                        className="bg-gray-200 p-1 rounded-md w-full"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
    
