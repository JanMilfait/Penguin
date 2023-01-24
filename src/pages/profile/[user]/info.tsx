import {wrapper} from '../../../app/store';
import {authenticateUnprotected, getFriendsIds, getSendPendings, getFriends, getUser, getUserPosts, init} from '../../../app/ssr/initialFunctions';
import type { NextPage } from 'next';
import {setProfile} from '../../../features/auth/authSlice';
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
  const user = ctx.params?.user;
  if (!user) return { notFound: true };
  const userId = parseInt(user as string);
  await store.dispatch(setProfile({id: userId}));

  await init(store, ctx);
  const auth = await authenticateUnprotected(store, ctx, false);

  await Promise.all([
    auth && getFriends(store),
    auth && getSendPendings(store),
    getFriendsIds(store, userId),
    getUser(store, userId),
    getUserPosts(store, userId)
  ]);

  return {props: {}};
});