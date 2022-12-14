import React, { useEffect } from 'react';
import s from '../../styles/6_components/Modal.module.scss';
import { AppState } from '../../app/store';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch } from 'app/store';
import { setCloseModal } from './rootSlice';

const ModalPrompt = () => {
  const [text, setText] = React.useState('');
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [firstText, setFirstText] = React.useState(true);

  const dispatch = useDispatch<AppDispatch>();
  const tag = useSelector((state: AppState) => state.root.modal.request!.tag);
  const data = useSelector((state: AppState) => state.root.modal.request!.data);
  const title = useSelector((state: AppState) => state.root.modal.props.title);
  const message = useSelector((state: AppState) => state.root.modal.props.message);
  const button = useSelector((state: AppState) => state.root.modal.props.button) ?? 'Send';

  useEffect(() => {
    if (firstText) {
      setFirstText(false);
      return;
    }
    text.length > 0
      ? setIsInvalid(false)
      : setIsInvalid(true);
  }, [text]);

  const setResponse = () => {
    if (text.length === 0) {
      setIsInvalid(true);
      return;
    }

    dispatch(setCloseModal({
      tag: tag,
      data: {
        ...data,
        textarea: text
      }
    }));
  };

  return (
    <>
      <h2 className={s.modal__title}>{title}</h2>
      <textarea
        className={isInvalid ? 'isInvalidTextarea' : ''}
        placeholder={message}
        rows={3}
        maxLength={500}
        onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
        autoFocus
      ></textarea>
      <div className="row mt-3">
        <div className="col">
          <button className="button--small button--grayed" onClick={() => dispatch(setCloseModal(null))}>Cancel</button>
        </div>
        <div className="col-auto">
          <button className="button--small" disabled={isInvalid} onClick={setResponse}>{button}</button>
        </div>
      </div>
    </>
  );
};

export default ModalPrompt;