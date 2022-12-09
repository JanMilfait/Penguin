import type { NextPage } from 'next';
import {AppDispatch, wrapper} from '../../app/store';
import {authenticateUnprotected} from '../../app/ssr/initialFunctions';
import s from '../../styles/6_components/SignForm.module.scss';
import Logo from '../../components/Logo';
import {hasErrMessage} from '../../app/helpers/errorHandling';
import Link from 'next/link';
import { useResetPasswordMutation } from '../../features/auth/authSlice';
import Router from 'next/router';
import { useDispatch } from 'react-redux';
import {setModal} from '../../features/root/rootSlice';

const Reset: NextPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [reset, { error, isSuccess }] = useResetPasswordMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // await reset({email: e.target.email.value});
    //
    // isSuccess && Router.push('/login').then(() => {
    //   dispatch(setModal({
    //     isOpen: true,
    //     props: {
    //       type: 'alert',
    //       icon: 'success',
    //       title: 'Reset password',
    //       message: 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam folder.'
    //     }
    //   }));
    // });


    Router.push('/login').then(() => {
      dispatch(setModal({
        isOpen: true,
        props: {
          type: 'alert',
          icon: 'success',
          title: 'Password reset email successfully sent',
          message: 'Check your email for a link to reset your password. If it doesn’t appear within a few minutes, check your spam.'
        }
      }));
    });
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
                <button className="button--fluid button--blue" type="submit">Reset Password</button>
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