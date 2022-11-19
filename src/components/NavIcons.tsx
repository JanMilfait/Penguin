import React, { useEffect, useRef } from 'react';
import {AppState} from '../app/store';
import {useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/Navigation.module.scss';
import PendingNotifications from 'features/notifications/PendingNotifications';
import ChatsNotifications from 'features/notifications/ChatsNotifications';
import AllNotifications from 'features/notifications/AllNotifications';
import Avatar from './Avatar';
import {toggleUserDropdown} from '../features/auth/authSlice';
import UserDropdown from 'features/auth/UserDropdown';

const NavIcons = () => {
  const dispatch = useDispatch();
  const { data, userDropdownOpen } = useSelector((state: AppState) => state.auth);

  const pendingNotificationsRef = useRef<HTMLLIElement>(null),
    chatsNotificationsRef = useRef<HTMLLIElement>(null),
    allNotificationsRef = useRef<HTMLLIElement>(null),
    avatarRef = useRef<HTMLLIElement>(null);


  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pendingNotificationsRef.current && !pendingNotificationsRef.current.contains(e.target as Node)) {

      }

      if (chatsNotificationsRef.current && !chatsNotificationsRef.current.contains(e.target as Node)) {

      }

      if (allNotificationsRef.current && !allNotificationsRef.current.contains(e.target as Node)) {

      }

      if (userDropdownOpen && avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        dispatch(toggleUserDropdown());
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen, dispatch]);


  return (
    <ul className={s.navigation__icons}>
      <li ref={pendingNotificationsRef} >
        <div className="position-relative">
          <PendingNotifications />
        </div>
      </li>
      <li ref={chatsNotificationsRef} >
        <div className="position-relative">
          <ChatsNotifications />
        </div>
      </li>
      <li ref={allNotificationsRef} >
        <div className="position-relative">
          <AllNotifications />
        </div>
      </li>
      <li ref={avatarRef} >
        <div className="position-relative">
          <Avatar user={data} size={50} onClick={() => dispatch(toggleUserDropdown())} />
          { userDropdownOpen && <UserDropdown /> }
        </div>
      </li>
    </ul>
  );
};

export default NavIcons;