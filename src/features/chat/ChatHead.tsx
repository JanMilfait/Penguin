import React, { useMemo } from 'react';
import s from '../../styles/6_components/Chats.module.scss';
import { Chat } from './chatSlice.types';
import { AppDispatch, AppState } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { DashCircle, DashCircleFill, XCircle, XCircleFill, ThreeDots } from 'react-bootstrap-icons';
import {deactivateChat, minimizeChat} from './chatSlice';
import ToggleModal from '../../components/ToggleModal';
import ChatHeadDropdown from './ChatHeadDropdown';
import FriendAvatar from 'features/friend/FriendAvatar';

const ChatHead = ({chat}: {chat: Chat}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [minimizeHover, setMinimizeHover] = React.useState(false);
  const [closeHover, setCloseHover] = React.useState(false);
  const id = useSelector((state: AppState) => state.auth.data!.id);
  const closeTimeout = useSelector((state: AppState) => state.chat.animation.closeTimeout);
  const isMobile = useSelector((state: AppState) => state.root.isMobile);

  const usersFiltered = useMemo(() => chat.users.filter((user) => user.id !== id), [chat.users.length]);


  const handleMinimizeChat = (e: React.MouseEvent) => {
    const chatEl = (e.target as Element).closest('.' + s.activeChats__chat);
    chatEl?.classList.add(s.activeChats__chatClose);

    setTimeout(() => {
      dispatch(minimizeChat(chat.id));
    }, closeTimeout);
  };

  const handleCloseChat = (e: React.MouseEvent) => {
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
          <div className="cp" onMouseOver={() => setMinimizeHover(true)} onMouseOut={() => setMinimizeHover(false)} onClick={(e) => handleMinimizeChat(e)}>
            {minimizeHover ? <DashCircleFill size={23} /> : <DashCircle size={23} />}
          </div>
        }
        <div className="cp" onMouseOver={() => setCloseHover(true)} onMouseOut={() => setCloseHover(false)} onClick={(e) => handleCloseChat(e)}>
          {closeHover ? <XCircleFill size={23} /> : <XCircle size={23} />}
        </div>
      </div>
      <div className={s.activeChats__settings}>
        <ToggleModal toggle={<ThreeDots size={18} />} modal={<ChatHeadDropdown id={chat.id} />} clickClose={true} />
      </div>
    </div>
  );
};

export default ChatHead;