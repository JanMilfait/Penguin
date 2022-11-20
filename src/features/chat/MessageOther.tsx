import React from 'react';
import s from 'styles/6_components/Chats.module.scss';
import {Friend, Message} from './chatSlice.types';
import MessageImage from './MessageImage';
import Avatar from '../../components/Avatar';

const MessageOther = ({user, body, img}: {user: Friend, body: Message['body'], img: Message['image_url']}) => {
  return (
    <div className="d-flex justify-content-start">
      <div className={s.activeChats__messageOther}>
        { img
          ? <MessageImage img={img} />
          : <p>{body}</p>
        }
        <Avatar className={s.activeChats__messageAvatar} user={user} size={20} />
      </div>
    </div>
  );
};

export default React.memo(MessageOther);