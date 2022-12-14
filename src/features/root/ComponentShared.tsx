import dynamic from 'next/dynamic';
import React from 'react';
import { useSelector } from 'react-redux';
import {AppState} from '../../app/store';

const ComponentShared = () => {

  const isModalOpen = useSelector((state: AppState) => state.root.modal.isOpen);
  const Modal = dynamic(() => import('./Modal'), { ssr: false });

  return (
    <>
      {isModalOpen && <Modal />}
    </>
  );
};

export default ComponentShared;