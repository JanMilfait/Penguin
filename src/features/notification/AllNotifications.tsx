import React from 'react';
import { BellFill } from 'react-bootstrap-icons';
import { useSelector } from 'react-redux';
import {AppState} from '../../app/store';
import s from '../../styles/6_components/Navigation.module.scss';
import {unreadedOtherNotifications} from './notificationSlice';

function AllNotifications() {
  const othersCount = useSelector((state: AppState) => unreadedOtherNotifications(state, true)) as number;
  return (
    <div className="position-relative">
      {othersCount ? <div className={s.navigation__notificationCounter}>{othersCount}</div> : null}
      <BellFill />
    </div>
  );
}

export default AllNotifications;