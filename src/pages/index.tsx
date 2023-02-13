import {AppState, wrapper} from '../app/store';
import {authenticate, getPosts, getFriends, init} from '../app/ssr/functions';
import type { NextPage } from 'next';
import { useSelector } from 'react-redux';
import dynamic from 'next/dynamic';
import PostAdd from 'features/post/PostAdd';
import Posts from 'features/post/Posts';

const Home: NextPage = () => {
  const isMobile = useSelector((state: AppState) => state.root.isMobile);
  const Sidebar = dynamic(() => import('components/Sidebar'), { ssr: true });

  return (
    <div className="container container-1140 container-sidebar">
      <div className="row mt-4">
        <div className="col-12 col-xl mt-3">
          <PostAdd />
          <Posts />
        </div>
        <div className="col-3 offset-1 d-none d-xl-block mt-3">
          { !isMobile && <Sidebar /> }
        </div>
      </div>
    </div>
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
