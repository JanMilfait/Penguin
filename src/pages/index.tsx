import {AppState, wrapper} from '../app/store';
import {authenticate} from '../app/helpers/initialFunctionProps';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import Navigation from 'components/Navigation';

const Home: NextPage = () => {
  const { token, data } = useSelector((state: AppState) => state.auth);


  return (
    <>
      <Navigation />
      <button>{data && data.name}</button>
      <p>
        Go to <Link href="/profile">Profile</Link> {token}
      </p>
    </>
  );
};

export default Home;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await authenticate(store, ctx);

  return {props: {}};
});
