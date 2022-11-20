import React from 'react';
import s from 'styles/6_components/Chats.module.scss';

const MessageDate = ({date}: {date: string | undefined}) => {
  return (
    <div className={s.activeChats__messageDate}>
      <p>{date}</p>
    </div>
  );
};

export default React.memo(MessageDate);