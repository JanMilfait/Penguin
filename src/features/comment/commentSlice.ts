import { createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import * as T from './commentSlice.types';
import { MessageResponse } from '../root/rootSlice.types';
// @ts-ignore
import { store } from '../../app/store';
import { isTrending, removeTrendingComments } from 'features/post/postSlice';


export const CommentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getComments: builder.query<T.CommentsResult, T.CommentsArg>({
      query: ({id, page, limit}) => '/api/post/' + id + '/comments?page=' + page + '&limit=' + limit,
      onQueryStarted: (arg, {dispatch, queryFulfilled}) => {
        queryFulfilled.then(() => {
          dispatch(syncInfiniteScroll());
        });
      },
      transformResponse: (response: T.CommentsResult) => {
        if (response.items) {
          // remove trending comments -> they are fetched with the post
          // @ts-ignore
          const state = store.getState();
          response.items = response.items.filter((comment) => !isTrending(state, comment.id));
        }
        return response;
      },
      providesTags: (result, error, arg): any =>
        result
          ? [...result.items.map(({id}) => ({type: 'Comment', id})), {type: 'Comment', id: 'post_' + arg.id}, 'Comment']
          : ['Comment']
    }),
    addComment: builder.mutation<MessageResponse, T.AddCommentArg>({
      query: ({id, body}) => ({
        url: '/api/post/' + id + '/comment',
        method: 'POST',
        body: {body}
      }),
      onQueryStarted: (arg, {dispatch, queryFulfilled}) => {
        queryFulfilled.then(() => {
          dispatch(removeTrendingComments(arg.id));
          dispatch(resetInfiniteScroll(arg.id));
        });
      },
      invalidatesTags: (result, error, arg) => [{type: 'Post', id: arg.id}]
    }),
    deleteComment: builder.mutation<MessageResponse, T.DeleteCommentArg>({
      query: ({id}) => ({
        url: '/api/post/comment/' + id,
        method: 'DELETE'
      }),
      onQueryStarted: (arg, {dispatch, queryFulfilled}) => {
        queryFulfilled.then(() => {
          dispatch(resetInfiniteScroll(arg.postId));
        });
      },
      invalidatesTags: (result, error, arg) => [{type: 'Post', id: arg.postId}]
    }),
    editComment: builder.mutation<MessageResponse, T.EditCommentArg>({
      query: ({id, body}) => ({
        url: '/api/post/comment/' + id,
        method: 'PUT',
        body: {body}
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Comment', id: arg.id}]
    }),
    reactComment: builder.mutation<MessageResponse, T.ReactCommentArg>({
      query: ({id, reaction}) => ({
        url: '/api/post/comment/' + id + '/reaction',
        method: 'POST',
        body: {reaction}
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Comment', id: arg.id}]
    }),
    unreactComment: builder.mutation<MessageResponse, T.UnreactCommentArg>({
      query: ({id}) => ({
        url: '/api/post/comment/' + id + '/reaction',
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Comment', id: arg.id}]
    }),
    addReply: builder.mutation<MessageResponse, T.AddReplyArg>({
      query: ({id, body}) => ({
        url: '/api/post/comment/' + id + '/reply',
        method: 'POST',
        body: {body}
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Comment', id: arg.id}]
    }),
    deleteReply: builder.mutation<MessageResponse, T.DeleteReplyArg>({
      query: ({id}) => ({
        url: '/api/post/comment/reply/' + id,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Comment', id: arg.commentId}]
    }),
    editReply: builder.mutation<MessageResponse, T.EditReplyArg>({
      query: ({id, body}) => ({
        url: '/api/post/comment/reply/' + id,
        method: 'PUT',
        body: {body}
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Comment', id: arg.commentId}]
    }),
    reactReply: builder.mutation<MessageResponse, T.ReactReplyArg>({
      query: ({id, reaction}) => ({
        url: '/api/post/comment/reply/' + id + '/reaction',
        method: 'POST',
        body: {reaction}
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Comment', id: arg.commentId}]
    }),
    unreactReply: builder.mutation<MessageResponse, T.UnreactReplyArg>({
      query: ({id}) => ({
        url: '/api/post/comment/reply/' + id + '/reaction',
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Comment', id: arg.commentId}]
    })
  })
});

export const CommentSlice = createSlice({
  name: 'comment',
  initialState: {
    infiniteScrollSync: 0,
    resetInfiniteScroll: {
      restarted: 0,
      value: 0
    }
  } as T.ChatState,
  reducers: {
    clearInfiniteScroll: (state) => {
      state.resetInfiniteScroll = {
        restarted: 0,
        value: 0
      };
    },
    syncInfiniteScroll: (state) => {
      state.infiniteScrollSync++;
    },
    resetInfiniteScroll: (state, action) => {
      state.resetInfiniteScroll = {
        restarted: action.payload,
        value: state.resetInfiniteScroll.value + 1
      };
    }
  }
});

export const {
  useAddCommentMutation,
  useDeleteCommentMutation,
  useEditCommentMutation,
  useReactCommentMutation,
  useUnreactCommentMutation,
  useAddReplyMutation,
  useDeleteReplyMutation,
  useEditReplyMutation,
  useReactReplyMutation,
  useUnreactReplyMutation
} = CommentApi;

export const {
  resetInfiniteScroll,
  clearInfiniteScroll,
  syncInfiniteScroll
} = CommentSlice.actions;

export default CommentSlice.reducer;