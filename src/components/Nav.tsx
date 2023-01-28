import {onHiddenNavRoute} from 'features/root/rootSlice';
import dynamic from 'next/dynamic';
import React from 'react';
import { useSelector } from 'react-redux';
import {AppState} from '../app/store';

const Nav = () => {
  const isHidden = useSelector((state: AppState) => onHiddenNavRoute(state));
  const Navigation = dynamic(() => import('./Navigation'), {ssr: true});

  return (
    <>
      {!isHidden && <Navigation />}
    </>
  );
};

export default React.memo(Nav);