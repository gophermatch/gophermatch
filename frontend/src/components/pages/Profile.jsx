import React, { useState, useEffect } from 'react';
import backend from '../../backend';
import currentUser from '../../currentUser';
import Profile from '../ui-components/Profile'; // Import the Profile component

export default function UserProfile() {
    const [bio, setBio] = useState('');
    const [error, setError] = useState('');

    // Fetch the current bio when the component mounts
    useEffect(() => {
        if (currentUser.logged_in) {
            fetchBio();
        }
    }, []);

    // Function to fetch the current bio
    const fetchBio = async () => {
        try {
            const response = await backend.get("/profile", { params: { user_id: currentUser.user_id }, withCredentials: true });
            setBio(response.data.bio || ''); // Assuming 'bio' is the key in the response object
        } catch (error) {
            console.error('Error fetching bio:', error);
            setError('Failed to fetch bio');
        }
    };

    // Function to save the updated bio
    const saveBio = async () => {
        try {
            await backend.put("/profile", { user_id: currentUser.user_id, bio });
            alert('Bio updated successfully!');
        } catch (error) {
            console.error('Error updating bio:', error);
            setError('Failed to update bio');
        }
    };

    return (
        <div>
            {currentUser.logged_in ? (
                <>
                    <h2>{currentUser.email}'s Profile</h2>
                    <Profile
                        user_Id={currentUser.user_id}
                        editable={true}
                        bio={bio}
                        onBioChange={(e) => setBio(e.target.value)}
                        onSaveBio={saveBio}
                    />
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </>
            ) : (
                <p>Please log in to view your profile.</p>
            )}
        </div>
    );
}