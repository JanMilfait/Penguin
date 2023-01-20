import {BaseQueryFn, createApi, FetchArgs, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ErrorMessage } from 'app/helpers/errorHandling';
import { AppState } from 'app/store';

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: [
    'User',
    'Post',
    'Comment',
    'Friend',
    'Chats',
    'Skill',
    'SendPending',
    'Notification',
    'ReceivedPending'
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as AppState).auth.token;

      token && headers.set('authorization', 'Bearer ' + token);
      headers.set('accept', 'application/json');
      return headers;
    }
  }) as BaseQueryFn<string | FetchArgs, unknown, {data: ErrorMessage}, Record<string, unknown>>,
  // eslint-disable-next-line
  endpoints: (builder) => ({})
});
