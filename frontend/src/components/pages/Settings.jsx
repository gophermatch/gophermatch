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
                return 'First Name'
            case 'last_name':
                return 'Last Name';
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
            const response = await backend.post('/account/update', {
                userId: userID,
                ...editValues,
            });
            console.log('Account information successfully updated')
        } catch (error) {
            console.log('Error saving user data:', error)
        }
    }

    const handleInputChange = (key, value) => {
        setEditValues(prevValues => ({
            ...prevValues,
            [key]: value
        }));
        setIsEdited(true); // Set isEdited to true whenever a field is changed
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
    const gender = ['Male', 'Female', 'Non-binary', 'Other']
    const housePref = ['Apartments', 'Dorms', 'Both']

    return (
        <div className="flex flex-col h-screen w-screen font-roboto bg-offwhite">
            <h1 className="ml-[3vw] mt-[5vh] font-roboto text-center font-medium mr-[18vw] justify-center text-4xl text-settings">
                Settings
            </h1>
            <div className="flex flex-col w-full justify-center items-center text-settings text-xl font-comfortaa">
                <div className="grid grid-cols-2 gap-4 mt-[3vh] mr-[10vw]">
                    {userInfo.map(([key, value], index) => (
                        <div key={index} className="font-comfortaa pr-[2vw] text-2xl mt-[1vh]">
                            <div className="flex justify-start items-center">
                                <p className="text-base">{getLabel(key)}</p>
                            </div>
                            <div className="flex justify-start items-center text-black text-xl">
                                {key === 'college' ? (
                                    <select
                                        value={editValues[key]}
                                        onChange={(e) => handleInputChange(key, e.target.value)}
                                        onClick={() => handleEditClick(key)}
                                        className="bg-gray-200 p-[1vh] rounded-[1vh] w-full"
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
                                        className="bg-gray-200 p-[1vh] rounded-[1vh] w-full"
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
                                        className="bg-gray-200 p-[1vh] rounded-[1vh] w-full"
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
                                        className="bg-gray-200 p-[1vh] rounded-[1vh] w-full"
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
                                        className="bg-gray-200 p-[1vh] rounded-[1vh] w-full"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className="ml-10 mt-[8vh] w-[80vw] mr-[1vw] flex flex-col justify-center items-center">
                <button
                    className={`text-white rounded-[1vh] w-[10vw] h-[5vh] text-[1.25vw] ${isEdited ? 'bg-settings hover:bg-dark_maroon' : 'bg-inactive_gray'}`}
                    onClick={handleSaveChangesClick}
                    disabled={!isEdited}
                >
                    Apply
                </button>
            </div>
        </div>
    );
}
