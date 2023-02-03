import {AnyAction, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import * as T from './rootSlice.types';
import {AppState} from '../../app/store';

export const RootSlice = createSlice({
  name: 'root',
  initialState: {
    appVersion: '1.0.0',
    appLoaded: 0,
    routerPath: '',
    window: {
      width: 0,
      height: 0
    },
    isMobile: false,
    modal: {
      isOpen: false,
      request: null,
      response: null,
      props: {
        type: null,
        clickOutside: false
      }
    },
    loader: {
      isOpen: false
    }
  } as T.RootState,
  reducers: {
    setAppLoaded: (state) => {
      state.appLoaded = (Date.now());
    },
    setRouterPath: (state, action: PayloadAction<string>) => {
      state.routerPath = action.payload;
    },
    setWindow: (state, action: PayloadAction<T.RootState['window']>) => {
      state.window = action.payload;
    },
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setOpenModal: (state, action: PayloadAction<Omit<T.Modal, 'isOpen'>>) => {
      state.modal = {
        ...action.payload,
        isOpen: true,
        response: null
      };
    },
    setCloseModal: (state, action: PayloadAction<T.Modal['response']>) => {
      state.modal = {
        isOpen: false,
        request: null,
        response: action.payload ?? null,
        props: {
          type: null,
          clickOutside: false
        }
      };
    },
    setOpenLoader: (state) => {
      state.loader = {
        isOpen: true
      };
    },
    setCloseLoader: (state) => {
      state.loader = {
        isOpen: false
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action: AnyAction) => {
        state.routerPath = action.payload.root.routerPath;
        state.isMobile = action.payload.root.isMobile;
      });
  }
});

export const {
  setAppLoaded,
  setRouterPath,
  setWindow,
  setIsMobile,
  setOpenModal,
  setCloseModal,
  setOpenLoader,
  setCloseLoader
} = RootSlice.actions;


export const onHiddenNavRoute = createSelector(
  (state: AppState) => state.root.routerPath,
  (routerPath) => ['/login', '/register', '/login/reset'].some((path) => routerPath.includes(path))
);


export default RootSlice.reducer;