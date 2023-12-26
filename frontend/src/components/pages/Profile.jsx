import { useState, useEffect } from 'react';
import Profile from '../ui-components/Profile';
import currentUser from '../../currentUser';
import backend from '../../backend'; // Import your backend setup here

export default function ProfilePage() {
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await backend.get("/profile", {
                params: { user_id: currentUser.user_id },
                withCredentials: true
            });
            setProfile(response.data);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setError('Failed to fetch profile');
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    if (!profile) {
        return <p>Loading profile...</p>;
        
    }
    console.log(profile);


    return <Profile data={profile} editable={false} />;
}
