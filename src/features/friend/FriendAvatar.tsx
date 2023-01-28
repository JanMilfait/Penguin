import s from '../../styles/6_components/FriendsSb.module.scss';
import Avatar from '../../components/Avatar';
import { Friend } from '../chat/chatSlice.types';
import React from 'react';
import Link from 'next/link';
import {activateChat} from '../chat/chatSlice';
import {AppDispatch, AppState} from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';

type FriendAvatarProps = Friend & {size?: number, className?: string, classNameOnline?: string, classNameOffline?: string, tooltip?: string, href?: string, clickOpenChat?: false|{chatId: number}|{friendId: number}};

export const FriendAvatar = ({
  id,
  name,
  avatar_url,
  avatar_name,
  size = 50,
  className,
  classNameOnline,
  classNameOffline,
  tooltip,
  href = '',
  clickOpenChat = false
}: FriendAvatarProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const activityStatus = useSelector((state: AppState) => state.friend.activityStatus[id]);

  const avatar = (
    <div
      className={className ? className : s.friendsSideBar__avatar}
      style={{width: size, height: size}}
      data-tip={tooltip ? name : undefined}
      data-for={tooltip ? tooltip : undefined}
      onClick={() => !href && clickOpenChat && dispatch(activateChat(clickOpenChat))}
    >
      {activityStatus === 1 && <div className={classNameOnline ? classNameOnline : s.friendsSideBar__online} ></div>}
      {activityStatus === 0 && <div className={classNameOffline ? classNameOffline : s.friendsSideBar__offline} ></div>}
      <Avatar {...{id, name, avatar_url, avatar_name}} size={size} />
    </div>
  );

  return href ? <Link href={href}>{avatar}</Link> : avatar;
};

export default React.memo(FriendAvatar);