import type { NextPage } from 'next';
import {wrapper} from '../app/store';
import {authenticateUnprotected} from '../app/ssr/initialFunctions';
import s from '../styles/6_components/SignForm.module.scss';
import Logo from '../components/Logo';
import RegisterForm from 'features/auth/RegisterForm';

const Register: NextPage = () => {

  return (
    <div className={s.signForm}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-6 offset-lg-3">
            <Logo width={100} height={100} />
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await authenticateUnprotected(store, ctx);

  return {props: {}};
});