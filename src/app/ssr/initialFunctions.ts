import { AuthApi, setToken } from '../../features/auth/authSlice';
import { AppStore } from '../store';
import { GetServerSidePropsContext } from 'next';
import { deleteCookie, hasCookie, setCookie, getCookie } from 'cookies-next';
import { setIsMobile, setRouterPath,  } from '../../features/root/rootSlice';
import { PostApi } from '../../features/post/postSlice';
import { FriendApi } from 'features/friend/friendSlice';

interface InitialFunctions {
  (store: AppStore, context: GetServerSidePropsContext, redirect?: string|boolean): unknown;
}

export const init: InitialFunctions = async (store, {req, res, resolvedUrl} ) => {
  store.dispatch(setRouterPath(resolvedUrl));

  if (req.headers['user-agent'] && req.headers['user-agent'].includes('Mobile')) {
    store.dispatch(setIsMobile(true));
  }
  if (hasCookie('dispatch', {req, res})) {
    store.dispatch(JSON.parse(getCookie('dispatch', {req, res}) as string));
    deleteCookie('dispatch', {req, res});
  }
  if (hasCookie('httpTokenDelete', {req, res})) {
    deleteCookie('httpTokenDelete', {req, res});
    deleteCookie('token', {req, res});
  }
};

export const authenticate: InitialFunctions = async (store, {req, res}) => {
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

export const authenticateUnprotected: InitialFunctions = async (store, {req, res}, redirect = '/') => {
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

    if (!redirect) {
      return response.data;
    } else {
      res.writeHead(302, {Location: redirect as string});
      res.end();
    }
  }
};

export const getFriends = async (store: AppStore) => {
  const id = await store.getState().auth.data?.id;
  id && await store.dispatch(FriendApi.endpoints.getFriends.initiate({id: id, page: 1, limit: 10}));
  id && await store.dispatch(FriendApi.endpoints.getFriends.initiate({id: id, page: 2, limit: 10}));
};

export const getFriendsIds = async (store: AppStore, id: number) => {
  await store.dispatch(FriendApi.endpoints.getFriendsIds.initiate({id: id}));
};

export const getSendPendings = async (store: AppStore) => {
  await store.dispatch(FriendApi.endpoints.getSendPendings.initiate(undefined));
};

export const getPosts = async (store: AppStore) => {
  await store.dispatch(PostApi.endpoints.getPosts.initiate({page: 1, limit: 3, media: 'all', category: 'latest'}));
};

export const getUser = async (store: AppStore, id: number) => {
  await store.dispatch(AuthApi.endpoints.getUser.initiate({id}));
};

export const getUserPosts = async (store: AppStore, id: number) => {
  await store.dispatch(PostApi.endpoints.getUserPosts.initiate({page: 1, limit: 3, id}));
};
