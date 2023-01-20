import s from '../../styles/6_components/FriendsSb.module.scss';
import Avatar from '../../components/Avatar';
import { Friend } from '../chat/chatSlice.types';
import React from 'react';
import Link from 'next/link';

type FriendAvatarProps = Friend & {size?: number, tooltip?: string, className?: string, href?: string};

export const FriendAvatar = ({id, name, is_active, avatar_url, avatar_name, size = 50, tooltip, className, href = ''}: FriendAvatarProps) => {
  const avatar = (
    <div
      className={'position-relative cp' + (className ? ' ' + className : '')}
      style={{width: size, height: size}}
      data-tip={tooltip ? name : undefined}
      data-for={tooltip ? tooltip : undefined}
    >
      {is_active === 1 && <div className={s.friendsSideBar__online} ></div>}
      {is_active === 0 && <div className={s.friendsSideBar__offline} ></div>}
      <Avatar {...{id, name, avatar_url, avatar_name}} size={size} />
    </div>
  );

  return href ? <Link href={href}>{avatar}</Link> : avatar;
};

export default React.memo(FriendAvatar);