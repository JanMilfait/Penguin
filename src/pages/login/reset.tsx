import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';

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
      <Head>
        <title>Penguin</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="row">
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
      </main>
    </div>
  );
};

export default Reset;

export const getServerSideProps = async ({req, res}) => {
  const token = req?.cookies?.token;
  if (token) {
    res.writeHead(302, { Location: '/' });
    res.end();
  }
  return {props: {}};
};