import React, { useState } from 'react';
import {User} from '../auth/authSlice.types';
import s from 'styles/6_components/Pendings.module.scss';
import ss from 'styles/6_components/Navigation.module.scss';
import Avatar from '../../components/Avatar';
import Link from 'next/link';
import { useAcceptPendingMutation, useDeclinePendingMutation } from './friendSlice';
import {AppState} from '../../app/store';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';

type PendingProps = {id: number, type: 'received'|'send', user: User, state: 'waiting'|'accepted'|'declined', updated_at: string, unreaded: boolean, onHover?: () => void};

const Pending = ({id, type, user, state, updated_at, unreaded, onHover}: PendingProps) => {
  const [hover, setHover] = useState(false);
  const isHoverable = type === 'received' && state === 'waiting';
  const isMobile = useSelector((state: AppState) => state.root.isMobile);

  const router = useRouter();
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

  const handleClick = (e: any) => {
    if (isMobile) {
      isHoverable && e.stopPropagation();
      setHover(!hover);
    }
    !isHoverable && router.push('/profile/' + user.id);
  };

  const handleAccept = (e: any) => {
    e.stopPropagation();
    onHover && onHover();
    acceptPending({pendingId: id});
  };

  const handleDecline = (e: any) => {
    e.stopPropagation();
    onHover && onHover();
    declinePending({pendingId: id});
  };

  return (
    <div
      className={s.pendings__pending}
      onPointerEnter={onHover}
    >
      <div
        className="row h-100"
        onPointerEnter={() => !isMobile && setHover(true)}
        onPointerLeave={() => !isMobile && setHover(false)}
        onClick={handleClick}
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
            <button className="button--x-small mr-1" onClick={handleAccept}>Accept</button>
            <button className="button--x-small" onClick={handleDecline}>Decline</button>
          </div>
        }
      </div>
      {unreaded && <div className={ss.navigation__unreaded + ' ' + ss.navigation__unreadedCloser}></div>}
    </div>
  );
};

export default React.memo(Pending);