import type {NextPage} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {useSelector} from 'react-redux';

import {wrapper} from '../app/store';
import {selectClient} from 'features/auth/authSlice';
import {authenticate} from './_app';

const Profile: NextPage = () => {
  const token = useSelector(selectClient).token;

  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="row">
        <h1 className="text-center">
          Your Featuring Code, {token}
        </h1>
        <p>
          Go to <Link href="/">Home</Link>
        </p>

        <p>
          Hello, {token}!
        </p>
      </main>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await authenticate(store, ctx);

  return {props: {}};
});

export default Profile;
