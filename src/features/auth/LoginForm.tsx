import React, { useRef } from 'react';
import { useLoginMutation } from './authSlice';
import { setCookie } from 'cookies-next';
import Router from 'next/router';
import Link from 'next/link';
import { hasErrMessage } from 'app/helpers/errorHandling';
import s from 'styles/6_components/SignForm.module.scss';

const LoginForm = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [login, { error }] = useLoginMutation();
  const [clicked, setClicked] = React.useState(false);


  const setDemo = () => {
    if (!emailRef.current || !passwordRef.current) return;

    emailRef.current.value = process.env.NEXT_PUBLIC_DEMO_EMAIL!;
    passwordRef.current.value = process.env.NEXT_PUBLIC_DEMO_PASSWORD!;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setClicked(true);

    const response = await login({
      email: e.target.email.value,
      password: e.target.password.value
    });

    if ('data' in response && 'token' in response.data) {
      setCookie('token', response.data.token);
      Router.push('/');
    }
    setClicked(false);
  };


  return (
    <>
      <form onSubmit={handleSubmit}>
        <h3>Log into Penquin</h3>
        <div>
          <input ref={emailRef} type="text" name="email" placeholder="Email" className={hasErrMessage(error, 'email') ? 'isInvalid' : ''} />
          {hasErrMessage(error, 'email') && <p className="isInvalidText">{error.data?.validationErrors?.email.join('\n')}</p>}
        </div>
        <div>
          <input ref={passwordRef}  type="password" name="password" placeholder="Password" className={hasErrMessage(error, 'password') ? 'isInvalid' : ''} />
          {hasErrMessage(error, 'password') && <p className="isInvalidText">{error.data?.validationErrors?.password.join('\n')}</p>}
        </div>
        <div>
          <button className="button--fluid button--blue" type="submit" disabled={clicked}>Log In</button>
        </div>
        <div className={s.signForm__links}>
          <Link href="/register">Register</Link>
          <a>·</a>
          <Link href="/login/reset">Forgot password?</Link>
        </div>
      </form>

      {process.env.NEXT_PUBLIC_DEMO_ACTIVE === 'on' &&
        <div className={s.signForm__demo}>
          <button className="button--blue" onClick={setDemo}>Log In as Demo User</button>
        </div>
      }
    </>
  );
};

export default LoginForm;