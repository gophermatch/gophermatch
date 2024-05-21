import backend from '../../backend';
import currentUser from '../../currentUser';
import React, { useState, useEffect } from "react";

export default function Settings() {
    const [userInfo, setUserInfo] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editKey, setEditKey] = useState(null);
    const [editValues, setEditValues] = useState({ contact_type: 'Phone' });
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

    useEffect(() => {
        const dormsChecked = userInfo.find(([key]) => key === 'housing_preference')?.[1] === 'Dorms';
        const apartmentsChecked = userInfo.find(([key]) => key === 'housing_preference')?.[1] === 'Apartments';
    
        setEditValues((prevValues) => ({
            ...prevValues,
            dormCheckbox: dormsChecked,
            apartmentCheckbox: apartmentsChecked,
        }));
    }, [userInfo]);    

    const handleCheckboxChange = (key, value) => {
        setEditValues((prevValues) => ({
            ...prevValues,
            [key]: value,
        }));
        setIsEdited(true);
    };

    //const colleges = ['College of Science and Engineering', 'College of Biological Sciences', 'Carlson School of Management', 'College of Design', 'College of Education and Human Development', 'College of Food, Agricultural and Natural Resource Sciences', 'School of Nursing', 'Other']
    const colleges = ['CSE', 'CBS', 'Carlson', 'Design', 'CEHD', 'CFANS', 'Nursing', "CLA", 'Other']
    const gradYear = ['2025', '2026', '2027', '2028', '2029', 'Other']
    const gender = ['Male', 'Female', 'Non-binary', 'Other']
    const contact = ['Phone', 'Email', 'Snapchat', 'Instagram']
    const housePref = ['Apartments', 'Dorms', 'Both']

    return (
        <div className="flex flex-col h-screen w-screen font-roboto bg-offwhite">
            <h1 className="ml-[3vw] mt-[3vh] font-roboto font-medium mr-[0vw] text-4xl text-settings">
                Settings
            </h1>
            <div className="flex flex-col w-full text-settings text-xl font-comfortaa">
                <div className="flex flex-row">
                    <div className="flex flex-col mt-[3vh]">
                        <div className="text-settings text-[2vh] ml-[5.5vw]">First Name</div>
                    <   input
                            type="text"
                            className="mt-[0.25vh] ml-[5vw] pl-[1vw] h-[4.5vh] w-[33vw] text-black border border-inactive_gray rounded-[0.5vh]"
                            value={editValues.first_name || ''}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col mt-[3vh]">
                        <div className="text-settings text-[2vh] ml-[1.5vw]">Last Name</div>
                        <input
                            type="text"
                            className="mt-[0.25vh] ml-[1vw] pl-[1vw] h-[4.5vh] w-[25vw] text-black border border-inactive_gray rounded-[0.5vh]"
                            value={editValues.last_name || ''}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            />
                    </div>
                </div>
                <div className="ml-[4.75vw] mt-[2vh] h-[0.075vh] bg-black w-[59.2vw]"></div>
                <div className="flex flex-row">
                    <div className="flex flex-col mt-[1.5vh]">
                        <div className="text-settings text-[2vh] ml-[5.5vw]">Hometown</div>
                        <input
                            type="text"
                            className="mt-[0.25vh] ml-[5vw] pl-[1vw] h-[4.5vh] w-[25vw] text-black border border-inactive_gray rounded-[0.5vh]"
                            value={editValues.hometown || ''}
                            onChange={(e) => handleInputChange('hometown', e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col mt-[1.5vh]">
                        <div className="text-settings text-[2vh] ml-[1.5vw]">Gender</div>
                        <select
                            type="text"
                            className="mt-[0.25vh] ml-[1vw] pl-[1vw] h-[4.5vh] w-[10vw] text-black border border-inactive_gray rounded-[0.5vh]"
                            value={editValues.gender || ''}
                            onChange={(e) => handleInputChange('gender', e.target.value)}
                            >
                            {gender.map((gender, index) => (
                                            <option key={index} value={gender}>{gender}</option>
                                        ))}
                        </select>
                    </div>
                </div>
                <div className="mt-[2.5vh] text-settings text-[2vh] ml-[5.5vw]">Housing Preferance</div>
                <div className="mt-[1vh] ml-[4.5vw] flex flex-row">
                <input
                    type="checkbox"
                    id="dormCheckbox"
                    name="dormCheckbox"
                    value="dorms"
                    className="h-[2.8vh] w-[2.8vw] cursor-pointer"
                    checked={editValues.housing_preference}
                    onChange={(e) => handleCheckboxChange('housing_preference', e.target.checked)}
                />
                <div className="mt-[-0.4vh]">
                    <label htmlFor="dormCheckbox" className="text-black text-[2vh] ml-[0.25vw] mt-[-0.25vh] font-light">
                        Dorms
                    </label>
                </div>
                <input
                    type="checkbox"
                    id="apartmentCheckbox"
                    name="apartmentCheckbox"
                    value="apartments"
                    className="ml-[2vw] h-[2.8vh] w-[2.8vw] cursor-pointer"
                    checked={editValues.apartmentCheckbox}
                    onChange={(e) => handleCheckboxChange('apartmentCheckbox', e.target.checked)}
                />
                <div className="mt-[-0.4vh]">
                    <label htmlFor="apartmentCheckbox" className="text-black text-[2vh] ml-[0.25vw] font-light">
                        Apartments
                    </label>
                </div>
            </div>
            <div className="ml-[4.75vw] mt-[2vh] h-[0.075vh] bg-black w-[59.2vw]"></div>
            <div className="flex flex-row">
                    <div className="flex flex-col mt-[3vh]">
                        <div className="text-settings text-[2vh] ml-[5.5vw]">College</div>
                        <select
                            type="text"
                            className="mt-[0.25vh] ml-[5vw] pl-[1vw] h-[4.5vh] w-[20vw] text-black border border-inactive_gray rounded-[0.5vh]"
                            value={editValues.college || ''}
                            onChange={(e) => handleInputChange('college', e.target.value)}
                            >
                        {colleges.map((gender, index) => (
                                            <option key={index} value={gender}>{gender}</option>
                                        ))}
                        </select>
                    </div>
                    <div className="flex flex-col mt-[3vh]">
                        <div className="text-settings text-[2vh] ml-[1.5vw]">Graduation Year</div>
                        <select
                            type="text"
                            className="mt-[0.25vh] ml-[1vw] pl-[1vw] h-[4.5vh] w-[15.5vw] text-black border border-inactive_gray rounded-[0.5vh]"
                            value={editValues.graduating_year || ''}
                            onChange={(e) => handleInputChange('graduating_year', e.target.value)}
                            >
                        {gradYear.map((gender, index) => (
                                            <option key={index} value={gender}>{gender}</option>
                                        ))}
                        </select>
                    </div>
                </div>
                <div className="ml-[4.75vw] mt-[2vh] h-[0.055vh] bg-black w-[59.2vw]"></div>
                <div className="flex flex-row">
    <div className="flex flex-col mt-[3vh]">
        <div className="text-settings text-[2vh] ml-[5.5vw]">Contact Type</div>
        <select
            type="text"
            className="mt-[0.25vh] ml-[5vw] pl-[1vw] h-[4.5vh] w-[12vw] text-black border border-inactive_gray rounded-[0.5vh]"
            value={editValues.contact_type || ''}
            onChange={(e) => handleInputChange('contact_type', e.target.value)}
        >
            {contact.map((type, index) => (
                <option key={index} value={type}>{type}</option>
            ))}
        </select>
    </div>
    {editValues.contact_type === 'Phone' && (
        <div className="flex flex-col mt-[3vh]">
            <div className="text-settings text-[2vh] ml-[1.5vw]">Phone Number</div>
            <input
                type="text"
                className="mt-[0.25vh] ml-[1vw] pl-[1vw] h-[4.5vh] w-[23.5vw] text-black border border-inactive_gray rounded-[0.5vh]"
                value={editValues.contact_phone || ''}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
            />
        </div>
    )}
    {editValues.contact_type === 'Email' && (
        <div className="flex flex-col mt-[3vh]">
            <div className="text-settings text-[2vh] ml-[1.5vw]">Email Address</div>
            <input
                type="text"
                className="mt-[0.25vh] ml-[1vw] pl-[1vw] h-[4.5vh] w-[23.5vw] text-black border border-inactive_gray rounded-[0.5vh]"
                value={editValues.contact_email || ''}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
            />
        </div>
    )}
    {(editValues.contact_type === 'Snapchat' || editValues.contact_type === 'Instagram') && (
        <div className="flex flex-col mt-[3vh]">
            <div className="text-settings text-[2vh] ml-[1.5vw]">Username</div>
            <input
                type="text"
                className="mt-[0.25vh] ml-[1vw] pl-[1vw] h-[4.5vh] w-[23.5vw] text-black border border-inactive_gray rounded-[0.5vh]"
                value={editValues[`contact_${editValues.contact_type.toLowerCase()}`] || ''}
                onChange={(e) => handleInputChange(`contact_${editValues.contact_type.toLowerCase()}`, e.target.value)}
            />
        </div>
    )}
    </div>
    </div>
            <div className="ml-10 mt-[4vh] w-[80vw] mr-[1vw] flex flex-col">
                <button
                    className={`text-white rounded-[1vh] ml-[2.55vw] w-[12vw] h-[5vh] text-[1.25vw] ${isEdited ? 'bg-settings hover:bg-dark_maroon' : 'bg-inactive_gray'}`}
                    onClick={handleSaveChangesClick}
                    disabled={!isEdited}
                >
                    Apply
                </button>
            </div>
        </div>
    );
}
