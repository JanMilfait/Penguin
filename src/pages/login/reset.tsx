import type { NextPage } from 'next';
import { AppDispatch, wrapper } from '../../app/store';
import { authenticateUnprotected } from '../../app/ssr/initialFunctions';
import s from '../../styles/6_components/SignForm.module.scss';
import Logo from '../../components/Logo';
import { hasErrMessage } from '../../app/helpers/errorHandling';
import Link from 'next/link';
import { useResetPasswordMutation } from '../../features/auth/authSlice';
import Router from 'next/router';
import { useDispatch } from 'react-redux';
import { setOpenModal } from '../../features/root/rootSlice';
import { useState } from 'react';

const Reset: NextPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [reset, { error }] = useResetPasswordMutation();
  const [clicked, setClicked] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setClicked(true);

    const response = await reset({email: e.target.email.value});

    if ('data' in response && 'status' in response.data && response.data.status === 'We have emailed your password reset link!') {
      Router.push('/login').then(() => {
        dispatch(setOpenModal({
          props: {
            type: 'alert',
            icon: 'success',
            title: 'Password reset email successfully sent',
            message: 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam.'
          }
        }));
      });
    }
    setClicked(false);
  };

  return (
    <div className={s.signForm}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-6 offset-lg-3">
            <Logo width={100} height={100} />
            <form onSubmit={handleSubmit}>
              <div>
                <input type="text" name="email" placeholder="Email" className={hasErrMessage(error, 'email') ? 'isInvalid' : ''} />
                {hasErrMessage(error, 'email') && <p className="isInvalidText">{error.data?.validationErrors?.email.join('\n')}</p>}
              </div>
              <div>
                <button className="button--fluid button--blue" type="submit" disabled={clicked}>Reset password</button>
              </div>
              <div className={s.signForm__links + ' justify-content-start'}>
                <Link href="/login">Go back</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reset;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await authenticateUnprotected(store, ctx);

  return {props: {}};
});