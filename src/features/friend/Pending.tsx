import React, { useState } from 'react';
import {User} from '../auth/authSlice.types';
import s from 'styles/6_components/Pendings.module.scss';
import Avatar from '../../components/Avatar';
import Link from 'next/link';
import { useAcceptPendingMutation } from './friendSlice';

const Pending = ({id, type, user, state, updated_at}: {id: number, type: 'received'|'send', user: User, state: 'waiting'|'accepted'|'declined', updated_at: string}) => {
  const [hover, setHover] = useState(false);
  const isHoverable = type === 'received' && state === 'waiting';

  const [acceptPending] = useAcceptPendingMutation();
  const [declinePending] = useAcceptPendingMutation();

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
    <div className={s.pendings__pending}>
      <div
        className="row h-100"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onTouchStart={() => setHover(true)}
        onTouchEnd={() => setHover(false)}
      >
        <div className="col-auto d-flex align-items-center">
          <Link href={'/profile/' + user.id}>
            <Avatar {...user} size={40} />
          </Link>
        </div>
        <div className="col d-flex flex-column justify-content-center mw-0">
          <h3 className="f--x-small mb-0">{text[type][state]}</h3>
          <p className="f--xx-small opacity-50 mb-0">{updated_at}</p>
        </div>
        {isHoverable && hover &&
          <div className="d-flex justify-content-end mt-1">
            <button className="button--x-small mr-1" onClick={() => acceptPending({pendingId: id})}>Accept</button>
            <button className="button--x-small" onClick={() => declinePending({pendingId: id})}>Decline</button>
          </div>
        }
      </div>
    </div>
  );
};

export default React.memo(Pending);