import React, { useState, useEffect } from 'react';
import Profile from '../ui-components/Profile';
import currentUser from '../../currentUser';
import backend from '../../backend';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await backend.get('/profile', {
        params: { user_id: currentUser.user_id },
        withCredentials: true,
      });
      const profileData = response.data;
      console.log('Incoming data', profileData);
      // Initialize qnaAnswers if undefined
      setProfile(profileData);
      setEditedProfile({ ...profileData, qnaAnswers: profileData.qnaAnswers || {} });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to fetch profile');
    }
  };

  const handleBioChange = (event) => {
    const newBio = event.target.value;
    setEditedProfile(prev => ({
      ...prev,
      bio: newBio
    }));
  };


  const handleQnaChange = (event, questionId) => {
    const optionId = parseInt(event.target.value, 10); // Convert to integer
    setEditedProfile(prev => {
      const updatedQnaAnswers = [...prev.qnaAnswers];
      const answerIndex = updatedQnaAnswers.findIndex(ans => ans.question_id === questionId);

      if (answerIndex > -1) {
        // Update existing answer
        updatedQnaAnswers[answerIndex] = { ...updatedQnaAnswers[answerIndex], option_id: optionId };
      } else {
        // Add new answer
        updatedQnaAnswers.push({ question_id: questionId, option_id: optionId });
      }

      return { ...prev, qnaAnswers: updatedQnaAnswers };
    });
  };



  const toggleEditMode = () => {
    if (isEditing) {
      // Reset editedProfile to profile when canceling edit
      setEditedProfile(profile);
    }
    setIsEditing(prev => !prev);
  };

  const handleSaveChanges = async () => {
    try {
      // Transform qnaAnswers to an array of objects with question_id (as a number) and option_id
      const formattedQnaAnswers = editedProfile.qnaAnswers.map(answer => ({
        question_id: parseInt(answer.question_id, 10), // Convert question_id to a number
        option_id: answer.option_id
      }));

      const payload = {
        user_id: currentUser.user_id,
        profile: {
          ...editedProfile,
          qnaAnswers: formattedQnaAnswers
        },
      };

      console.log("Formatted payload:", payload);

      await backend.put('/profile', payload);
      alert('Profile updated successfully!');
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };


  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <p>Loading profile...</p>;
  }

  return (
    <div>
      <Profile
        data={profile}
        editable={isEditing}
        editedBio={isEditing ? editedProfile.bio : profile.bio}
        handleBioChange={handleBioChange}
        qnaAnswers={isEditing ? editedProfile.qnaAnswers : profile.qnaAnswers}
        handleQnaChange={handleQnaChange}
      />

      {isEditing && (
        <>
          <button onClick={handleSaveChanges}>Save Changes</button>
          <button onClick={toggleEditMode}>Cancel</button>
        </>
      )}
      {!isEditing && (
        <button onClick={toggleEditMode}>Edit Profile</button>
      )}
    </div>
  );
}
