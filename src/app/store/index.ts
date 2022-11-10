import {AnyAction, combineReducers, configureStore, ThunkAction} from '@reduxjs/toolkit';
import {createWrapper, HYDRATE} from 'next-redux-wrapper';
import {Action} from 'redux';
import authSlice from 'features/auth/authSlice';
import {apiSlice} from 'app/api/apiSlice';
import {pusherMiddleware} from 'app/middlewares/pusherMiddleware';


const combinedReducer = combineReducers({
  auth: authSlice,
  [apiSlice.reducerPath]: apiSlice.reducer
});

const reducer = (state: ReturnType<typeof combinedReducer>|undefined, action: AnyAction) => {
  if (action.type === HYDRATE) {
    return {...state, ...action.payload};
  }
  return combinedReducer(state, action);
};

const makeStore = () => configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => (
    getDefaultMiddleware()
      .concat(apiSlice.middleware)
      .concat(pusherMiddleware)
  )
});

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore['getState']>;
export type AppThunk = ThunkAction<void, AppState, unknown, Action>;
export type AppDispatch = AppStore['dispatch'];

export const wrapper = createWrapper<AppStore>(makeStore);
