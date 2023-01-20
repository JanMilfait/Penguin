import React, {CSSProperties, useRef } from 'react';
import { useGetChatsQuery } from './chatSlice';
import s from 'styles/6_components/AllChats.module.scss';
import {useInfiniteScroll} from '../../app/hooks/useInfiniteScroll';
import { Chat } from './chatSlice.types';
import ActiveChat from './ActiveChat';

const AllChats = ({style}: {style?: CSSProperties}) => {
  const {data} = useGetChatsQuery();
  const containerRef = useRef<HTMLDivElement>(null);

  const [chats] = useInfiniteScroll(data, containerRef, 50);

  return (
    <div ref={containerRef} className={s.allChats} style={style}>
      {chats.map((chat: Chat) => (
        <ActiveChat key={chat.id} {...chat} />
      ))}
      {chats.length === 0 && <p className="f--medium d-flex justify-content-center align-items-center h-100 mb-0">No chats yet</p>}
    </div>
  );
};

export default AllChats;