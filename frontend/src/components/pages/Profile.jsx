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
  const [top5, setTop5] = useState(['', '', '', '', '']);
  const [top5Question, setTop5Question] = useState('Top 5 cakes');

  useEffect(() => {
    backend.get('/profile/get-topfive', {params: {user_id: currentUser.user_id}}).then((res) => {
      const top5Inputs = [
        res.data.input1,
        res.data.input2,
        res.data.input3,
        res.data.input4,
        res.data.input5
      ];
      const top5Question = res.data.question;
      setTop5(top5Inputs);
      setTop5Question(top5Question);
    })
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
    console.log(currentUser.user_id);
    console.log(top5Question);
    console.log(top5[0]);
    console.log(top5[1]);
    console.log(top5[2]);
    console.log(top5[3]);
    console.log(top5[4]);

    backend.put('/profile/insert-topfive', {
      user_id: currentUser.user_id,
      question: top5Question,
      input1: top5[0],
      input2: top5[1],
      input3: top5[2],
      input4: top5[3],
      input5: top5[4]
    }).then(res => console.log("Success saving top5: ", res))
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
        backend.put('/profile')
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
        top5={top5}
        setTop5={setTop5}
        top5Question={top5Question}
        setTop5Question={setTop5Question}
        dormMode={profileMode}
      />
      <div className="absolute bottom-[3vh] ml-[70vw] space-x-[1vw] text-[1vw] z-10">
        <button onClick={() => setProfileMode(0)}
          className="w-[8vh] h-[8vh] bg-maroon_new rounded-full text-center align-middle text-white font-bold hover:bg-red-600 shadow-md">Dorm</button>
        <button onClick={() => setProfileMode(1)}
          className="w-[8vh] h-[8vh] bg-gold rounded-full text-center align-middle text-white font-bold hover:bg-green-600 shadow-md">Apt.</button>
      </div>
      {!isEditing && (
        <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center">
          <button className="text-white text-[2.5vh] ml-[15vw] h-[5vh] w-[6vw] mb-[6vh] bg-maroon_new hover:bg-maroon rounded-full" onClick={toggleEditMode}>
            Edit
          </button>
        </div>
      )}
      {isEditing && (
        <div className="fixed bottom-0 left-0 right-0 flex justify-center">
          <button className="text-white text-[2.5vh] h-[5vh] w-[8vw] ml-[14vw] mb-[6vh] bg-maroon_new hover:bg-maroon rounded-full mr-4" onClick={handleSaveChanges}>
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
