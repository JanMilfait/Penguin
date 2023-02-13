import {AuthApi, setProfile, setToken} from '../../features/auth/authSlice';
import { AppStore } from '../store';
import { GetServerSidePropsContext } from 'next';
import { deleteCookie, hasCookie, setCookie, getCookie } from 'cookies-next';
import { setIsMobile, setRouterPath } from '../../features/root/rootSlice';
import {expandComments, PostApi, setHiddenPosts, setPost} from '../../features/post/postSlice';
import { FriendApi } from 'features/friend/friendSlice';
import {CommentApi} from '../../features/comment/commentSlice';
import {UserData} from '../../features/auth/authSlice.types';
import { SerializedError } from '@reduxjs/toolkit';

interface Functions {
  (store: AppStore, context: GetServerSidePropsContext, redirect?: string|boolean): unknown;
}

// ***********************
// Page Init
// ***********************
export const init: Functions = async (store, {req, res, resolvedUrl} ) => {
  store.dispatch(setRouterPath(resolvedUrl));

  if (req.headers['user-agent'] && req.headers['user-agent'].includes('Mobile')) {
    store.dispatch(setIsMobile(true));
  }

  if (hasCookie('httpTokenDelete', {req, res})) {
    deleteCookie('httpTokenDelete', {req, res});
    deleteCookie('token', {req, res});
  }

  if (hasCookie('dispatch', {req, res})) {
    store.dispatch(JSON.parse(getCookie('dispatch', {req, res}) as string));
    deleteCookie('dispatch', {req, res});
  }

  if (hasCookie('hiddenPosts', {req, res})) {
    const hiddenPost = JSON.parse(getCookie('hiddenPosts', {req, res}) as string || '{}') ?? {};
    store.dispatch(setHiddenPosts(hiddenPost));
  }
};


//***********************
// Authenticate
//***********************
export const authenticate: Functions = async (store, {req, res}) => {
  const token = req?.cookies?.token;

  if (!token) {
    if (!res.finished) {
      res.writeHead(302, { Location: '/login' });
      res.end();
    }
    return;
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
    deleteCookie('token', {
      req,
      res,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NEXT_PUBLIC_APP_ENV === 'production'
    });
    if (!res.finished) {
      res.writeHead(302, { Location: '/login' });
      res.end();
    }
  }
};

//***********************
// Authenticate Unprotected
//***********************
export const authenticateUnprotected: Functions = async (store, {req, res}, redirect = '/') => {
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
      deleteCookie('token', {
        req,
        res,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NEXT_PUBLIC_APP_ENV === 'production'
      });
      if (!res.finished) {
        res.writeHead(302, { Location: '/login' });
        res.end();
      }
      return;
    }

    if (!redirect) {
      return response.data;
    } else {
      if (!res.finished) {
        res.writeHead(302, {Location: redirect as string});
        res.end();
      }
    }
  }
};

//***********************
// Hydration Queries
//***********************
export const getFriends = async (store: AppStore) => {
  const id = await store.getState().auth.data?.id;
  id && await store.dispatch(FriendApi.endpoints.getFriends.initiate({id: id, page: 1, limit: 20}));
};

export const getFriendsIds = async (store: AppStore, id: number) => {
  await store.dispatch(FriendApi.endpoints.getFriendsIds.initiate({id}));
};

export const getSendPendings = async (store: AppStore) => {
  await store.dispatch(FriendApi.endpoints.getSendPendings.initiate(undefined));
};

export const getPosts = async (store: AppStore) => {
  await store.dispatch(PostApi.endpoints.getPosts.initiate({page: 1, limit: 3, media: 'all', category: 'latest'}));
};

export const getPost = async (store: AppStore, slug: string) => {
  const response = await store.dispatch(PostApi.endpoints.getPost.initiate({slug}));
  return response.data;
};

export const getComments = async (store: AppStore, id: number) => {
  await store.dispatch(CommentApi.endpoints.getComments.initiate({id, page: 1, limit: 8}));
};

export const getUser = async (store: AppStore, slug: string) => {
  const response = await store.dispatch(AuthApi.endpoints.getUser.initiate({slug}));
  return response.data;
};

export const getUserFriends = async (store: AppStore, id: number) => {
  await store.dispatch(FriendApi.endpoints.getFriends.initiate({id, page: 1, limit: 20}));
};

export const getUserPosts = async (store: AppStore, id: number) => {
  await store.dispatch(PostApi.endpoints.getUserPosts.initiate({page: 1, limit: 3, id}));
};

//***********************
// Unified Params Pages
//***********************
export const profilePage = async (store: AppStore, ctx: GetServerSidePropsContext) => {
  const slug = ctx.params?.slug as string|undefined;
  if (!slug) return {status: 404};

  const auth = await authenticateUnprotected(store, ctx, false) as UserData|undefined;

  await Promise.all([
    auth && getFriends(store),
    auth && getSendPendings(store),
    auth && getFriendsIds(store, auth.id),
    getUser(store, slug).then((user) => {
      if (user) {
        return Promise.all([
          store.dispatch(setProfile({id: user.id, slug})),
          getFriendsIds(store, user.id),
          getUserFriends(store, user.id),
          getUserPosts(store, user.id)
        ]);
      }
    })
  ]);

  const state = store.getState();
  return state.api.queries[`getUser({"slug":"${slug}"})`]?.error as {status: number} | undefined;
};


export const postPage = async (store: AppStore, ctx: GetServerSidePropsContext) => {
  const slug = ctx.params?.slug as string|undefined;
  if (!slug) return {status: 404};

  const auth = await authenticateUnprotected(store, ctx, false) as UserData|undefined;

  await Promise.all([
    auth && getFriends(store),
    getPost(store, slug)
      .then((post) => {
        if (post) {
          return Promise.all([
            store.dispatch(setPost({id: post.id, slug})),
            store.dispatch(expandComments(post.id)),
            getComments(store, post.id)
          ]);
        }
      })
  ]);

  const state = store.getState();
  return state.api.queries[`getPost({"slug":"${slug}"})`]?.error as {status: number} | undefined;
};
