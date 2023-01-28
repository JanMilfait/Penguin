import React, { useMemo } from 'react';
import {Chat} from './chatSlice.types';
import s from 'styles/6_components/AllChats.module.scss';
import {AppDispatch, AppState} from '../../app/store';
import {useDispatch, useSelector } from 'react-redux';
import { activateChat } from './chatSlice';
import ss from '../../styles/6_components/Navigation.module.scss';
import FriendAvatar from 'features/friend/FriendAvatar';

const ActiveChat = ({id: chatId, users, last_message_by, last_message, updated_at, unreaded, onHover}: Chat & {unreaded: boolean, onHover?: () => void}) => {
  const dispatch = useDispatch<AppDispatch>();
  const id = useSelector((state: AppState) => state.auth.data!.id);
  const usersFiltered = useMemo(() => users.filter((user) => user.id !== id).slice(0, 4), [users.length]);

  return (
    <div className={s.allChats__chat} onPointerEnter={onHover}>
      <div className="row cp" onClick={() => dispatch(activateChat({chatId}))}>
        <div className="col-auto">
          <div className="d-flex">
            {usersFiltered.map((user) => (
              <FriendAvatar
                key={user.id}
                className={s.allChats__avatars}
                classNameOnline={s.allChats__avatarsOnline}
                classNameOffline={s.allChats__avatarsOffline}
                {...user}
              />
            ))}
          </div>
        </div>
        <div className="col d-flex align-items-center mw-0">
          <div className="w-100">
            <h3 className="f--x-small fw-bold text-truncate mb-0">{usersFiltered.map((user) => user.name).join(', ')}</h3>
            <div className="d-flex align-items-center">
              <h3 className="f--x-small text-truncate mb-0">
                {last_message_by && last_message_by + ' '}
                {last_message}
              </h3>
              <h3 className="f--x-small text-nowrap mb-0">{last_message && updated_at && <span className="f--xx-small opacity-50 ml-2">- {updated_at}</span>}</h3>
            </div>
          </div>
        </div>
      </div>
      {unreaded && <div className={ss.navigation__unreaded}></div>}
    </div>
  );
};

export default React.memo(ActiveChat);