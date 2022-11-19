import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Logo = ({ width, height }: { width: number; height: number }) => {
  return (
    <Link href="/">
      <Image src="/images/logo.png" alt="penguin_logo" width={width} height={height} />
    </Link>
  );
};

export default Logo;