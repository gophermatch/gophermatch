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
  const [dorm, setDorm] = useState(true);
  const [apartment, setApartment] = useState(false);
  const [both, setBoth] = useState(false);

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

  function changeSearchType(decision){
    if(decision == "dorm"){
        setDorm(true);
        setBoth(false);
        setApartment(false);
    }else if(decision == "both"){
        setDorm(false);
        setBoth(true);
        setApartment(false);
    } else if(decision == "apartment"){
        setDorm(false);
        setBoth(false);
        setApartment(true);
    }
  }

  return (
    <div>
      {isEditing && (
        <div className={"flex justify-center m-auto w-[20vw] space-x-[5vw]"}>
          <button className={"absolute mt-[4vh] text-[2.3vh] text-white h-[4vh] w-[6.5vw] rounded-[4vh] mr-[10vw] bg-maroon_new"} onClick={handleSaveChanges}>Save</button>
          <button className={"absolute mt-[4vh] text-[2.3vh] h-[4vh] w-[6.5vw] rounded-[4vh] mr-[0vw] bg-inactive_gray"} onClick={toggleEditMode}>Cancel</button>
        </div>
      )}
      {!isEditing && (
        <div className={"w-[10vh] m-auto"}>
          <button className={"absolute mt-[3.5vh] text-[2.3vh] text-white h-[4vh] w-[6vw] rounded-[4vh] bg-maroon_new hover:bg-maroon"} onClick={toggleEditMode}>Edit</button>
        </div>
      )}
      <Profile
        user_data={currentUser.user_data}
        editable={isEditing}
        editedBio={isEditing ? editedProfile.bio : profile.bio}
        handleBioChange={handleBioChange}
        qnaAnswers={isEditing ? editedProfile.qnaAnswers : profile.qnaAnswers}
        handleQnaChange={handleQnaChange}
        dormMode={dorm}
        apartmentMode={apartment || both}
      />
      <div className="absolute bottom-[3vh] ml-[70vw] space-x-[1vw] text-[1vw]">
        <button onClick={() => changeSearchType("dorm")}
          className="w-[8vh] h-[8vh] bg-maroon_new rounded-full text-center align-middle text-white font-bold hover:bg-red-600 shadow-md">
          <p>Dorm</p>
        </button>
        <button onClick={() => changeSearchType("both")}
          className="w-[8vh] h-[8vh] bg-offwhite border-black border-[1px] rounded-full text-center align-middle text-black font-bold hover:bg-slate-300 shadow-md">Both</button>
        <button onClick={() => changeSearchType("apartment")}
          className="w-[8vh] h-[8vh] bg-gold rounded-full text-center align-middle text-white font-bold hover:bg-green-600 shadow-md">
          <p>Apt.</p>
        </button>
      </div>
    </div>
  );
}
