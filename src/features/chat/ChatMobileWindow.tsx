import React from 'react';
import s from 'styles/6_components/MobileChats.module.scss';
import AllChats from './AllChats';
import {AppState} from '../../app/store';
import { useSelector } from 'react-redux';
import Chat from './Chat';
import FriendsHorizontal from 'features/friend/FriendsHorizontal';

const ChatMobileWindow = () => {
  const activeChat = useSelector((state: AppState) => state.chat.activeChats[0]);

  return (
    <div className={s.mobileChats__window}>
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