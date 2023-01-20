import React from 'react';
import {setCloseModal} from './rootSlice';
import s from '../../styles/6_components/Modal.module.scss';
import {AppDispatch, AppState} from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';

const ModalConfirm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const tag = useSelector((state: AppState) => state.root.modal.request!.tag);
  const data = useSelector((state: AppState) => state.root.modal.request!.data);
  const title = useSelector((state: AppState) => state.root.modal.props.title);
  const message = useSelector((state: AppState) => state.root.modal.props.message);
  const button = useSelector((state: AppState) => state.root.modal.props.button) ?? 'Confirm';

  return (
    <>
      <h2 className={s.modal__title}>{title}</h2>
      <p className={s.modal__message}>{message}</p>
      <div className="row mt-3">
        <div className="col">
          <button className="button--small button--grayed" onClick={() => dispatch(setCloseModal(null))}>Cancel</button>
        </div>
        <div className="col-auto">
          <button className='button--small' onClick={() => dispatch(setCloseModal({tag, data}))}>{button}</button>
        </div>
      </div>
    </>
  );
};

export default ModalConfirm;