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

        for (let i = 96; i <= 107; i++) {
          const monthNumber = (i - 95).toString().padStart(2, '0');
          monthNumbers[i] = monthNumber;
        }

        for(let i = 0; i < editedProfile.qnaAnswers.length; i++){
          if(editedProfile.qnaAnswers[i].question_id == 16){
            newRent = parseInt(editedProfile.qnaAnswers[i].special_text_field);
          }else if(editedProfile.qnaAnswers[i].question_id == 14){
            newMove_in_date = "2024-" + monthNumbers[editedProfile.qnaAnswers[i].option_id] + "-01";
            console.log(newMove_in_date);
          }else if(editedProfile.qnaAnswers[i].question_id == 15){
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
      {!isEditing && (
      <span className="absolute right-[10vw] top-[15vh] scale-90 hover:scale-110 transition-transform">
              <button onClick={toggleEditMode}>
                <svg 
                fill="maroon" 
                width="6vw" 
                height="7vh"
                viewBox="0 0 24 24" 
                strokeWidth="10"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M2,21H8a1,1,0,0,0,0-2H3.071A7.011,7.011,0,0,1,10,13a5.044,5.044,0,1,0-3.377-1.337A9.01,9.01,0,0,0,1,20,1,1,0,0,0,2,21ZM10,5A3,3,0,1,1,7,8,3,3,0,0,1,10,5ZM20.207,9.293a1,1,0,0,0-1.414,0l-6.25,6.25a1.011,1.011,0,0,0-.241.391l-1.25,3.75A1,1,0,0,0,12,21a1.014,1.014,0,0,0,.316-.051l3.75-1.25a1,1,0,0,0,.391-.242l6.25-6.25a1,1,0,0,0,0-1.414Zm-5,8.583-1.629.543.543-1.629L19.5,11.414,20.586,12.5Z"/></svg>
              </button>
            </span>
        )}
      <div className="absolute top-[2.75vh] ml-[40vw] space-x-[1vw] text-[1vw] z-10">
        <button onClick={() => setProfileMode(0)}
          className="w-[8vh] h-[8vh] bg-maroon_new rounded-full text-center align-middle text-white font-bold hover:bg-maroon_dark shadow-md">Dorm</button>
        <button onClick={() => setProfileMode(1)}
          className="w-[8vh] h-[8vh] bg-gold rounded-full text-center align-middle text-white font-bold hover:bg-green-600 shadow-md hover:bg-offgold">Apt.</button>
      </div>
      {isEditing && (
        <div className="fixed top-[12vh] right-[20vh] flex justify-center">
          <button onClick={handleSaveChanges}>
          <svg 
                  width="3vw" 
                  height="6vh" 
                  viewBox="0 0 64 64" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none"
                  className="hover:stroke-gold mr-[1vw]" 
                  stroke="maroon"><polyline points="12 28 28 44 52 20"/>
                  </svg>

          </button>
          <button className="text-[5vh] mb-[1vh] text-gold font-thin hover:text-maroon" onClick={toggleEditMode}>
            x
          </button>
        </div>
      )}
    </div>
  );  
}
