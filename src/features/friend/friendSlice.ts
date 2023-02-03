import {AnyAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import {apiSlice} from '../../app/api/apiSlice';
import * as T from './friendSlice.types';

export const FriendApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getFriends: builder.query<T.FriendsResult, T.FriendsArg>({
      query: ({id, page, limit}) => '/api/friends/' + id + '?page=' + page + '&limit=' + limit,
      onQueryStarted: (arg, {dispatch, queryFulfilled}) => {
        queryFulfilled.then((result) => {
          const friends = result.data;
          friends.items.forEach((friend) => {
            if (friend.is_active !== undefined) {
              dispatch(setActivityStatus({id: friend.id, status: friend.is_active}));
            }
          });
          dispatch(syncInfiniteScroll());
        });
      },
      providesTags: ['Friend']
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
    getFriendsIdsNames: builder.query<T.FriendsIdsNamesResult, T.FriendsIdsArg>({
      query: ({id}) => '/api/friends/' + id + '/ids-names',
      providesTags: ['Friend']
    }),
    deleteFriend: builder.mutation<T.DeleteFriendResult, T.DeleteFriendArg>({
      query: ({id}) => ({
        url: '/api/friend/' + id,
        method: 'DELETE'
      }),
      onQueryStarted: (arg, {dispatch, queryFulfilled}) => {
        queryFulfilled
          .then(() => {
            dispatch(resetInfiniteScroll());
          })
          .catch(() => {
            dispatch(resetInfiniteScroll());
          });
      },
      invalidatesTags: (result, error, arg) => [{type: 'User', id: arg.id}]
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
      onQueryStarted: (arg, {dispatch, queryFulfilled}) => {
        queryFulfilled.then(() => {
          dispatch(resetInfiniteScroll());
        });
      },
      invalidatesTags: ['ReceivedPending']
    }),
    declinePending: builder.mutation<T.DeclinePendingResult, T.DeclinePendingArg>({
      query: ({pendingId}) => ({
        url: '/api/pending-decline/' + pendingId,
        method: 'PATCH'
      }),
      invalidatesTags: ['ReceivedPending']
    })
  })
});

export const FriendSlice = createSlice({
  name: 'friend',
  initialState: {
    activityStatus: {},
    infiniteScrollSync: 0,
    resetInfiniteScroll: 0
  } as T.FriendState,
  reducers: {
    setActivityStatus: (state, action: PayloadAction<{id: number, status: 0|1}>) => {
      state.activityStatus[action.payload.id] = action.payload.status;
    },
    syncInfiniteScroll: (state) => {
      state.infiniteScrollSync++;
    },
    resetInfiniteScroll: (state) => {
      state.resetInfiniteScroll++;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action: AnyAction) => {
        return {
          ...state,
          activityStatus: {...state.activityStatus, ...action.payload.friend.activityStatus}
        };
      });
  }
});


export const {
  useGetFriendsIdsQuery,
  useGetFriendsIdsNamesQuery,
  useDeleteFriendMutation,
  useAddFriendMutation,
  useGetSendPendingsQuery,
  useGetReceivedPendingsQuery,
  useAcceptPendingMutation,
  useDeclinePendingMutation
} = FriendApi;

export const {
  setActivityStatus,
  resetInfiniteScroll,
  syncInfiniteScroll
} = FriendSlice.actions;

export default FriendSlice.reducer;