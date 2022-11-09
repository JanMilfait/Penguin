import { wrapper } from '../app/store';
import {authenticate} from '../app/helpers/initialProps';
import {selectClient} from 'features/auth/authSlice';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useSelector } from 'react-redux';

const Home: NextPage = () => {
  const {token, data} = useSelector(selectClient);


  return (
    <div className="container">
      <button>{data?.name ?? 's'}</button>
      <p>
        Go to <Link href="/profile">Profile</Link> {token}
      </p>
    </div>
  );
};

export default Home;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await authenticate(store, ctx);

  return {props: {}};
});
