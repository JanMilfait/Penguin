import {AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import * as T from './rootSlice.types';

export const RootSlice = createSlice({
  name: 'root',
  initialState: {
    appLoaded: false,
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
    }
  } as T.RootState,
  reducers: {
    setAppLoaded: (state) => {
      state.appLoaded = true;
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
  setCloseModal
} = RootSlice.actions;

export default RootSlice.reducer;