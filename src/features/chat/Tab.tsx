import React, { useMemo } from 'react';
import s from 'styles/6_components/Chats.module.scss';
import Avatar from '../../components/Avatar';
import { XCircle, XCircleFill } from 'react-bootstrap-icons';
import { AppDispatch, AppState } from 'app/store';
import { useDispatch, useSelector } from 'react-redux';
import {deactivateChat, getActiveChat, isOpenedChat, toggleChat} from './chatSlice';
import {sleep} from '../../app/helpers/helpers';

const Tab = ({ chatId }: { chatId: number }) => {

  const dispatch = useDispatch<AppDispatch>();
  const [closeHover, setCloseHover] = React.useState(false);

  const id = useSelector((state: AppState) => state.auth.data?.id);
  const chat = useSelector((state: AppState) => getActiveChat(state, chatId)!);
  const isExpanded = useSelector((state: AppState) => state.chat.expandChats);
  const isOpened = useSelector((state: AppState) => isOpenedChat(state, chatId));
  const closeTimeout = useSelector((state: AppState) => state.chat.animation.closeTimeout);

  const users = useMemo(() => chat.users.filter((user) => user.id !== id), [chat.users.length, id]);

  const handleClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    dispatch(deactivateChat(chat.id));
  };

  const handleToggleChat = async () => {
    if (isOpened) {
      const chats = document.querySelectorAll('.' + s.activeChats__chat);
      const chatEl = chats[Array.from(chats).findIndex((chat) => chat.getAttribute('data-id') === chatId.toString())];
      chatEl?.classList.add(s.activeChats__chatClose);
      await sleep(closeTimeout);
    }
    dispatch(toggleChat(chat.id));
  };


  return (
    <div className={s.activeChats__tab + (isExpanded ? '' : ' ' + s.activeChats__tabShrink) + (isOpened ? ' ' + s.activeChats__tabActive : '')}
      onClick={handleToggleChat}>
      <div className="d-flex">
        {users.map((user) => (
          <div key={user.id} className={s.activeChats__avatar} >
            {user.is_active
              ? <div className={s.activeChats__online} ></div>
              : <div className={s.activeChats__offline} ></div>
            }
            <Avatar {...user} size={40} />
          </div>
        ))}
      </div>
      <p className={s.activeChats__names + ' text-truncate'}>
        {users.map((user) => user.name).join(', ')}
      </p>
      <div className={s.activeChats__close}
        onMouseOver={() => setCloseHover(true)}
        onMouseOut={() => setCloseHover(false)}
        onClick={(e) => handleClose(e)}
      >
        {closeHover
          ? <XCircleFill size={18} />
          : <XCircle size={18} />
        }
      </div>
    </div>
  );
};

export default React.memo(Tab);