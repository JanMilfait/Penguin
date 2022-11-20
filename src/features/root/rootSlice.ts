import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as T from './rootSlice.types';

export const RootSlice = createSlice({
  name: 'root',
  initialState: {
    isMobile: false
  } as T.rootState,
  reducers: {
    setIsMobile: (state, action: PayloadAction<boolean>) => {
      state.isMobile = action.payload;
    }
  }
});

export const {
  setIsMobile
} = RootSlice.actions;

export default RootSlice.reducer;