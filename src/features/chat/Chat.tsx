import React from 'react';
import s from 'styles/6_components/Chats.module.scss';
import { AppState } from '../../app/store';
import { useSelector } from 'react-redux';
import ChatHead from './ChatHead';
import ChatMessages from './ChatMessages';
import ChatTextarea from './ChatTextarea';
import { getActiveChat, isOpenedChat } from './chatSlice';

const Chat = ({chatId}: {chatId: number}) => {
  const chat = useSelector((state: AppState) => getActiveChat(state, chatId)!);
  const isOpened = useSelector((state: AppState) => isOpenedChat(state, chatId));

  return (
    <div className={s.activeChats__chat + (isOpened ? '' : ' d-none')} data-id={chatId}>
      <ChatHead chat={chat} />
      <ChatMessages chat={chat} />
      <ChatTextarea chat={chat} />
    </div>
  );
};

export default React.memo(Chat);