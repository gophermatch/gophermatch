import React, { useState, useEffect } from 'react';
import backend from '../../backend';

console.log('Does anything happen here?');
const fetchUserInfo = async () => {
    console.log('before');
    try {
        const response = await backend.get('/settings');
        if (response.ok) {
            console.log('If statement, user info fetched')
        }
        if (!response.ok) {
            console.log('If statement, user info didnt fetch');
            throw new Error(`Failed to fetch user info. Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        return null; // Return null or another default value instead of re-throwing the error
    }
};


export default function SettingsPage1() {
    const [p1settings, setP1Settings] = useState([]);
    console.log('before in settings');

    useEffect(() => {
        fetchUserInfo().then(user => {
            if (user) {
                const { name, email, password, gender, dob, college, major, housingPreference } = user;
                setP1Settings([
                    { "setting": "Name", "value": name },
                    { "setting": "Email", "value": email },
                    { "setting": "Password", "value": password },
                    { "setting": "Gender", "value": gender },
                    { "setting": "Date of Birth", "value": dob },
                    { "setting": "College", "value": college },
                    { "setting": "Major", "value": major },
                    { "setting": "Housing Preference", "value": housingPreference }
                ]);
            }
        }).catch(error => {
            console.error('Error fetching user info:', error);
        });
    }, []);

    const handleSaveSetting = async (setting, value) => {
        try {
            const response = await backend.post('/settings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    setting: setting,
                    value: value
                })
            });

            if (response.ok) {
                console.log(`Setting "${setting}" saved successfully.`);
            } else {
                console.error('Failed to save setting:', response.statusText);
            }
        } catch (error) {
            console.error('Error saving setting:', error);
        }
    };

    return (
        <div className="flex flex-col h-screen w-screen font-lora bg-doc">
            <h1 className="ml-10 mt-10 font-lora text-4xl text-maroon">Settings</h1>
            <div className="ml-10 mt-20 h-1 w-[44.6rem] bg-maroon"></div>
            <div className="ml-10 mt-20 flex flex-col w-full flex-grow items-start text-maroon text-xl font-lora">
                {p1settings.map((setting, index) => (
                    <Setting key={index} text={setting.setting} value={setting.value} onSave={handleSaveSetting} />
                ))}
            </div>
        </div>
    );
}

function Setting(props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedValue, setEditedValue] = useState('');

    const handleEdit = () => {
        setIsEditing(true);
        setEditedValue(props.value);
    };

    const handleSave = () => {
        setIsEditing(false);
        props.onSave(props.text, editedValue);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };

    return (
        <div className="flex justify-between w-full">
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', width: '100%' }}>
                {isEditing ? (
                    <input
                        type="text"
                        value={editedValue}
                        onChange={(e) => setEditedValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyPress={handleKeyPress}
                        autoFocus
                        placeholder={`Enter ${props.text.toLowerCase()}`}
                    />
                ) : (
                    <>
                        <p>{props.text}: {editedValue || (props.value ? props.value : 'Not set')}</p> {}
                        <span className="flex flex-col mr-[50rem] mt-2 text-maroon hover:text-gold cursor-pointer" onClick={handleEdit}>
                            Edit
                        </span>
                    </>
                )}
            </label>
        </div>
    );
}
