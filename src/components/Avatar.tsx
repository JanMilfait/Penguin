import React from 'react';
import Image from 'next/image';
import { Friend } from '../features/chat/chatSlice.types';

type AvatarT = {size: number, onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => unknown, className?: string};

const Avatar = ({id, avatar_name, avatar_url, size, onClick, className}: Friend & AvatarT) => {
  return (
    <>
      {avatar_name
        ? <Image className={className ? 'avatar ' + className : 'avatar'} src={avatar_url + (size > 50 ? '200_' : '50_') + avatar_name} alt={'avatar_' + id} width={size} height={size} onClick={onClick} priority={size > 150} />
        : <Image className={className ? 'avatar ' + className : 'avatar'} src={'/images/avatars/default.png'} alt={'avatar_default'} width={size} height={size} onClick={onClick} priority={size > 150} />}
    </>
  );
};

export default Avatar;