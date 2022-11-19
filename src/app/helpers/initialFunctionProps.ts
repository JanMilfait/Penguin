import {AuthApi, setToken} from '../../features/auth/authSlice';
import {AppStore} from '../store';
import {GetServerSidePropsContext} from 'next';
import {deleteCookie, hasCookie, setCookie } from 'cookies-next';

interface InitialFunctionProps {
  (store: AppStore, context: GetServerSidePropsContext): Promise<void>;
}

export const authenticate: InitialFunctionProps = async (store, {req, res}) => {
  checkDeleteToken(req, res);

  const token = req?.cookies?.token;
  if (token) {
    setCookie('token', token, {
      req,
      res,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NEXT_PUBLIC_APP_ENV === 'production',
      maxAge: 60 * 60 * 24 * 3
    });

    await store.dispatch(setToken(token));
    const response = await store.dispatch(AuthApi.endpoints.fetchClient.initiate());

    if (response.isError) {
      if ('message' in response.error) {
        console.error(`Error: ${response.error.message || 'Couldn\'t log in'}`);
      }

      res.writeHead(302, { Location: '/login' });
      res.end();
    }
  } else {
    res.writeHead(302, { Location: '/login' });
    res.end();
  }
};

export const authenticateUnprotected: InitialFunctionProps = async (store, {req, res}) => {
  checkDeleteToken(req, res);

  const token = req?.cookies?.token;
  if (token) {
    setCookie('token', token, {
      req,
      res,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NEXT_PUBLIC_APP_ENV === 'production',
      maxAge: 60 * 60 * 24 * 3
    });

    await store.dispatch(setToken(token));
    const response = await store.dispatch(AuthApi.endpoints.fetchClient.initiate());

    if (response.isSuccess) {
      res.writeHead(302, { Location: '/' });
      res.end();
    }
  }
};

const checkDeleteToken = (req: GetServerSidePropsContext['req'], res: GetServerSidePropsContext['res']) => {
  if (hasCookie('httpTokenDelete', {req, res})) {
    deleteCookie('httpTokenDelete', {req, res});
    deleteCookie('token', {req, res});
  }
};
