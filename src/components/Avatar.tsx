import React from 'react';
import Image from 'next/image';
import {UserData} from '../features/auth/authSlice.types';
import {User} from '../features/search/searchSlice.types';

const Avatar = ({user, size, onClick}: {user: UserData|User|null, size: number, onClick?: () => void}) => {
  return (
    <>
      {user && user.avatar_name
        ? <Image className="avatar" src={user.avatar_url + '50_' + user.avatar_name} alt={'avatar_' + user.id} width={size} height={size} onClick={onClick} />
        : <Image className="avatar" src={'/images/avatars/default.png'} alt={'avatar_default'} width={size} height={size} onClick={onClick} />}
    </>
  );
};

export default Avatar;