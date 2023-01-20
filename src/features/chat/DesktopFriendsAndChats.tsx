import dynamic from 'next/dynamic';
import React from 'react';
import FriendsSideBar from '../friend/FriendsSideBar';
import { AppState } from '../../app/store';
import { useSelector } from 'react-redux';
import { isSomeChatActive } from './chatSlice';

const DesktopFriendsAndChats = () => {
  const isActive = useSelector((state: AppState) => isSomeChatActive(state));

  const ChatsTabs = dynamic(() => import('./ChatsTabs'), { ssr: false });

  return (
    <>
      <FriendsSideBar />
      {isActive && <ChatsTabs />}
    </>
  );
};

export default DesktopFriendsAndChats;