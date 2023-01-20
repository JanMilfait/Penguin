import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../app/store';
import s from 'styles/6_components/Modal.module.scss';


const ModalAlert = () => {

  const title = useSelector((state: AppState) => state.root.modal.props.title);
  const message = useSelector((state: AppState) => state.root.modal.props.message);

  return (
    <>
      <h2 className={s.modal__title}>{title}</h2>
      <p className={s.modal__message}>{message}</p>
    </>
  );
};

export default ModalAlert;