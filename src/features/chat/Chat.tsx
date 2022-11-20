import React from 'react';
import s from 'styles/6_components/Chats.module.scss';
import { AppState } from '../../app/store';
import { useSelector } from 'react-redux';
import { Montserrat }  from '@next/font/google';
import ChatHead from './ChatHead';
import ChatMessages from './ChatMessages';
import ChatTextarea from './ChatTextarea';
import { getActiveChat, isOpenedChat } from './chatSlice';

const montserrat = Montserrat();

const Chat = ({chatId}: {chatId: number}) => {
  const id = useSelector((state: AppState) => state.auth.data!.id);
  const chat = useSelector((state: AppState) => getActiveChat(state, chatId)!);
  const isOpened = useSelector((state: AppState) => isOpenedChat(state, chatId));

  return (

    <div className={s.activeChats__chat + (' ' + montserrat.className) + (isOpened ? '' : ' d-none')} data-id={chatId}>
      <ChatHead id={id} chat={chat} />
      <ChatMessages id={id} chat={chat} />
      <ChatTextarea id={id} chat={chat} />
    </div>
  );
};

export default React.memo(Chat);