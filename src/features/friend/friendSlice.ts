import { createSlice } from '@reduxjs/toolkit';
import {apiSlice} from '../../app/api/apiSlice';
import * as T from './friendSlice.types';

export const FriendApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<T.FriendsResult, T.FriendsArg>({
      query: ({id, page, limit}) => '/api/friends/' + id + '?page=' + page + '&limit=' + limit
    }),
    getFriendsIds: builder.query<T.FriendsIdsResult, T.FriendsIdsArg>({
      query: ({id}) => '/api/friends/' + id + '/ids',
      transformResponse: (response: any) => {
        return {
          ids: response,
          count: response.length
        };
      }
    })
  })
});

export const FriendSlice = createSlice({
  name: 'friend',
  initialState: {

  } as T.FriendState,
  reducers: {

  }
});


export const {
  useGetFriendsIdsQuery
} = FriendApi;

export const {

} = FriendSlice.actions;

export default FriendSlice.reducer;