import React from 'react';
import { useLoginMutation } from './authSlice';
import { setCookie } from 'cookies-next';
import Router from 'next/router';
import Link from 'next/link';
import { hasErrMessage } from 'app/helpers/errorHandling';
import s from 'styles/6_components/SignForm.module.scss';

const LoginForm = () => {
  const [login, { error }] = useLoginMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const response = await login({
      email: e.target.email.value,
      password: e.target.password.value
    });

    if ('data' in response && 'token' in response.data) {
      setCookie('token', response.data.token);
      Router.push('/');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Log into Penquin</h3>
      <div>
        <input type="text" name="email" placeholder="Email" className={hasErrMessage(error, 'email') ? 'isInvalid' : ''} />
        {hasErrMessage(error, 'email') && <p className="isInvalidText">{error.data?.validationErrors?.email.join('\n')}</p>}
      </div>
      <div>
        <input type="password" name="password" placeholder="Password" className={hasErrMessage(error, 'password') ? 'isInvalid' : ''} />
        {hasErrMessage(error, 'password') && <p className="isInvalidText">{error.data?.validationErrors?.password.join('\n')}</p>}
      </div>
      <div>
        <button className="button--fluid button--blue" type="submit">Log In</button>
      </div>
      <div className={s.signForm__links}>
        <Link href="/register">Register</Link>
        <a>·</a>
        <Link href="/login/reset">Forgot password?</Link>
      </div>
    </form>
  );
};

export default LoginForm;