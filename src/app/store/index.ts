import { AnyAction, combineReducers, configureStore, ThunkAction } from '@reduxjs/toolkit';
import { createWrapper, HYDRATE } from 'next-redux-wrapper';
import { Action } from 'redux';
import rootSlice from '../../features/root/rootSlice';
import authSlice from 'features/auth/authSlice';
import searchSlice from 'features/search/searchSlice';
import chatSlice from '../../features/chat/chatSlice';
import postSlice from '../../features/post/postSlice';
import { apiSlice } from 'app/api/apiSlice';
import { pusherMiddleware } from 'app/middlewares/pusherMiddleware';
import { modalMiddleware } from '../middlewares/modalMiddleware';
import { unsubscribeApi } from '../ssr/hydrate';
import friendSlice from '../../features/friend/friendSlice';


const combinedReducer = combineReducers({
  root: rootSlice,
  auth: authSlice,
  search: searchSlice,
  chat: chatSlice,
  post: postSlice,
  friend: friendSlice,
  [apiSlice.reducerPath]: apiSlice.reducer
});

const reducer = (state: ReturnType<typeof combinedReducer>|undefined, action: AnyAction) => {
  if (action.type === HYDRATE) {
    action = unsubscribeApi(action, [
      'fetchClient(undefined)'
    ]);

    return {...state, ...action.payload};
  }
  return combinedReducer(state, action);
};

const makeStore = () => configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(modalMiddleware)
      .concat(process.env.NEXT_PUBLIC_PUSHER_ACTIVE === 'on' ? pusherMiddleware : <any>[])
  )
});

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk = ThunkAction<void, AppState, unknown, Action>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore);
