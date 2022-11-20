import React from 'react';
import s from 'styles/6_components/Chats.module.scss';
import { Message } from './chatSlice.types';
import MessageImage from './MessageImage';

const MessageMe = ({body, img}: {body: Message['body'], img: Message['image_url']}) => {
  return (
    <div className="d-flex justify-content-end">
      <div className={s.activeChats__messageMe}>
        { img
          ? <MessageImage img={img} />
          : <p>{body}</p>
        }
      </div>
    </div>
  );
};

export default React.memo(MessageMe);