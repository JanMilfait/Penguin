import {AuthApi, setToken} from '../../features/auth/authSlice';
import {AppStore} from '../store';

export const authenticate = async (store: AppStore, {req, res}) => {
  const token = req?.cookies?.token;
  if (token) {
    await store.dispatch(setToken(token));
    const response = await store.dispatch(AuthApi.endpoints.fetchClient.initiate([]));

    if (response.isError) {
      console.error(`Error: ${response.error.message || 'Couldn\'t log in'}`);

      res.writeHead(302, { Location: '/login' });
      res.end();
    }
  } else {
    res.writeHead(302, { Location: '/login' });
    res.end();
  }
};

export const authenticateUnprotected = async (store: AppStore, {req, res}) => {
  const token = req?.cookies?.token;
  if (token) {
    await store.dispatch(setToken(token));
    const response = await store.dispatch(AuthApi.endpoints.fetchClient.initiate([]));

    if (response.isSuccess) {
      res.writeHead(302, { Location: '/' });
      res.end();
    }
  }
};