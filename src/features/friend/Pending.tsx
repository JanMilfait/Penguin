import React, { useState } from 'react';
import {User} from '../auth/authSlice.types';
import s from 'styles/6_components/Pendings.module.scss';
import ss from 'styles/6_components/Navigation.module.scss';
import Avatar from '../../components/Avatar';
import Link from 'next/link';
import { useAcceptPendingMutation, useDeclinePendingMutation } from './friendSlice';

type PendingProps = {id: number, type: 'received'|'send', user: User, state: 'waiting'|'accepted'|'declined', updated_at: string, unreaded: boolean, onHover?: () => void};

const Pending = ({id, type, user, state, updated_at, unreaded, onHover}: PendingProps) => {
  const [hover, setHover] = useState(false);
  const isHoverable = type === 'received' && state === 'waiting';

  const [acceptPending] = useAcceptPendingMutation();
  const [declinePending] = useDeclinePendingMutation();

  const text = {
    received: {
      'waiting': <><span className="fw-bold">{user.name}</span> wants to be your friend</>,
      'accepted': <>You have accepted <span className="fw-bold">{user.name}</span> friend request</>,
      'declined': <>You have declined <span className="fw-bold">{user.name}</span> friend request</>
    },
    send: {
      'waiting': <>You have sent a friend request to <span className="fw-bold">{user.name}</span></>,
      'accepted': <><span className="fw-bold">{user.name}</span> has accepted your friend request</>,
      'declined': <><span className="fw-bold">{user.name}</span> has declined your friend request</>
    }
  };

  return (
    <div
      className={s.pendings__pending}
      onMouseEnter={onHover}
      onTouchStart={onHover}
    >
      <div
        className="row h-100"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onTouchStart={() => setHover(true)}
        onTouchEnd={() => setHover(false)}
      >
        <div className="col-auto">
          <Link href={'/profile/' + user.id}>
            <Avatar {...user} size={40} />
          </Link>
        </div>
        <div className="col d-flex flex-column justify-content-center mw-0">
          <h3 className="f--x-small mb-0">{text[type][state]}</h3>
          <h3 className="f--xx-small opacity-50 mb-0">{updated_at}</h3>
        </div>
        {isHoverable && hover &&
          <div className="d-flex justify-content-end mt-1">
            <button className="button--x-small mr-1" onClick={() => {
              onHover && onHover();
              acceptPending({pendingId: id});
            }}>Accept</button>
            <button className="button--x-small" onClick={() => {
              onHover && onHover();
              declinePending({pendingId: id});
            }}>Decline</button>
          </div>
        }
      </div>
      {unreaded && <div className={ss.navigation__unreaded + ' ' + ss.navigation__unreadedCloser}></div>}
    </div>
  );
};

export default React.memo(Pending);