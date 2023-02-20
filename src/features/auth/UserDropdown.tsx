import Link from 'next/link';
import s from 'styles/6_components/Dropdown.module.scss';
import { setCookie } from 'cookies-next';
import { useLogoutMutation } from './authSlice';
import React from 'react';
import {AppDispatch, AppState } from 'app/store';
import {useDispatch, useSelector } from 'react-redux';
import LinkCallback from 'components/LinkCallback';
import {dispatchSSR} from '../../app/helpers/helpers';

const UserDropdown = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: AppState) => state.auth.data);
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    Promise.allSettled([
      logout(),
      user?.id && dispatch({type: 'auth/logout', payload: user.id})
    ])
      .then(() => {
        setCookie('httpTokenDelete', 'true');
        window.location.href = '/login';
      });
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