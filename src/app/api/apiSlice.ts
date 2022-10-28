import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AppState } from 'app/store';

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ['Auth'],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as AppState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  // eslint-disable-next-line
  endpoints: (builder) => ({})
});
