import ProfileProgress from 'features/auth/ProfileProgress';
import React from 'react';
import Banner from './Banner';

const Sidebar = () => {
  return (
    <>
      <ProfileProgress />
      <Banner />
    </>
  );
};

export default Sidebar;