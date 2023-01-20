import {AppState, wrapper} from '../app/store';
import {authenticate, getPosts, getFriends, init} from '../app/ssr/initialFunctions';
import type { NextPage } from 'next';
import { useSelector } from 'react-redux';
import Navigation from 'components/Navigation';
import dynamic from 'next/dynamic';
import PostAdd from 'features/post/PostAdd';
import Posts from 'features/post/Posts';

const Home: NextPage = () => {
  const isMobile = useSelector((state: AppState) => state.root.isMobile);

  const DesktopFriendsAndChats = dynamic(() => import('features/chat/DesktopFriendsAndChats'), { ssr: true });
  const MobileFriendsAndChats = dynamic(() => import('features/chat/MobileFriendsAndChats'), { ssr: true });
  const Sidebar = dynamic(() => import('components/Sidebar'), { ssr: true });

  return (
    <>
      <Navigation />
      { !isMobile ? <DesktopFriendsAndChats /> : <MobileFriendsAndChats /> }
      <div className="container container-1140 container-sidebar">
        <div className="row mt-4">
          <div className="col-12 col-xl mt-3">
            <PostAdd />
            <Posts />
          </div>
          <div className="col-3 offset-1 d-none d-xl-block ">
            { !isMobile && <Sidebar /> }
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await init(store, ctx);
  await authenticate(store, ctx);

  await Promise.all([
    getFriends(store),
    getPosts(store)
  ]);

  return {props: {}};
});
