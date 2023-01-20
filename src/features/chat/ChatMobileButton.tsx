import React from 'react';
import s from 'styles/6_components/MobileChats.module.scss';
import { ChatDotsFill } from 'react-bootstrap-icons';
import { AppDispatch, AppState } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { setExpandChats } from './chatSlice';

const ChatMobileButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const closeTimeout = useSelector((state: AppState) => state.chat.animation.closeTimeout);
  const isExpanded = useSelector((state: AppState) => state.chat.expandChats);

  const handleClick = (e: React.MouseEvent) => {
    if (isExpanded) {
      const chatWindow = (e.target as Element).closest('.' + s.mobileChats__container)?.querySelector('.' + s.mobileChats__window);
      chatWindow?.classList.add(s.mobileChats__windowScaleDown);

      setTimeout(() => {
        dispatch(setExpandChats(false));
      }, closeTimeout);
    } else {
      dispatch(setExpandChats(true));
    }
  };

  return (
    <div className={s.mobileChats__button} onClick={handleClick}>
      <ChatDotsFill size={30} fill={'#fff'} />
    </div>
  );
};

export default ChatMobileButton;