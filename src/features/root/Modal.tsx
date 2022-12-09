import React, { useEffect } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import {AppDispatch, AppState} from '../../app/store';
import s from 'styles/6_components/Modal.module.scss';
import {setCloseModal} from './rootSlice';
import ModalAlert from './ModalAlert';
import ModalConfirm from './ModalConfirm';
import ModalForm from './ModalForm';
import ModalPrompt from './ModalPrompt';
import { XCircle, XCircleFill, CheckCircleFill, XOctagonFill, ExclamationTriangleFill, InfoCircleFill, QuestionCircleFill  } from 'react-bootstrap-icons';

const Modal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [closeHover, setCloseHover] = React.useState(false);

  const modalContent = React.useRef<HTMLDivElement>(null);
  const type = useSelector((state: AppState) => state.root.modal.props.type);
  const icon = useSelector((state: AppState) => state.root.modal.props.icon);
  const clickOutside = useSelector((state: AppState) => state.root.modal.props.clickOutside);


  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        dispatch(setCloseModal(null));
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!clickOutside) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (modalContent.current && !modalContent.current.contains(event.target as Node)) {
        dispatch(setCloseModal(null));
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [clickOutside, modalContent]);


  if (!type) return;

  const iconMap = {
    success: <CheckCircleFill className="text-success" />,
    error: <XOctagonFill className="text-danger" />,
    warning: <ExclamationTriangleFill className="text-warning" />,
    info: <InfoCircleFill className="text-info" />,
    question: <QuestionCircleFill className="text-primary" />
  };

  return (
    <div className={s.modal}>
      <div className="container">
        <div ref={modalContent} className={s.modal__content}>
          <div className={s.modal__close} onClick={() => dispatch(setCloseModal(null))} onMouseOver={() => setCloseHover(true)} onMouseOut={() => setCloseHover(false)}>
            {closeHover ? <XCircleFill /> : <XCircle />}
          </div>
          {icon ? <div className={s.modal__icon}>{iconMap[icon]}</div> : <div className="mb-5"></div>}
          {type === 'alert' && <ModalAlert />}
          {type === 'confirm' && <ModalConfirm />}
          {type === 'prompt' && <ModalPrompt />}
          {type === 'form' && <ModalForm />}
        </div>
      </div>
    </div>
  );
};

export default Modal;