import {AppState, wrapper} from '../app/store';
import {authenticate, getFriends, init} from '../app/ssr/initialFunctions';
import type { NextPage } from 'next';
import { useSelector } from 'react-redux';
import Navigation from 'components/Navigation';
import dynamic from 'next/dynamic';
import SettingsForm from '../features/auth/SettingsForm';
import s from 'styles/6_components/Settings.module.scss';

const Settings: NextPage = () => {
  const isMobile = useSelector((state: AppState) => state.root.isMobile);

  const DesktopFriendsAndChats = dynamic(() => import('features/chat/DesktopFriendsAndChats'), { ssr: true });
  const MobileFriendsAndChats = dynamic(() => import('features/chat/MobileFriendsAndChats'), { ssr: true });

  return (
    <>
      <Navigation />
      { !isMobile ? <DesktopFriendsAndChats /> : <MobileFriendsAndChats /> }
      <div className="container container-1140 container-sidebar">
        <div className={s.settings}>
          <div className="row h-100 align-items-center">
            <div className="col-12 col-md-6 offset-0 offset-md-3">
              <SettingsForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await init(store, ctx);
  await authenticate(store, ctx);

  await Promise.all([
    getFriends(store)
  ]);

  return {props: {}};
});
