import backend from '../../backend';
import currentUser from '../../currentUser';
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Settings() {
    const [userInfo, setUserInfo] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [editKey, setEditKey] = useState(null);
    const [editValues, setEditValues] = useState({ contact_type: 'Phone'});
    const [isEdited, setIsEdited] = useState(false);
    const [userID, setUserID] = useState(currentUser.user_id);
    const navigate = useNavigate();

    const fetchUserInfo = async () => {
        try {
            const columnsToFetch = ['first_name', 'last_name', 'hometown', 'gender', 'housing_preference', 'graduating_year', 'college', 'contact_phone', 'contact_email', 'contact_snapchat', 'contact_instagram', 'international'];
            
            const response = await backend.get('/profile/get-gendata', {
                params: { 
                    user_id: userID,
                    filter: columnsToFetch 
                }
            });
            
            if (response.status === 200) {
                const data = response.data[0];
                const filteredData = Object.entries(data).filter(([key, value]) => 
                    key !== 'user_id' && key !== 'hear_about_us' && key !== 'date_of_birth'
                );
                setUserInfo(filteredData);
                setEditValues(Object.fromEntries(filteredData));
                
                // Determine contact_type based on non-empty contact field
                const contactFields = ['contact_phone', 'contact_email', 'contact_snapchat', 'contact_instagram'];
                for (const field of contactFields) {
                    if (data[field]) {
                        setEditValues(prev => ({ ...prev, contact_type: field.replace('contact_', '').charAt(0).toUpperCase() + field.replace('contact_', '').slice(1) }));
                        break;
                    }
                }
                
                return data;
            } else {
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        fetchUserInfo();
    }, [])

    const saveUserInfo = async () => {
        try {
            // Create a copy of editValues and remove contact_type
            const dataToSend = { ...editValues };
            delete dataToSend.contact_type;

            // Clear other contact fields based on selected contact_type
            const contactFields = ['contact_phone', 'contact_email', 'contact_snapchat', 'contact_instagram'];
            contactFields.forEach(field => {
                if (field !== `contact_${editValues.contact_type.toLowerCase()}`) {
                    dataToSend[field] = '';
                }
            });

            await backend.post('/profile/set-gendata', {
                user_id: userID,
                data: dataToSend,
            });
        } catch (error) {
            console.error('Error saving user data:', error);
        }
    }

    const handleInputChange = (field, value) => {
        let formattedValue = value;
        if (field === 'contact_phone') {
            formattedValue = formatPhoneNumber(value);
        }
        
        let updatedValues = {
            ...editValues,
            [field]: formattedValue,
        };

        // If changing contact_type, reset other contact fields
        if (field === 'contact_type') {
            updatedValues.contact_phone = '';
            updatedValues.contact_email = '';
            updatedValues.contact_snapchat = '';
            updatedValues.contact_instagram = '';
        }

        const hasChanged = JSON.stringify(updatedValues) !== JSON.stringify(editValues);
        setEditValues(updatedValues);
        setIsEdited(hasChanged);
    };

    const handleSaveChangesClick = async () => {
        setEditMode(false);
        setIsEdited(false);
        saveUserInfo();
        navigate('/match')
    }

    const handleEditClick = (key) => {
        setEditKey(key);
        setEditMode(true);
    };

    useEffect(() => {
        const housingPreference = userInfo.find(([key]) => key === 'housing_preference')?.[1] || '';
        setEditValues((prevValues) => ({
            ...prevValues
        }));
    }, [userInfo]);

    const handleCheckboxChange = (key, value) => {
        setEditValues((prevValues) => ({
            ...prevValues,
            [key]: value,
        }));
        setIsEdited(true);
    };

    const formatPhoneNumber = (value) => {
        const cleaned = ('' + value).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
        if (match) {
            return (!match[2] ? match[1] : '(' + match[1] + ') ' + match[2]) + (match[3] ? '-' + match[3] : '');
        }
        return value;
    };

    const colleges = ['CSE', 'CBS', 'Carlson', 'Design', 'CEHD', 'CFANS', 'Nursing', "CLA", 'Other'];
    const gradYear = ['2025', '2026', '2027', '2028', '2029', 'Other'];
    const gender = ['Male', 'Female', 'Non-binary', 'Other'];
    const contact = ['Phone', 'Email', 'Snapchat', 'Instagram'];

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
                    <div className="flex flex-col ml-[1.5vw] text-[2vh] mt-[1.5vh]">
                        <div className="text-settings text-[2vh] ml-[0.5vw] ">International Student?</div>
                        <select className="text-black mt-[0.25vh] h-[4.5vh] w-[21.5vw] border border-inactive_gray rounded-[0.5vh] cursor-pointer"
                                value={editValues.international || ''}
                                onChange={(e) => handleInputChange('international', e.target.value)}>
                            <option value="">Select an option</option>
                            <option value="1">Yes</option>
                            <option value="0">No</option>
                        </select>
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
                {/* <div className="mt-[2.5vh] text-settings text-[2vh] ml-[5.5vw]">Housing Preference</div> */}
                {/* <div className="mt-[1vh] ml-[4.5vw] flex flex-row">
                    <input
                        type="checkbox"
                        id="dormCheckbox"
                        name="dormCheckbox"
                        value="dorms"
                        className="h-[2.8vh] w-[2.8vw] cursor-pointer"
                        checked={editValues.dormCheckbox || false}
                        onChange={(e) => handleCheckboxChange('dormCheckbox', e.target.checked)}
                    /> */}
                    {/* <div className="mt-[-0.4vh]">
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
                        checked={editValues.apartmentCheckbox || false}
                        onChange={(e) => handleCheckboxChange('apartmentCheckbox', e.target.checked)}
                    />
                    <div className="mt-[-0.4vh]">
                        <label htmlFor="apartmentCheckbox" className="text-black text-[2vh] ml-[0.25vw] mt-[-0.25vh] font-light">
                            Apartments
                        </label>
                    </div>
                </div> */}
                <div className="ml-[4.75vw] mt-[2vh] h-[0.075vh] bg-black w-[59.2vw]"></div>
                <div className="flex flex-row">
                    <div className="flex flex-col mt-[1.5vh]">
                        <div className="text-settings text-[2vh] ml-[5.5vw]">Graduation Year</div>
                        <select
                            type="text"
                            className="mt-[0.25vh] ml-[5vw] pl-[1vw] h-[4.5vh] w-[10vw] text-black border border-inactive_gray rounded-[0.5vh]"
                            value={editValues.graduating_year || ''}
                            onChange={(e) => handleInputChange('graduating_year', e.target.value)}
                            >
                            {gradYear.map((gradYear, index) => (
                                            <option key={index} value={gradYear}>{gradYear}</option>
                                        ))}
                        </select>
                    </div>
                    <div className="flex flex-col mt-[1.5vh]">
                        <div className="text-settings text-[2vh] ml-[1.5vw]">College</div>
                        <select
                            type="text"
                            className="mt-[0.25vh] ml-[1vw] pl-[1vw] h-[4.5vh] w-[25vw] text-black border border-inactive_gray rounded-[0.5vh]"
                            value={editValues.college || ''}
                            onChange={(e) => handleInputChange('college', e.target.value)}
                            >
                            {colleges.map((college, index) => (
                                            <option key={index} value={college}>{college}</option>
                                        ))}
                        </select>
                    </div>
                </div>
                <div className="ml-[4.75vw] mt-[3vh] h-[0.055vh] bg-black w-[59.2vw]"></div>
                <div className="ml-[5.5vw] mt-[1.5vh] flex flex-row items-center">
                <div className="flex flex-col mt-[0vh]">
        <div className="text-settings text-[2vh]">Contact Type</div>
        <select
            type="text"
            className="ml-[-0.5vw] pl-[1vw] h-[4.5vh] w-[12vw] text-black border border-inactive_gray rounded-[0.5vh]"
            value={editValues.contact_type || ''}
            onChange={(e) => handleInputChange('contact_type', e.target.value)}
        >
            {contact.map((type, index) => (
                <option key={index} value={type}>{type}</option>
            ))}
        </select>
    </div>
    {editValues.contact_type === 'Phone' && (
        <div className="flex flex-col">
            <div className="text-settings text-[2vh] ml-[1.5vw]">Phone Number</div>
            <input
                type="text"
                className="ml-[1vw] pl-[1vw] h-[4.5vh] w-[23vw] text-black border border-inactive_gray rounded-[0.5vh]"
                value={editValues.contact_phone || ''}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
            />
        </div>
    )}
    {editValues.contact_type === 'Email' && (
        <div className="flex flex-col">
            <div className="text-settings text-[2vh] ml-[1.5vw]">Email Address</div>
            <input
                type="text"
                className="ml-[1vw] pl-[1vw] h-[4.5vh] w-[23vw] text-black border border-inactive_gray rounded-[0.5vh]"
                value={editValues.contact_email || ''}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
            />
        </div>
    )}
    {(editValues.contact_type === 'Snapchat' || editValues.contact_type === 'Instagram') && (
        <div className="flex flex-col">
            <div className="text-settings text-[2vh] ml-[1.5vw]">Username</div>
            <input
                type="text"
                className="ml-[1vw] pl-[1vw] h-[4.5vh] w-[23vw] text-black border border-inactive_gray rounded-[0.5vh]"
                value={editValues[`contact_${editValues.contact_type.toLowerCase()}`] || ''}
                onChange={(e) => handleInputChange(`contact_${editValues.contact_type.toLowerCase()}`, e.target.value)}
            />
        </div>
    )}
    </div>
    </div>
            <div className="ml-[2.55vw] mt-[4vh] w-[80vw] mr-[1vw] flex flex-col">
                <button
                    className={`text-white rounded-[1vh] ml-[2.55vw] w-[12vw] h-[5vh] text-[1.25vw] ${isEdited ? 'bg-settings hover:bg-dark_maroon' : 'bg-inactive_gray'}`}
                    onClick={handleSaveChangesClick}
                    disabled={!isEdited}
                    linkto="/match"
                >
                    Apply
                </button>
            </div>
        </div>
    );
}