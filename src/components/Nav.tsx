import dynamic from 'next/dynamic';
import React from 'react';
import { useSelector } from 'react-redux';
import {AppState} from '../app/store';

const Nav = () => {
  const hidden = ['/login', '/register', '/login/reset'];
  const path = useSelector((state: AppState) => state.root.routerPath);
  const Navigation = dynamic(() => import('./Navigation'), {ssr: true});

  return (
    <>
      {!hidden.includes(path) && <Navigation />}
    </>
  );
};

export default Nav;