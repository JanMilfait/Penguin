import Link from 'next/link';
import Router from 'next/router';
import s from 'styles/6_components/Dropdown.module.scss';
import { setCookie } from 'cookies-next';
import { useLogoutMutation } from './authSlice';
import React from 'react';

const UserDropdown = () => {
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
    setCookie('httpTokenDelete', 'true');
    Router.push('/login');
  };

  return (
    <ul className={s.dropdown}>
      <li><Link href="/profile">Profile</Link></li>
      <li><Link href="/edit">Edit Profile</Link></li>
      <li><Link href="/settings">Settings</Link></li>
      <li><a onClick={() => handleLogout()}>Logout</a></li>
    </ul>
  );
};

export default UserDropdown;