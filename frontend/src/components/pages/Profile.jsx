import React, { useState, useEffect } from 'react';
import Profile from '../ui-components/Profile';
import currentUser from '../../currentUser';
import backend from '../../backend';
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [editedProfile, setEditedProfile] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
    const optionId = parseInt(event.target.value, 10);
    setEditedProfile(prev => {
      const updatedQnaAnswers = [...prev.qnaAnswers];
      const answerIndex = updatedQnaAnswers.findIndex(ans => ans.question_id === questionId);

      if (answerIndex > -1) {
        updatedQnaAnswers[answerIndex] = { ...updatedQnaAnswers[answerIndex], option_id: optionId };
      } else {
        updatedQnaAnswers.push({ question_id: questionId, option_id: optionId });
      }

      return { ...prev, qnaAnswers: updatedQnaAnswers };
    });
  };

  const toggleEditMode = () => {
    if (isEditing) {
      setEditedProfile(profile);
    }
    setIsEditing(prev => !prev);
  };

  const handleSaveChanges = async () => {
    try {
      const formattedQnaAnswers = editedProfile.qnaAnswers.map(answer => ({
        question_id: parseInt(answer.question_id, 10),
        option_id: answer.option_id
      }));

      const payload = {
        user_id: currentUser.user_id,
        profile: {
          ...editedProfile,
          qnaAnswers: formattedQnaAnswers
        },
      };

      await backend.put('/profile', payload);
      alert('Profile updated successfully!');
      setProfile(editedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
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
        user_data={currentUser.user_data}
        editable={isEditing}
        editedBio={isEditing ? editedProfile.bio : profile.bio}
        handleBioChange={handleBioChange}
        qnaAnswers={isEditing ? editedProfile.qnaAnswers : profile.qnaAnswers}
        handleQnaChange={handleQnaChange}
      />
      {!isEditing && (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center mb-4">
          <button className="text-white text-[2.5vh] ml-[15vw] h-[5vh] w-[6vw] mb-[4vh] bg-maroon_new hover:bg-maroon rounded-full" onClick={toggleEditMode}>
            Edit
          </button>
        </div>
      )}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center mb-4">
          <button className="text-white text-[2.5vh] h-[5vh] w-[8vw] ml-[14vw] mb-[5vh] bg-maroon_new hover:bg-maroon rounded-full mr-4" onClick={handleSaveChanges}>
            Save
          </button>
          <button className="text-[2.5vh] h-[5vh] w-[8vw] bg-inactive_gray mb-[5vh] rounded-full" onClick={toggleEditMode}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );  
}
