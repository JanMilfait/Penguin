import React from 'react';
import {AppState} from '../../app/store';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';

const ProfileInfoResult = () => {
  const id = useSelector((state: AppState) => state.auth.data?.id);
  const editId = useSelector((state: AppState) => state.auth.profile.edit);
  const isEditing = editId === id;

  const ProfileInfo = dynamic(() => import('features/auth/ProfileInfo'), { ssr: true });
  const ProfileInfoEdit = dynamic(() => import('features/auth/ProfileInfoEdit'), { ssr: true });

  return (
    <>
      {!isEditing ? <ProfileInfo /> : <ProfileInfoEdit />}
    </>
  );
};

export default ProfileInfoResult;