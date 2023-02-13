import React from 'react';
import Image from 'next/image';

type AvatarProps = {
  id: number;
  avatar_name?: string|null;
  avatar_url?: string|null;
  is_active?: 1 | 0;
  avatar?: string|null;
  size: number,
  onClick?: (e: React.MouseEvent<HTMLImageElement, MouseEvent>) => unknown,
  className?: string
};

const Avatar = ({id, avatar, avatar_name, avatar_url, size, onClick, className}: AvatarProps) => {

  if (avatar) {
    return (
      <Image className={className ? 'avatar ' + className : 'avatar'} src={avatar} alt={'avatar_' + id} width={size} height={size} onClick={onClick} />
    );
  }

  return (
    <>
      {avatar_name
        ? <Image className={className ? 'avatar ' + className : 'avatar'} src={avatar_url + (size > 50 ? '200_' : '50_') + avatar_name} alt={'avatar_' + id} width={size} height={size} onClick={onClick} />
        : <Image className={className ? 'avatar ' + className : 'avatar'} src={'/images/avatars/default.png'} alt={'avatar_default'} width={size} height={size} onClick={onClick} />}
    </>
  );
};

export default Avatar;