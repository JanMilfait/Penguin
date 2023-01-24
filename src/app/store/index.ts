import { AnyAction, combineReducers, configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import rootSlice from '../../features/root/rootSlice';
import authSlice from 'features/auth/authSlice';
import searchSlice from 'features/search/searchSlice';
import chatSlice from '../../features/chat/chatSlice';
import postSlice from '../../features/post/postSlice';
import { apiSlice } from 'app/api/apiSlice';
import { pusherMiddleware } from 'app/middlewares/pusherMiddleware';
import { modalMiddleware } from '../middlewares/modalMiddleware';
import friendSlice from '../../features/friend/friendSlice';
import commentSlice from '../../features/comment/commentSlice';
import skillSlice from '../../features/skill/skillSlice';
import notificationSlice from '../../features/notification/notificationSlice';

const combinedReducer = combineReducers({
  root: rootSlice,
  auth: authSlice,
  search: searchSlice,
  chat: chatSlice,
  post: postSlice,
  comment: commentSlice,
  friend: friendSlice,
  skill: skillSlice,
  notification: notificationSlice,
  [apiSlice.reducerPath]: apiSlice.reducer
});

const reducer = (state: any, action: AnyAction) => {
  return combinedReducer(state, action);
};

let store;
const makeStore = () => {
  store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => (
      getDefaultMiddleware()
        .concat(apiSlice.middleware)
        .concat(modalMiddleware)
        .concat(process.env.NEXT_PUBLIC_PUSHER_ACTIVE === 'on' ? pusherMiddleware : <any>[])
    )
  });
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export {store};
export const wrapper = createWrapper<AppStore>(makeStore);
