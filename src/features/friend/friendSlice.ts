import { createSlice } from '@reduxjs/toolkit';
import {apiSlice} from '../../app/api/apiSlice';
import * as T from './friendSlice.types';

export const FriendApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<T.FriendsResult, T.FriendsArg>({
      query: ({id, page, limit}) => '/api/friends/' + id + '?page=' + page + '&limit=' + limit,
      providesTags: ['Friend'] // TODO ON ADDED/DELETED FETCH ALL PAGES FIX -> reset infinite scroll
    }),
    getFriendsIds: builder.query<T.FriendsIdsResult, T.FriendsIdsArg>({
      query: ({id}) => '/api/friends/' + id + '/ids',
      transformResponse: (response: any) => {
        return {
          ids: response,
          count: response.length
        };
      },
      providesTags: ['Friend']
    }),
    deleteFriend: builder.mutation<T.DeleteFriendResult, T.DeleteFriendArg>({
      query: ({id}) => ({
        url: '/api/friend/' + id,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => ['Friend', {type: 'User', id: arg.id}]
    }),
    addFriend: builder.mutation<T.AddFriendResult, T.AddFriendArg>({
      query: ({id}) => ({
        url: '/api/pending/' + id,
        method: 'POST'
      }),
      invalidatesTags: ['SendPending', 'Friend']
    }),
    getSendPendings: builder.query<T.SendPendingsResult, T.SendPendingsArg>({
      query: () => '/api/pendings',
      providesTags: ['SendPending']
    }),
    getReceivedPendings: builder.query<T.ReceivedPendingsResult, T.ReceivedPendingsArg>({
      query: () => '/api/pendings/received',
      providesTags: ['ReceivedPending']
    }),
    acceptPending: builder.mutation<T.AcceptPendingResult, T.AcceptPendingArg>({
      query: ({pendingId}) => ({
        url: '/api/pending-accept/' + pendingId,
        method: 'PATCH'
      }),
      invalidatesTags: ['ReceivedPending', 'Friend']
    }),
    declinePending: builder.mutation<T.DeclinePendingResult, T.DeclinePendingArg>({
      query: ({pendingId}) => ({
        url: '/api/pending-decline/' + pendingId,
        method: 'PATCH'
      }),
      invalidatesTags: ['ReceivedPending', 'Friend']
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
  useGetFriendsIdsQuery,
  useDeleteFriendMutation,
  useAddFriendMutation,
  useGetSendPendingsQuery,
  useGetReceivedPendingsQuery,
  useAcceptPendingMutation,
  useDeclinePendingMutation
} = FriendApi;

export const {

} = FriendSlice.actions;

export default FriendSlice.reducer;