import React from 'react';
import { useSelector } from 'react-redux';
import s from 'styles/6_components/MobileChats.module.scss';
import ChatMobileButton from './ChatMobileButton';
import { AppState} from '../../app/store';
import dynamic from 'next/dynamic';

const MobileFriendsAndChats = () => {
  const isExpanded = useSelector((state: AppState) => state.chat.expandChats);
  const ChatMobileWindow = dynamic(() => import('./ChatMobileWindow'), { ssr: false });

  return (
    <div className={s.mobileChats}>
      <div className={s.mobileChats__container}>
        {isExpanded && <ChatMobileWindow/>}
        <ChatMobileButton />
      </div>
    </div>
  );
};

export default MobileFriendsAndChats;