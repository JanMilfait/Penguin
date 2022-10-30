import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { AppState } from 'app/store';

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: [],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as AppState).auth.token;

      token && headers.set('authorization', `Bearer ${token}`);
      headers.set('accept', 'application/json');
      return headers;
    }
  }),
  // eslint-disable-next-line
  endpoints: (builder) => ({})
});
