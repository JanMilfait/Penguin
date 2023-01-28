import React, { useEffect } from 'react';
import s from 'styles/6_components/Navigation.module.scss';
import Logo from './Logo';
import SearchBar from 'features/search/SearchBar';
import NavIcons from './NavIcons';
import {AppDispatch, AppState} from '../app/store';
import {useDispatch, useSelector } from 'react-redux';
import {setFriendsSBSlideIn} from '../features/chat/chatSlice';

function Navigation() {
  const dispatch = useDispatch<AppDispatch>();
  const id = useSelector((state: AppState) => state.auth.data?.id);
  const isAuth = typeof id === 'number';

  useEffect(() => {
    dispatch(setFriendsSBSlideIn());
  }, []);

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

export default Navigation;