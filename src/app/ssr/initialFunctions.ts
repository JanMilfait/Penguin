import { AuthApi, setToken } from '../../features/auth/authSlice';
import { AppStore } from '../store';
import { GetServerSidePropsContext } from 'next';
import { deleteCookie, hasCookie, setCookie, getCookie } from 'cookies-next';
import { setIsMobile } from '../../features/root/rootSlice';
import {PostApi} from '../../features/post/postSlice';
import { FriendApi } from 'features/friend/friendSlice';

interface InitialFunctions {
  (store: AppStore, context: GetServerSidePropsContext): Promise<void>;
}

export const init: InitialFunctions = async (store, {req, res} ) => {

  if (req.headers['user-agent'] && req.headers['user-agent'].includes('Mobile')) {
    store.dispatch(setIsMobile(true));
  }
  if (hasCookie('dispatch', {req, res})) {
    store.dispatch(JSON.parse(getCookie('dispatch', {req, res}) as string));
    deleteCookie('dispatch', {req, res});
  }
};

export const authenticate: InitialFunctions = async (store, {req, res}) => {
  checkDeleteToken(req, res);

  const token = req?.cookies?.token;

  if (!token) {
    res.writeHead(302, { Location: '/login' });
    res.end();
  }

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
};

export const authenticateUnprotected: InitialFunctions = async (store, {req, res}) => {
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

export const getSidebarFriends = async (store: AppStore) => {
  const id = await store.getState().auth.data?.id;
  id && await store.dispatch(FriendApi.endpoints.getFriends.initiate({id: id, page: 1, limit: 20}));
};

export const getPosts = async (store: AppStore) => {
  await store.dispatch(PostApi.endpoints.getPosts.initiate({page: 1, limit: 3, media: 'all', category: 'latest'}));
};