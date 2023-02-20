import dynamic from 'next/dynamic';
import React from 'react';
import { useSelector } from 'react-redux';
import {AppState} from '../../app/store';
import {onHiddenNavRoute} from '../root/rootSlice';

const Chats = () => {
  const id = useSelector((state: AppState) => state.auth.data?.id);
  const isAuth = typeof id === 'number';
  const isHidden = useSelector((state: AppState) => onHiddenNavRoute(state));
  const isMobile = useSelector((state: AppState) => state.root.isMobile);
  const DesktopFriendsAndChats = dynamic(() => import('features/chat/DesktopFriendsAndChats'), { ssr: true });
  const MobileFriendsAndChats = dynamic(() => import('features/chat/MobileFriendsAndChats'), { ssr: true });

  return (
    <>
      {isAuth && !isHidden && (!isMobile ? <DesktopFriendsAndChats /> : <MobileFriendsAndChats />)}
    </>
  );
};

export default React.memo(Chats);