import React from 'react';
import { AppState} from '../app/store';
import { useSelector } from 'react-redux';
import s from 'styles/6_components/Navigation.module.scss';
import PendingNotifications from 'features/notifications/PendingNotifications';
import ChatsNotifications from 'features/notifications/ChatsNotifications';
import AllNotifications from 'features/notifications/AllNotifications';
import Avatar from './Avatar';
import UserDropdown from 'features/auth/UserDropdown';
import ToggleModal from './ToggleModal';

const NavIcons = () => {
  const user = useSelector((state: AppState) => state.auth.data);

  return (
    <ul className={s.navigation__icons}>
      <li><ToggleModal toggle={<PendingNotifications />} modal={<div>test1</div>} /></li>
      <li><ToggleModal toggle={<ChatsNotifications />} modal={<div>test2</div>} /></li>
      <li><ToggleModal toggle={<AllNotifications />} modal={<div>test3</div>} /></li>
      <li><ToggleModal toggle={<Avatar user={user} size={50} />} modal={<UserDropdown />} /></li>
    </ul>
  );
};

export default NavIcons;