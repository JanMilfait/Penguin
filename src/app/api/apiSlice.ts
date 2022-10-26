import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: [],
  baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:3000'}),
  // eslint-disable-next-line
  endpoints: (builder) => ({})
});
