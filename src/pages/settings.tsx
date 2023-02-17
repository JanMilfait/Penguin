import {wrapper} from '../app/store';
import {authenticate, getFriends, init} from '../app/ssr/functions';
import type { NextPage } from 'next';
import SettingsForm from '../features/auth/SettingsForm';
import s from 'styles/6_components/Settings.module.scss';

const Settings: NextPage = () => {

  return (
    <div className="container container-1140 container-sidebar">
      <div className={s.settings}>
        <div className="row h-100 align-items-center">
          <div className="col-12 col-md-6 offset-0 offset-md-3">
            <SettingsForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await init(store, ctx);
  const response = await authenticate(store, ctx);
  if (response?.kill) return {props: {}};

  await Promise.all([
    getFriends(store)
  ]);

  return {props: {}};
});
