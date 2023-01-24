import s from '../../styles/6_components/FriendsSb.module.scss';
import Avatar from '../../components/Avatar';
import { Friend } from '../chat/chatSlice.types';
import React from 'react';
import Link from 'next/link';
import {activateChat} from '../chat/chatSlice';
import {AppDispatch} from '../../app/store';
import { useDispatch } from 'react-redux';

type FriendAvatarProps = Friend & {size?: number, tooltip?: string, href?: string};

export const FriendAvatar = ({id, name, is_active, avatar_url, avatar_name, size = 50, tooltip, href = ''}: FriendAvatarProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const avatar = (
    <div
      className={s.friendsSideBar__avatar}
      style={{width: size, height: size}}
      data-tip={tooltip ? name : undefined}
      data-for={tooltip ? tooltip : undefined}
      onClick={() => !href && dispatch(activateChat({friendId: id}))}
    >
      {is_active === 1 && <div className={s.friendsSideBar__online} ></div>}
      {is_active === 0 && <div className={s.friendsSideBar__offline} ></div>}
      <Avatar {...{id, name, avatar_url, avatar_name}} size={size} />
    </div>
  );

  return href ? <Link href={href}>{avatar}</Link> : avatar;
};

export default React.memo(FriendAvatar);