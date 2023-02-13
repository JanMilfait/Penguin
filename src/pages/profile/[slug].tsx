import {AppState, wrapper} from '../../app/store';
import {init, profilePage} from '../../app/ssr/functions';
import type { NextPage } from 'next';
import PostAdd from '../../features/post/PostAdd';
import {useSelector } from 'react-redux';
import UserPosts from 'features/post/UserPosts';
import ProfileHead from '../../features/auth/ProfileHead';
import ProfileSidebar from '../../features/auth/ProfileSidebar';

const Profile: NextPage = () => {
  const authSlug = useSelector((state: AppState) => state.auth.data?.slug);
  const slug = useSelector((state: AppState) => state.auth.profile.slug);

  return (
    <div className="container container-1140 container-sidebar">
      <div className="row mt-4">
        <div className="col-12">
          <ProfileHead />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12 col-xl-3">
          <ProfileSidebar />
        </div>
        <div className="col-12 col-xl offset-0 offset-xl-1">
          {authSlug === slug && <div className="mb-5"><PostAdd /></div>}
          <UserPosts />
        </div>
      </div>
    </div>
  );
};

export default Profile;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await init(store, ctx);
  const error = await profilePage(store, ctx);

  if (error?.status === 404) return { notFound: true };
  if (error) return { redirect: { destination: '/error', permanent: false } };

  return {props: {}};
});