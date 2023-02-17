import type { NextPage } from 'next';
import {wrapper} from '../app/store';
import {authenticateUnprotected, init} from '../app/ssr/functions';
import s from '../styles/6_components/SignForm.module.scss';
import Logo from '../components/Logo';
import RegisterForm from 'features/auth/RegisterForm';

const Register: NextPage = () => {

  return (
    <div className={s.signForm}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-6 offset-lg-3">
            <div className="pe-none">
              <Logo width={100} height={100} hardRefresh={true} />
            </div>
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await init(store, ctx);
  const response = await authenticateUnprotected(store, ctx);
  if (response?.kill) return {props: {}};

  // ...

  return {props: {}};
});