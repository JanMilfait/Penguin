import React from 'react';
import Image from 'next/image';
import { HandThumbsUp } from 'react-bootstrap-icons';

const Emoji = ({id, name, size}: {id?: number, name?: string, size: number}) => {

  if (name) {
    name === 'like' && (id = 1);
    name === 'heart' && (id = 2);
    name === 'poop' && (id = 3);
    name === 'laugh' && (id = 4);
    name === 'wow' && (id = 5);
    name === 'sad' && (id = 6);
    name === 'angry' && (id = 7);
  }

  return (
    <>
      {id === 1 && <HandThumbsUp size={size} />}
      {id === 2 && <Image src={'/images/emoji/heart.svg'} width={size} height={size} alt={'heart'} />}
      {id === 3 && <Image src={'/images/emoji/poop.svg'} width={size} height={size} alt={'poop'} />}
      {id === 4 && <Image src={'/images/emoji/laugh.svg'} width={size} height={size} alt={'laugh'} />}
      {id === 5 && <Image src={'/images/emoji/wow.svg'} width={size} height={size} alt={'wow'} />}
      {id === 6 && <Image src={'/images/emoji/sad.svg'} width={size} height={size} alt={'sad'} />}
      {id === 7 && <Image src={'/images/emoji/angry.svg'} width={size} height={size} alt={'angry'} />}
    </>
  );
};

export default Emoji;