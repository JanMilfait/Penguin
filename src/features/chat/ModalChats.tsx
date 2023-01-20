import React from 'react';
import AllChats from './AllChats';
import s from 'styles/6_components/NavModal.module.scss';

const ModalChats = () => {
  return (
    <div className={s.navModal}>
      <AllChats />
    </div>
  );
};

export default ModalChats;