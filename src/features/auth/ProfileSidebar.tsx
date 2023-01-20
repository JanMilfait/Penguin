import React from 'react';
import s from 'styles/6_components/Profile.module.scss';
import ProfileFriends from './ProfileFriends';
import ProfileInfoShowcase from './ProfileInfoShowcase';

const ProfileSidebar = () => {
  return (
    <div className={s.profile__sidebar}>
      <ProfileInfoShowcase />
      <ProfileFriends />
    </div>
  );
};

export default ProfileSidebar;