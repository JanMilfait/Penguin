import React from 'react';
import s from 'styles/6_components/Navigation.module.scss';
import Logo from './Logo';
import SearchBar from 'features/search/SearchBar';
import NavIcons from './NavIcons';
import {AppState} from '../app/store';
import { useSelector } from 'react-redux';
import {useGetNotificationsQuery} from '../features/notification/notificationSlice';

function Navigation() {
  const id = useSelector((state: AppState) => state.auth.data?.id);
  const isAuth = typeof id === 'number';
  useGetNotificationsQuery(undefined, {skip: !isAuth});

  return (
    <nav className={s.navigation}>
      <div className={s.navigation__placeholder} style={!isAuth ? {height: '80px'} : {}}></div>
      <div className={s.navigation__wrapper}>
        <div className="container">
          <div className="row">
            <div className="col-auto col-lg">
              <div className="d-flex align-items-center">
                <Logo width={60} height={60} hardRefresh={!isAuth} />
              </div>
            </div>
            <div className="col col-lg-5">
              <div className="d-flex justify-content-center align-items-center h-100">
                <SearchBar />
              </div>
            </div>
            {isAuth ?
              <div className="col-12 col-lg-5 mt-2 mt-lg-0">
                <div className="d-flex justify-content-center align-items-center h-100">
                  <NavIcons />
                </div>
              </div>
              :
              <div className="col d-none d-lg-block"></div>
            }
          </div>
        </div>
      </div>
    </nav>
  );
}

export default React.memo(Navigation);