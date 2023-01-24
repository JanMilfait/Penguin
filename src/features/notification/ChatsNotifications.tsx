import React from 'react';
import { ChatLeftTextFill } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import {AppState} from '../../app/store';
import s from '../../styles/6_components/Navigation.module.scss';
import {unreadedMessageNotifications} from './notificationSlice';

function ChatsNotifications() {
  const messagesCount = useSelector((state: AppState) => unreadedMessageNotifications(state, true)) as number;
  return (
    <div className="position-relative">
      {messagesCount ? <div className={s.navigation__notificationCounter}>{messagesCount}</div> : null}
      <ChatLeftTextFill />
    </div>
  );
}

export default ChatsNotifications;