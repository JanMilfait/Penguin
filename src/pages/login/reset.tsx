import type { NextPage } from 'next';
import Link from 'next/link';
import { useState } from 'react';
import {wrapper} from '../../app/store';
import {authenticateUnprotected} from '../../app/ssr/initialFunctions';

const Reset: NextPage = () => {

  const [email, setEmail] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!email) {
      // dispatch modal error
      return;
    }
    console.log(email);
  };

  return (
    <div className="container">
      <h1 className="text-center">
        Forgot Password
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" aria-describedby="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Reset Password</button>
      </form>
      <Link href="/login">Go back</Link>
    </div>
  );
};

export default Reset;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await authenticateUnprotected(store, ctx);

  return {props: {}};
});