import { createSlice } from '@reduxjs/toolkit';
import {apiSlice} from '../../app/api/apiSlice';
import * as T from './postSlice.types';

export const PostApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

  })
});

export const PostSlice = createSlice({
  name: 'post',
  initialState: {

  } as T.PostState,
  reducers: {

  }
});

export const {

} = PostSlice.actions;

export default PostSlice.reducer;