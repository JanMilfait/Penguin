import React from 'react';
import { useRegisterMutation } from './authSlice';
import { setCookie } from 'cookies-next';
import Router from 'next/router';
import Link from 'next/link';
import { hasErrMessage } from 'app/helpers/errorHandling';
import s from 'styles/6_components/SignForm.module.scss';

const RegisterForm = () => {
  const [register, { error }] = useRegisterMutation();
  const [clicked, setClicked] = React.useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setClicked(true);

    const response = await register({
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      password_confirmation: e.target.password_confirmation.value
    });

    if ('data' in response && 'token' in response.data) {
      setCookie('token', response.data.token);
      Router.push('/');
    }
    setClicked(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sing up</h3>
      <div>
        <input type="text" name="name" placeholder="Name" className={hasErrMessage(error, 'name') ? 'isInvalid' : ''} />
        {hasErrMessage(error, 'name') && <p className="isInvalidText">{error.data?.validationErrors?.name.join('\n')}</p>}
      </div>
      <div>
        <input type="text" name="email" placeholder="Email" className={hasErrMessage(error, 'email') ? 'isInvalid' : ''} />
        {hasErrMessage(error, 'email') && <p className="isInvalidText">{error.data?.validationErrors?.email.join('\n')}</p>}
      </div>
      <div>
        <input type="password" name="password" placeholder="Password" className={hasErrMessage(error, 'password') ? 'isInvalid' : ''} />
        {hasErrMessage(error, 'password') && <p className="isInvalidText">{error.data?.validationErrors?.password.join('\n')}</p>}
      </div>
      <div>
        <input type="password" name="password_confirmation" placeholder="Password" className={hasErrMessage(error, 'password_confirmation') ? 'isInvalid' : ''} />
        {hasErrMessage(error, 'password_confirmation') && <p className="isInvalidText">{error.data?.validationErrors?.password_confirmation.join('\n')}</p>}
      </div>
      <div>
        <button className="button--fluid button--blue" type="submit" disabled={clicked}>Sign up</button>
      </div>
      <div className={s.signForm__links}>
        <Link href="/login">Go to login</Link>
      </div>
    </form>
  );
};

export default RegisterForm;