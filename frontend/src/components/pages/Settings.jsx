import React, { useState, useEffect } from 'react';
import backend from '../../backend';
import currentUser from '../../currentUser';



    export default function SettingsPage1() {
        const [p1settings, setP1Settings] = useState([]);
    
        useEffect(() => {
               
            const fetchUserInfo = async () => {
                console.log('Before try block')
                try {
                    console.log('In try block')
                    const response = await backend.get('/profile/getProfile', {
                        params: {user_id: currentUser.user_id},
                        withCredentials: true
                    });
                    console.log('after response')
                    if (response.status === 200) {
                        console.log('If statement, user info fetched')
                        const user = response.data;
                        return user;
                    }
                    else {
                        console.log(`Did not correctly fetch user info. Status: ${response.status}`);
                        return null;
                    }
                } catch (error) {
                    console.error('Error fetching user info:', error);
                    return null;
                }
            };
    
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
                const response = await backend.post('/profile/updateProfile', {
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
    