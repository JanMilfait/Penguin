import {wrapper} from '../../../app/store';
import {init, profilePage} from '../../../app/ssr/functions';
import type { NextPage } from 'next';
import ProfileHead from '../../../features/auth/ProfileHead';
import ProfileInfoResult from '../../../features/auth/ProfileInfoResult';

const Info: NextPage = () => {
  return (
    <div className="container container-1140 container-sidebar">
      <div className="row mt-4">
        <div className="col-12">
          <ProfileHead />
        </div>
      </div>
      <ProfileInfoResult />
    </div>
  );
};

export default Info;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await init(store, ctx);
  const error = await profilePage(store, ctx);

  if (error?.status === 404) return { notFound: true };
  if (error) return { redirect: { destination: '/error', permanent: false } };

  return {props: {}};
});