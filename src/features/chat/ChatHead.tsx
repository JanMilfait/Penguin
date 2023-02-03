import React, { useMemo, useState } from 'react';
import s from '../../styles/6_components/Chats.module.scss';
import { Chat } from './chatSlice.types';
import { AppDispatch, AppState } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { DashCircle, DashCircleFill, XCircle, XCircleFill, ThreeDots } from 'react-bootstrap-icons';
import {deactivateChat, minimizeChat} from './chatSlice';
import ToggleModal from '../../components/ToggleModal';
import FriendAvatar from 'features/friend/FriendAvatar';
import dynamic from 'next/dynamic';

const ChatHead = ({chat}: {chat: Chat}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [minimizeHover, setMinimizeHover] = useState(false);
  const [closeHover, setCloseHover] = useState(false);
  const id = useSelector((state: AppState) => state.auth.data!.id);
  const closeTimeout = useSelector((state: AppState) => state.chat.animation.closeTimeout);
  const isMobile = useSelector((state: AppState) => state.root.isMobile);

  const ChatHeadDropdown = dynamic(() => import('./ChatHeadDropdown'), {ssr: false});

  const usersFiltered = useMemo(() => chat.users.filter((user) => user.id !== id), [chat.users.length]);


  const handleMinimizeChat = (e: any) => {
    const chatEl = (e.target as Element).closest('.' + s.activeChats__chat);
    chatEl?.classList.add(s.activeChats__chatClose);

    setTimeout(() => {
      dispatch(minimizeChat(chat.id));
    }, closeTimeout);
  };

  const handleCloseChat = (e: any) => {
    const chatEl = (e.target as Element).closest('.' + s.activeChats__chat);
    chatEl?.classList.add(s.activeChats__chatClose);

    setTimeout(() => {
      dispatch(deactivateChat(chat.id));
    }, closeTimeout);
  };


  return (
    <div className={s.activeChats__chatHead}>
      <div className="d-flex align-items-center mw-0">
        <div className="d-flex">
          {usersFiltered.map((user) => (
            <FriendAvatar
              key={user.id}
              className={s.activeChats__chatAvatar}
              classNameOnline={s.activeChats__online + ' ' + s.activeChats__chatOnline}
              classNameOffline={s.activeChats__offline + ' ' + s.activeChats__chatOffline}
              {...user}
              size={40}
            />
          ))}
        </div>
        <div className="d-flex flex-column mt-1 mw-0">
          <h3 className={s.activeChats__chatNames + ' text-truncate'}>
            {usersFiltered.map((user) => user.name).join(', ')}
          </h3>
          <p className={s.activeChats__chatType}>
            {chat.type === 'group' ? 'Group' : 'Private'}
          </p>
        </div>
      </div>
      <div className={s.activeChats__chatHeadButtons}>
        {!isMobile &&
          <div className="cp" onPointerOver={() => setMinimizeHover(true)} onPointerOut={() => setMinimizeHover(false)} onClick={handleMinimizeChat}>
            {minimizeHover ? <DashCircleFill size={23} /> : <DashCircle size={23} />}
          </div>
        }
        <div className="cp" onPointerOver={() => setCloseHover(true)} onPointerOut={() => setCloseHover(false)} onClick={handleCloseChat}>
          {closeHover ? <XCircleFill size={23} /> : <XCircle size={23} />}
        </div>
      </div>
      <div className={s.activeChats__settings}>
        <ToggleModal toggle={<ThreeDots size={18} />} modal={<ChatHeadDropdown id={chat.id} />} clickClose={true} hidden={false} />
      </div>
    </div>
  );
};

export default ChatHead;