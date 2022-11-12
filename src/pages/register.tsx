import { useRegisterMutation } from 'features/auth/authSlice';
import type { NextPage } from 'next';
import Link from 'next/link';
import Router from 'next/router';
import { useState } from 'react';
import {wrapper} from '../app/store';
import {authenticateUnprotected} from '../app/helpers/initialFunctionProps';
import { setCookie } from 'cookies-next';

const Register: NextPage = () => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');
  const [register, { isSuccess, isError, error }] = useRegisterMutation();


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name || !email || !password || !password_confirmation) {
      // dispatch modal error
      return;
    }
    if (password !== password_confirmation) {
      // dispatch modal error
      return;
    }
    const response = await register({name, email, password, password_confirmation});

    if ('data' in response && 'token' in response.data) {
      setCookie('token', response.data.token);
      Router.push('/');
    }
  };


  let message = null;
  if (isSuccess) {
    message = <p>Your account has been created.</p>;
  }
  if (isError) {
    message = <p>{hasErrMessage(error) ? error.data.message :  'There was an error creating your account.'}</p>;
  }

  return (
    <div className="container">
      <h1 className="text-center">
        Register
      </h1>
      {message}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" aria-describedby="name" placeholder="Enter name" onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" aria-describedby="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="form-group">
          <label htmlFor="password_confirmation">Password Confirmation</label>
          <input type="password" className="form-control" id="password_confirmation" placeholder="Password Confirmation" onChange={(e) => setPasswordConfirmation(e.target.value)} />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      <Link href="/login">go to login</Link>
    </div>
  );
};

export default Register;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await authenticateUnprotected(store, ctx);

  return {props: {}};
});