import { configureStore, ThunkAction } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import {nextReduxCookieMiddleware, wrapMakeStore} from 'next-redux-cookie-wrapper';
import { Action } from 'redux';
import authSlice from 'features/auth/authSlice';
import {apiSlice} from 'app/api/apiSlice';


const makeStore = () => configureStore({
  reducer: {
    auth: authSlice,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware()
      .prepend(nextReduxCookieMiddleware({
        expires: new Date(Date.now() + 2592000000),
        subtrees: ['subtree']
      }))
      .concat(apiSlice.middleware)
  )
});

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action>;

export const wrapper = createWrapper<AppStore>(wrapMakeStore(makeStore));
