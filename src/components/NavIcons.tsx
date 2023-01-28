import React from 'react';
import { AppState} from '../app/store';
import { useSelector } from 'react-redux';
import s from 'styles/6_components/Navigation.module.scss';
import PendingNotifications from 'features/notification/PendingNotifications';
import ChatsNotifications from 'features/notification/ChatsNotifications';
import AllNotifications from 'features/notification/AllNotifications';
import Avatar from './Avatar';
import UserDropdown from 'features/auth/UserDropdown';
import ToggleModal from './ToggleModal';
import dynamic from 'next/dynamic';
import {useGetNotificationsQuery} from '../features/notification/notificationSlice';

const NavIcons = () => {
  const user = useSelector((state: AppState) => state.auth.data!);
  const isAuth = typeof user.id === 'number';

  useGetNotificationsQuery(undefined, {skip: !isAuth});

  const ModalPendings = dynamic(() => import('features/friend/ModalPendings'), {ssr: false});
  const ModalChats = dynamic(() => import('features/chat/ModalChats'), {ssr: false});
  const ModalNotifications = dynamic(() => import('features/notification/ModalNotifications'), {ssr: false});

  return (
    <ul>
      <li className={s.navigation__icon}><ToggleModal toggle={<PendingNotifications />} modal={<ModalPendings />} hidden={false} /></li>
      <li className={s.navigation__icon}><ToggleModal toggle={<ChatsNotifications />} modal={<ModalChats />} hidden={false} clickClose={true} /></li>
      <li className={s.navigation__icon}><ToggleModal toggle={<AllNotifications />} modal={<ModalNotifications />} hidden={false} clickClose={true} /></li>
      <li className={s.navigation__icon}><ToggleModal toggle={<Avatar {...user} size={50} />} modal={<UserDropdown />} clickClose={true} /></li>
    </ul>
  );
};

export default NavIcons;