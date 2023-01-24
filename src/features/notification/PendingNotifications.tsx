import React from 'react';
import { PersonPlusFill } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import {AppState} from '../../app/store';
import s from 'styles/6_components/Navigation.module.scss';
import {unreadedPendingNotifications} from './notificationSlice';

function PendingNotifications() {
  const pendingsCount = useSelector((state: AppState) => unreadedPendingNotifications(state, true)) as number;
  return (
    <div className="position-relative">
      {pendingsCount ? <div className={s.navigation__notificationCounter}>{pendingsCount}</div> : null}
      <PersonPlusFill />
    </div>
  );
}

export default PendingNotifications;