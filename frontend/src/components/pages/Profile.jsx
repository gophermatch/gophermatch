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
      {isEditing && (
        <div className={"flex justify-center m-auto w-[20vw] space-x-[5vw]"}>
          <button className={"absolute mt-[2vh] text-[3.5vh] text-white h-[5vh] w-[7.5vw] rounded-[4vh] bg-maroon_new"} onClick={handleSaveChanges}>Save</button>
          <button className={"absolute mt-[2vh] text-[3.5vh] h-[5vh] w-[7.5vw] rounded-[4vh] bg-inactive_gray"} onClick={toggleEditMode}>Cancel</button>
        </div>
      )}
      {!isEditing && (
        <div className={"w-[10vh] m-auto"}>
          <button className={"absolute px-[5vh] mt-[2vh] text-[3.5vh] text-white h-[5vh] rounded-[4vh] bg-maroon_new"} onClick={toggleEditMode}>Edit</button>
        </div>
      )}
      <Profile
        user_data={currentUser.user_data}
        editable={isEditing}
        editedBio={isEditing ? editedProfile.bio : profile.bio}
        handleBioChange={handleBioChange}
        qnaAnswers={isEditing ? editedProfile.qnaAnswers : profile.qnaAnswers}
        handleQnaChange={handleQnaChange}
      />
    </div>
  );
}
