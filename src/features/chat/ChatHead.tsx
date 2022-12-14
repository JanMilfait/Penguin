import React, { useMemo } from 'react';
import s from '../../styles/6_components/Chats.module.scss';
import Avatar from '../../components/Avatar';
import { Chat } from './chatSlice.types';
import { AppDispatch, AppState } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { DashCircle, DashCircleFill, XCircle, XCircleFill, ThreeDots } from 'react-bootstrap-icons';
import {deactivateChat, minimizeChat} from './chatSlice';
import ToggleModal from '../../components/ToggleModal';
import ChatHeadDropdown from './ChatHeadDropdown';

const ChatHead = ({id, chat}: {id: number, chat: Chat}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [minimizeHover, setMinimizeHover] = React.useState(false);
  const [closeHover, setCloseHover] = React.useState(false);
  const closeTimeout = useSelector((state: AppState) => state.chat.animation.closeTimeout);

  const usersFiltered = useMemo(() => chat.users.filter((user) => user.id !== id), [chat.users.length, id]);


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
            <div key={user.id} className={s.activeChats__chatAvatar} >
              {user.is_active
                ? <div className={s.activeChats__chatOnline} ></div>
                : <div className={s.activeChats__chatOffline} ></div>
              }
              <Avatar {...user} size={40} />
            </div>
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
        <div className="cp" onMouseOver={() => setMinimizeHover(true)} onMouseOut={() => setMinimizeHover(false)} onClick={(e) => handleMinimizeChat(e)}>
          {minimizeHover ? <DashCircleFill size={23} /> : <DashCircle size={23} />}
        </div>
        <div className="cp" onMouseOver={() => setCloseHover(true)} onMouseOut={() => setCloseHover(false)} onClick={(e) => handleCloseChat(e)}>
          {closeHover ? <XCircleFill size={23} /> : <XCircle size={23} />}
        </div>
      </div>
      <div className={s.activeChats__settings}>
        <ToggleModal toggle={<ThreeDots size={18} />} modal={<ChatHeadDropdown id={chat.id} />} anchorClickClose={true} />
      </div>
    </div>
  );
};

export default ChatHead;