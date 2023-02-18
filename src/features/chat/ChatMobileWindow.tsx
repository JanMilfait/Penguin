import React, {useEffect, useRef } from 'react';
import s from 'styles/6_components/MobileChats.module.scss';
import AllChats from './AllChats';
import {AppDispatch, AppState} from '../../app/store';
import {useDispatch, useSelector } from 'react-redux';
import Chat from './Chat';
import FriendsHorizontal from 'features/friend/FriendsHorizontal';
import { setVirtualKeyboard } from './chatSlice';

const ChatMobileWindow = () => {
  const dispatch = useDispatch<AppDispatch>();
  const windowRef = useRef<HTMLDivElement>(null);
  const activeChat = useSelector((state: AppState) => state.chat.activeChats[0]);

  /**
   * Set Virtual Keyboard height
   */
  useEffect(() => {
    if (!windowRef.current) return;
    const initialHeight = windowRef.current.clientHeight;

    const handleResize = () => {
      if (!windowRef.current || !initialHeight) return;
      const keyboardHeight = initialHeight - windowRef.current.clientHeight;

      keyboardHeight > 100
        ? dispatch(setVirtualKeyboard(keyboardHeight))
        : dispatch(setVirtualKeyboard(0));
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  return (
    <div ref={windowRef} className={s.mobileChats__window}>
      {!activeChat
        ? <div className="d-flex flex-column h-100">
          <AllChats style={{padding: '16px'}} />
          <div className={s.mobileChats__friends}>
            <div className="p-2">
              <p className="fw-bold">Friends</p>
              <FriendsHorizontal />
            </div>
          </div>
        </div>
        : <Chat chatId={activeChat.id} />
      }
    </div>
  );
};

export default ChatMobileWindow;