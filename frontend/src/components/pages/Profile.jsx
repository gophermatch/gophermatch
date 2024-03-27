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
  const [firstPictureUrl, setFirstPictureUrl] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchUserData = async () => {
    const response = await backend.get('account/fetch', {
      params: {
        user_id: currentUser.user_id},
      withCredentials: true});

    console.log(response);

    if(response.status === 200) {
      return response.data.data[0];
    }else{
      console.log('Failed to fetch user data.');
    }
  }

  const userData = fetchUserData();

  const fetchFirstPictureUrl = async () => {
    try {
      const response = await backend.get('/profile/user-pictures', {
        params: { user_id: 54 },
        withCredentials: true,
      });
      if (response.data && response.data.pictureUrls && response.data.pictureUrls.length > 0) {
        setFirstPictureUrl(response.data.pictureUrls[0]);
      } else {
        console.log('No pictures found for this user.');
      }
    } catch (error) {
      console.error('Error fetching picture URL:', error);
    }
  };

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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('user_id', currentUser.user_id);
    formData.append('pic_number', 1);

    try {
      const response = await backend.post('/profile/upload-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('File uploaded successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file.');
    }
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleChangeProfilePicture = () => {
    // Navigate to the PicUpload page
    // You can use React Router for this
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
        <div className={"flex justify-center m-auto w-[20vw] space-x-[15vw]"}>
          <button className={"absolute mt-[2vh] text-[3.5vh] text-white h-[5vh] w-[7.5vw] rounded-[4vh] bg-maroon_new"} onClick={handleSaveChanges}>Save</button>
          <button className={"absolute mt-[2vh] text-[3.5vh] h-[5vh] w-[7.5vw] rounded-[4vh] bg-inactive_gray"} onClick={toggleEditMode}>Cancel</button>
          {/*<input type="file" onChange={handleFileChange} style={{ display: 'block', marginTop: '20px' }} />*/}
          {/*<button onClick={handleFileUpload}>Upload Picture</button>*/}
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
  )
  ;
}
