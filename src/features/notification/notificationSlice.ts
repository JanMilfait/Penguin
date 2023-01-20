import { createSlice } from '@reduxjs/toolkit';
import {apiSlice} from '../../app/api/apiSlice';
import * as T from './notificationSlice.types';


export const NotificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

  })
});


export const NotificationSlice = createSlice({
  name: 'notification',
  initialState: {

  } as T.NotificationState,
  reducers: {

  }
});


export const {

} = NotificationApi;

export const {

} = NotificationSlice.actions;

export default NotificationSlice.reducer;