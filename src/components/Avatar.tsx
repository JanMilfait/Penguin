import React from 'react';
import Image from 'next/image';
import {User} from '../features/search/searchSlice.types';

type avatarType = {user: User|null, size: number, onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => unknown, className?: string};

const Avatar = ({user, size, onClick, className}: avatarType) => {
  return (
    <>
      {user && user.avatar_name
        ? <Image className={className ? 'avatar ' + className : 'avatar'} src={user.avatar_url + (size > 50 ? '200_' : '50_') + user.avatar_name} alt={'avatar_' + user.id} width={size} height={size} onClick={onClick} />
        : <Image className={className ? 'avatar ' + className : 'avatar'} src={'/images/avatars/default.png'} alt={'avatar_default'} width={size} height={size} onClick={onClick} />}
    </>
  );
};

export default Avatar;