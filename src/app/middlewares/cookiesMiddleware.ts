import { Middleware } from '@reduxjs/toolkit';
import { setCookie, getCookie, deleteCookie } from 'cookies-next';

export const cookiesMiddleware: Middleware = (store) => (next) => (action) => {

  if (action.type === 'post/setPostAsHidden') {
    const hiddenPosts = JSON.parse(getCookie('hiddenPosts') as string || '{}') ?? {};
    const keys = Object.keys(hiddenPosts);
    if (keys.length >= 100) {
      delete hiddenPosts[keys[keys.length - 1]];
    }
    setCookie('hiddenPosts', JSON.stringify({...hiddenPosts, [action.payload]: true}), {expires: (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))});
  }

  if (action.type === 'post/setPostAsNotHidden') {
    const hiddenPosts = JSON.parse(getCookie('hiddenPosts') as string || '{}') ?? {};
    delete hiddenPosts[action.payload];
    setCookie('hiddenPosts', JSON.stringify(hiddenPosts), {expires: (new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))});
  }

  return next(action);
};
