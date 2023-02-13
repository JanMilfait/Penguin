import type { NextPage } from 'next';
import { wrapper } from '../../app/store';
import {authenticateUnprotected, init} from '../../app/ssr/functions';
import LoginForm from 'features/auth/LoginForm';
import Logo from '../../components/Logo';
import s from '../../styles/6_components/SignForm.module.scss';

const Login: NextPage = () => {

  return (
    <div className={s.signForm}>
      <div className="container">
        <div className="row">
          <div className="col-12 col-lg-6 offset-lg-3">
            <div className="pe-none">
              <Logo width={100} height={100} hardRefresh={true} />
            </div>
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

export const getServerSideProps = wrapper.getServerSideProps(store => async (ctx) => {
  await init(store, ctx);
  await authenticateUnprotected(store, ctx);

  return {props: {}};
});