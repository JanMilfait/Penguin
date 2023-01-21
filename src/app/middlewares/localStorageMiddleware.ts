import { Middleware } from '@reduxjs/toolkit';


export const localStorageMiddleware: Middleware = (store) => (next) => (action) => {



  return next(action);
};
