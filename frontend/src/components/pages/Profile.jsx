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
  const [profileMode, setProfileMode] = useState(0);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await backend.get('/profile', {
        params: { user_id: currentUser.user_id, apartment: 1 },
        withCredentials: true,
      });
      const profileData = response.data;
      console.log(response.data);
      setProfile(profileData);
      setEditedProfile({ ...profileData, qnaAnswers: profileData.qnaAnswers || {}, apartmentData: profileData.apartmentData || {} })
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

  const handleTextChange = (event, questionId) => {
    const newText = event.target.value;
    setEditedProfile(prev => {
      const updatedQnaAnswers = [...prev.qnaAnswers];
      const answerIndex = updatedQnaAnswers.findIndex(ans => ans.question_id === questionId);

      if (answerIndex > -1) {
        updatedQnaAnswers[answerIndex] = { ...updatedQnaAnswers[answerIndex], special_text_field: newText };
      } else {
        updatedQnaAnswers.push({ question_id: questionId, special_text_field: newText });
      }

      return { ...prev, qnaAnswers: updatedQnaAnswers };
    });
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
        let newRent, newMove_in_date, newMove_out_date = null;

        const formattedQnaAnswers = editedProfile.qnaAnswers.map(answer => ({
          question_id: parseInt(answer.question_id, 10),
          option_id: answer.option_id,
          special_text_field: answer.textField
        }));

        const monthNumbers = {};

        for (let i = 58; i <= 69; i++) {
          const monthNumber = (i - 57).toString().padStart(2, '0');
          monthNumbers[i] = monthNumber;
        }

        for(let i = 0; i < editedProfile.qnaAnswers.length; i++){
          if(editedProfile.qnaAnswers[i].question_id == 15){
            newRent = parseInt(editedProfile.qnaAnswers[i].special_text_field);
          }else if(editedProfile.qnaAnswers[i].question_id == 13){
            newMove_in_date = "2024-" + monthNumbers[editedProfile.qnaAnswers[i].option_id] + "-01";
            console.log(newMove_in_date);
          }else if(editedProfile.qnaAnswers[i].question_id == 14){
            newMove_out_date = "2024-" + monthNumbers[editedProfile.qnaAnswers[i].option_id-12] + "-01";
            console.log(newMove_out_date);
          }
        }
        
        const payload = {
          user_id: currentUser.user_id,
          updating_apartment: 1,
          profile: {
            ...editedProfile,
            qnaAnswers: formattedQnaAnswers
          },
          apartmentInfo: {
            rent: newRent,
            move_in_date: newMove_in_date,
            move_out_date: newMove_out_date
          }
        };

        if (payload.apartmentInfo.rent < 100 || payload.apartmentInfo.rent > 9999){
          throw new Error('Rent out of bounds!')
        }
        await backend.put('/profile', payload);
        alert('Profile updated successfully!');
        setProfile({ ...editedProfile, apartmentData: payload.apartmentInfo || {}});
        setIsEditing(false);
        console.log("Rent:" + profile.apartmentData.rent + ", Move in Date: " + profile.apartmentData.move_in_date);
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
        apartmentData={isEditing ? editedProfile.apartmentData : profile.apartmentData}
        handleQnaChange={handleQnaChange}
        handleTextChange={handleTextChange}
        dormMode={profileMode}
      />
      <div className="absolute bottom-[3vh] ml-[70vw] space-x-[1vw] text-[1vw]">
        <button onClick={() => setProfileMode(0)}
          className="w-[8vh] h-[8vh] bg-maroon_new rounded-full text-center align-middle text-white font-bold hover:bg-red-600 shadow-md">Dorm</button>
        <button onClick={() => setProfileMode(1)}
          className="w-[8vh] h-[8vh] bg-gold rounded-full text-center align-middle text-white font-bold hover:bg-green-600 shadow-md">Apt.</button>
      </div>
    </div>
  );
}
