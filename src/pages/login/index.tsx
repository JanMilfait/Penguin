import {useLoginMutation} from 'features/auth/authSlice';
import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Router from 'next/router';
import {wrapper} from '../../app/store';
import {authenticateUnprotected} from '../_app';

const Login: NextPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [login, { isSuccess, isError, error }] = useLoginMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!email || !password) {
      // dispatch modal error
      return;
    }
    const response = await login({email, password});
    const token = await response.data.token;

    if (token) {
      const expire = new Date(Date.now() + parseInt(process.env.NEXT_PUBLIC_COOKIE_EXPIRES_SECONDS));
      document.cookie = `token=${token}; SameSite=Strict; expires=${expire}`;
      Router.push('/');
    }
  };

  let message = null;
  if (isSuccess) {
    message = <p>You have been logged in.</p>;
  }
  if (isError) {
    message = <p>{error.data.message ?? 'There was an error logging in.'}</p>;
  }

  return (
    <div className="container">
      <Head>
        <title>Penguin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="row">
        <h1 className="text-center">
         Login
        </h1>
        {message}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input type="email" className="form-control" id="email" aria-describedby="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <Link href="/login/reset">reset password</Link>
        <Link href="/register">register</Link>
      </main>
    </div>
  );
};

export default Login;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await authenticateUnprotected(store, ctx);

  return {props: {}};
});