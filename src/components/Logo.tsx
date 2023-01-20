import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Logo = ({ width, height, hardRefresh = false }: { width: number; height: number, hardRefresh?: boolean }) => {

  return (
    !hardRefresh ?
      <Link href="/">
        <Image src="/images/logo.png" alt="penguin_logo" width={width} height={height} />
      </Link>
      :
      // eslint-disable-next-line @next/next/no-html-link-for-pages
      <a href="/">
        <Image src="/images/logo.png" alt="penguin_logo" width={width} height={height} />
      </a>
  );
};

export default Logo;