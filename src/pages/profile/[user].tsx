import {AppState, wrapper} from '../../app/store';
import {authenticateUnprotected, getFriendsIds, getSendPendings, getFriends, getUser, getUserPosts, init, getUserFriends} from '../../app/ssr/initialFunctions';
import type { NextPage } from 'next';
import PostAdd from '../../features/post/PostAdd';
import {useSelector } from 'react-redux';
import UserPosts from 'features/post/UserPosts';
import {setProfile} from '../../features/auth/authSlice';
import ProfileHead from '../../features/auth/ProfileHead';
import ProfileSidebar from '../../features/auth/ProfileSidebar';
import {UserData} from '../../features/auth/authSlice.types';

const Profile: NextPage = () => {
  const id = useSelector((state: AppState) => state.auth.data?.id);
  const userId = useSelector((state: AppState) => state.auth.profile.id);

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
          {id === userId && <div className="mb-5"><PostAdd /></div>}
          <UserPosts />
        </div>
      </div>
    </div>
  );
};

export default Profile;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  const user = ctx.params?.user;
  if (!user) return { notFound: true };
  const userId = parseInt(user as string);
  await store.dispatch(setProfile({id: userId}));

  await init(store, ctx);
  const auth = await authenticateUnprotected(store, ctx, false) as UserData|undefined;

  await Promise.all([
    auth && getFriends(store),
    auth && getSendPendings(store),
    auth && getFriendsIds(store, auth.id),
    getFriendsIds(store, userId),
    getUser(store, userId),
    getUserFriends(store, userId),
    getUserPosts(store, userId)
  ]);

  return {props: {}};
});