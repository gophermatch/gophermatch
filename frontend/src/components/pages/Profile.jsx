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
  const [selectedButton, setSelectedButton] = useState('dorm');

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

  const handleButtonClick = (mode) => {
    setProfileMode(mode);
    setSelectedButton(mode === 0 ? 'dorm' : 'apartment');
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
      <span className="absolute right-[9vw] top-[15vh] scale-90 hover:scale-110 transition-transform">
      <button onClick={toggleEditMode}>
        <svg width="8vw" height="8vh" viewBox="0 0 24 24" stroke="maroon" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z" stroke="black" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13" stroke="maroon" stroke-width="0.9" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </span>
    
    
        )}
      <div className="absolute top-[9vh] ml-[11vw] text-[1vw] z-10">
  <button
    onClick={() => handleButtonClick(0)}
    className={`w-[16vh] rounded-tl-[1vh] rounded-tr-[1vh] text-center align-middle font-bold shadow-md ${
      selectedButton === 'dorm' ? 'bg-maroon_new text-white h-[4.25vh] mb-[0.25vh]' : 'bg-maroon_dark text-inactive_gray hover:bg-maroon_transparent h-[4vh]'
    }`}
  >
    Dorm
  </button>
  <button
    onClick={() => handleButtonClick(1)}
    className={`w-[16vh] rounded-tl-[1vh] rounded-tr-[1vh] text-center align-middle font-bold shadow-md ${
      selectedButton === 'apartment' ? 'bg-maroon_new text-white h-[4.25vh] mb-[0.25vh]' : 'bg-maroon_dark text-inactive_gray hover:bg-maroon_transparent h-[4vh]'
    }`}
  >
    Apartment
  </button>
</div>
      {isEditing && (
        <div className="fixed top-[12vh] right-[20vh] flex justify-center">
          <button onClick={handleSaveChanges}>
          <svg 
                  width="5vw" 
                  height="12vh" 
                  viewBox="0 0 64 64" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none"
                  className="hover:stroke-gold mr-[1vw] scale-90 hover:scale-125 transition-transform" 
                  stroke="maroon"><polyline points="12 28 28 44 52 20"/>
                  </svg>

          </button>
          <button className="text-[7vh] mb-[1vh] text-gold font-thin hover:text-maroon scale-90 hover:scale-125 transition-transform" onClick={toggleEditMode}>
            x
          </button>
        </div>
      )}
    </div>
  );  
}
