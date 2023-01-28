import React, {CSSProperties, useEffect, useRef, useState } from 'react';
import { useGetChatsQuery } from './chatSlice';
import s from 'styles/6_components/AllChats.module.scss';
import {useInfiniteScroll} from '../../app/hooks/useInfiniteScroll';
import { Chat } from './chatSlice.types';
import ActiveChat from './ActiveChat';
import {AppDispatch, AppState} from '../../app/store';
import {useDispatch, useSelector } from 'react-redux';
import {markMessageAsReaded, unreadedMessageNotifications, useMarkNotificationsAsReadedMutation} from '../notification/notificationSlice';
import debounce from 'lodash.debounce';
import ss from '../../styles/6_components/Pendings.module.scss';
import DotLoaderSpin from '../../components/DotLoaderSpin';

const AllChats = ({style}: {style?: CSSProperties}) => {
  const dispatch = useDispatch<AppDispatch>();
  const unreadedMessages = useSelector((state: AppState) => unreadedMessageNotifications(state, false)) as Map<string, number|undefined>;
  const containerRef = useRef<HTMLDivElement>(null);

  const {data, isLoading} = useGetChatsQuery();
  const [chats] = useInfiniteScroll(data, containerRef, 50);

  //****************************
  // Mark as readed
  //****************************

  const debounceTime = useSelector((state: AppState) => state.notification.debounceTime);
  const [markNotificationsAsReaded] = useMarkNotificationsAsReadedMutation();
  const [markReaded, setMarkReaded] = useState<number[]>([]);
  const debouncedRef = useRef(debounce((markReaded) => {
    markNotificationsAsReaded({ids: markReaded});
    setMarkReaded([]);
  }, debounceTime));

  const markAsReaded = (id: number) => {
    if (!markReaded.includes(id)) {
      dispatch(markMessageAsReaded(id));
      setMarkReaded([...markReaded, id]);
    }
  };

  useEffect(() => {
    markReaded.length > 0 && debouncedRef.current(markReaded);
  }, [markReaded]);


  if (isLoading) {
    return (
      <div ref={containerRef} className={s.allChats} style={style}>
        <div className="d-flex justify-content-center align-items-center h-100">
          <DotLoaderSpin />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={s.allChats} style={style}>
      {chats.map((chat: Chat) => {
        const notificationId = unreadedMessages.get(`${chat.id + 'message'}`);
        return (
          <ActiveChat
            key={chat.id}
            {...chat}
            unreaded={typeof notificationId === 'number'}
            onHover={typeof notificationId === 'number' ? () => markAsReaded(notificationId) : undefined}
          />
        );
      })}
      {chats.length === 0 && <p className="f--medium d-flex justify-content-center align-items-center h-100 mb-0">No chats yet</p>}
    </div>
  );
};

export default AllChats;