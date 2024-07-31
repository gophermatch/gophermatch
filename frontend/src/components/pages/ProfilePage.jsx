import React, { useState, useEffect } from 'react';
import { ProfileCard} from '../ui-components/ProfileCard';
import currentUser from '../../currentUser';
import { EditProfileCard } from '../ui-components/EditProfileCard';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(true);

  return isEditing ? <EditProfileCard user_id={currentUser.user_id} /> : <ProfileCard user_id={currentUser.user_id} />
}