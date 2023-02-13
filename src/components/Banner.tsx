import React, {useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const Banner = () => {
  const images = useRef([
    ['/images/banner/banner_1.jpg', '/']
  ]);
  const intervalTime = 10000;

  const [imgSrc, setImgSrc] = useState<string>(images.current[0][0]);
  const [imgRedirection, setImgRedirection] = useState<string>(images.current[0][1]);

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = index === images.current.length - 1 ? 0 : index + 1;
      setImgSrc(images.current[index][0]);
      setImgRedirection(images.current[index][1]);
    }, intervalTime);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-4">
      <style>
        {`
          .banner {
            display: flex;
            justify-content: center;
          }
          .banner img {
            border-radius: 10px;
          }
        `}
      </style>
      <div className="banner">
        <a href={imgRedirection} target="_blank" rel="noopener noreferrer">
          <Image src={imgSrc} alt={'banner'} width={261} height={435} />
        </a>
      </div>
    </div>
  );
};

export default Banner;