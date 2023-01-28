import { useRouter } from 'next/router';
import React from 'react';

const LinkCallback = ({href, onClick, children}: {href: string, onClick?: () => void, children: React.ReactNode}) => {
  const router = useRouter();

  const handleClick = () => {
    onClick && onClick();
    router.push(href);
  };
  return (
    <a onClick={handleClick}>
      {children}
    </a>
  );
};

export default LinkCallback;