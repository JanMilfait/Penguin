import Link from 'next/link';
import s from 'styles/6_components/Dropdown.module.scss';
import { setCookie } from 'cookies-next';
import { useLogoutMutation } from './authSlice';
import React from 'react';
import { AppState } from 'app/store';
import { useSelector } from 'react-redux';
import LinkCallback from 'components/LinkCallback';
import {dispatchSSR} from '../../app/helpers/helpers';

const UserDropdown = () => {
  const [logout] = useLogoutMutation();
  const user = useSelector((state: AppState) => state.auth.data);

  const handleLogout = async () => {
    await logout();
    setCookie('httpTokenDelete', 'true');
    window.location.href = '/login';
  };

  return (
    <ul className={s.dropdown}>
      <li><Link href="/" >Home</Link></li>
      <li><Link href={'/profile/' + user?.slug}>Profile</Link></li>
      <li><LinkCallback href={'/profile/' + user?.slug + '/info'} onClick={() => dispatchSSR('auth/setProfile', {edit: user?.id})}>Edit Profile</LinkCallback></li>
      <li><Link href="/settings">Settings</Link></li>
      <li><a onClick={() => handleLogout()}>Logout</a></li>
    </ul>
  );
};

export default UserDropdown;