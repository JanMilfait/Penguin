import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as T from './rootSlice.types';

export const RootSlice = createSlice({
  name: 'root',
  initialState: {
    isMobile: false,
    modal: {
      isOpen: false,
      response: null,
      props: {
        type: null,
        clickOutside: false
      }
    }
  } as T.RootState,
  reducers: {
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    },
    setModal: (state, action: PayloadAction<T.Modal>) => {
      state.modal = action.payload;
    },
    setModalProps: (state, action: PayloadAction<T.ModalProps>) => {
      state.modal.props = action.payload;
    },
    setCloseModal: (state, action: PayloadAction<T.Modal['response']>) => {
      state.modal = {
        isOpen: false,
        response: action.payload ?? null,
        props: {
          type: null,
          clickOutside: false
        }
      };
    },
    setResponseModal: (state, action: PayloadAction<T.Modal['response']>) => {
      state.modal.response = action.payload;
    }
  }
});

export const {
  setIsMobile,
  setModal,
  setModalProps,
  setCloseModal,
  setResponseModal
} = RootSlice.actions;

export default RootSlice.reducer;