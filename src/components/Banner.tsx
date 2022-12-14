import React from 'react';
import Image from 'next/image';

const Banner = () => {
  return (
    <div className="mt-4">
      <div className="d-flex justify-content-center">
        <a href="/" target="_blank" rel="noopener noreferrer">
          <Image src={'/images/banner/banner_1.gif'} alt={'banner_1'} width={220} height={220} priority />
        </a>
      </div>
    </div>
  );
};

export default Banner;