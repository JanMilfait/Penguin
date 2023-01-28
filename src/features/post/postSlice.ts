import {AnyAction, createSelector, createSlice } from '@reduxjs/toolkit';
import {apiSlice} from '../../app/api/apiSlice';
import * as T from './postSlice.types';
import {MessageResponse} from '../root/rootSlice.types';
import {AppState} from '../../app/store';
import {setOpenModal} from '../root/rootSlice';
import Router from 'next/router';
import { setCookie } from 'cookies-next';
import { Reaction } from './postSlice.types';
import {saveTrendingComments} from '../../app/helpers/helpers';
import { HYDRATE } from 'next-redux-wrapper';


export const PostApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<T.PostsResult, T.PostsArg>({
      query: ({page, limit, category, media, trendingDays}) => '/api/posts?page=' + page + '&limit=' + limit
        + (category ? '&category=' + category : '')
        + (media ? '&media=' + media : '')
        + (trendingDays ? '&trending-days=' + trendingDays : ''),
      onQueryStarted: (arg, {dispatch, queryFulfilled}) => {
        queryFulfilled.then(() => {
          dispatch(syncInfiniteScroll());
        });
      },
      providesTags: (result): any =>
        result
          ? [...result.items.map(({id}) => ({type: 'Post', id})), 'Post']
          : ['Post']
    }),
    getUserPosts: builder.query<T.PostsResult, T.UserPostsArg>({
      query: ({page, limit, id}) => '/api/posts/' + id + '?page=' + page + '&limit=' + limit,
      onQueryStarted: (arg, {dispatch, queryFulfilled}) => {
        queryFulfilled.then(() => {
          dispatch(syncInfiniteScroll());
        });
      },
      providesTags: (result): any =>
        result
          ? [...result.items.map(({id}) => ({type: 'Post', id})), 'Post']
          : ['Post']
    }),
    addPost: builder.mutation<MessageResponse, T.AddPostArg>({
      query: ({formData}) => ({
        url: '/api/post',
        method: 'POST',
        body: formData
      }),
      onQueryStarted: (arg, {dispatch, queryFulfilled}) => {
        queryFulfilled.then(() => {
          if (arg.category === 'latest') {
            dispatch(resetInfiniteScroll());
          } else {
            dispatch(setOpenModal({
              props: {
                type: 'alert',
                icon: 'success',
                title: 'Post added',
                message: 'Your post has been added successfully',
                clickOutside: true
              }
            }));
          }
        });
      }
    }),
    updatePost: builder.mutation<MessageResponse, T.updatePostArg>({
      query: ({id, formData}) => {
        formData.append('_method', 'PUT');
        return ({
          url: '/api/post/' + id,
          method: 'POST',
          body: formData
        });
      },
      invalidatesTags: (result, error, arg) => [{type: 'Post', id: arg.id}]
    }),
    deletePost: builder.mutation<MessageResponse, T.DeletePostArg>({
      query: ({id}) => ({
        url: '/api/post/' + id,
        method: 'DELETE'
      }),
      onQueryStarted: (arg, {queryFulfilled}) => {
        queryFulfilled.then(() => {
          setCookie('dispatch', JSON.stringify({
            type: 'root/setOpenModal',
            payload: {
              props: {
                type: 'alert',
                icon: 'success',
                title: 'Post deleted',
                message: 'Your post has been deleted successfully',
                clickOutside: true
              }
            }
          }));
          Router.reload();
        });
      }
    }),
    sharePost: builder.mutation<MessageResponse, T.SharePostArg>({
      query: ({id}) => ({
        url: '/api/post/' + id + '/share',
        method: 'POST'
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Post', id: arg.id}]
    }),
    unsharePost: builder.mutation<MessageResponse, T.UnsharePostArg>({
      query: ({id}) => ({
        url: '/api/post/' + id + '/share',
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Post', id: arg.id}]
    }),
    reactPost: builder.mutation<MessageResponse, T.ReactPostArg>({
      query: ({id, reaction}) => ({
        url: '/api/post/' + id + '/reaction',
        method: 'POST',
        body: {reaction}
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Post', id: arg.id}]
    }),
    unreactPost: builder.mutation<MessageResponse, T.UnreactPostArg>({
      query: ({id}) => ({
        url: '/api/post/' + id + '/reaction',
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg) => [{type: 'Post', id: arg.id}]
    }),
    reportPost: builder.mutation<MessageResponse, T.ReportPostArg>({
      query: ({id, reason}) => ({
        url: '/api/post/' + id + '/report',
        method: 'POST',
        body: {reason}
      })
    })
  })
});

export const PostSlice = createSlice({
  name: 'post',
  initialState: {
    filter: {
      category: 'latest',
      trendingDays: 7,
      media: 'all'
    },
    expandedComments: [],
    trendingComments: [],
    infiniteScrollSync: 0,
    resetInfiniteScroll: 0
  } as T.PostState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = {...state.filter, ...action.payload};
    },
    expandComments: (state, action) => {
      state.expandedComments.push(action.payload);
    },
    toggleComments: (state, action) => {
      if (state.expandedComments.includes(action.payload)) {
        state.expandedComments = state.expandedComments.filter(id => id !== action.payload);
      } else {
        state.expandedComments.push(action.payload);
      }
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
        if (action.payload.post.trendingComments) {
          state.trendingComments = action.payload.post.trendingComments;
        }
      })
      .addMatcher(PostApi.endpoints.getPosts.matchFulfilled, (state, action) => saveTrendingComments(state, action))
      .addMatcher(PostApi.endpoints.getUserPosts.matchFulfilled, (state, action) => saveTrendingComments(state, action));
  }
});

export const {
  useAddPostMutation,
  useDeletePostMutation,
  useReactPostMutation,
  useUnreactPostMutation,
  useUpdatePostMutation
} = PostApi;

export const {
  setFilter,
  expandComments,
  toggleComments,
  syncInfiniteScroll,
  resetInfiniteScroll
} = PostSlice.actions;

export const isExpanded = createSelector(
  (state: AppState) => state.post.expandedComments,
  (state: AppState, id: number) => id,
  (expandedComments, id) => expandedComments.includes(id)
);

export const filteredReactions = createSelector(
  (state: AppState) => state.root.modal.request?.data.reactions,
  (reactions: Reaction[]) => {
    return {
      filtered: [
        reactions,
        reactions.filter(reactions => reactions.reaction === 1),
        reactions.filter(reactions => reactions.reaction === 2),
        reactions.filter(reactions => reactions.reaction === 3),
        reactions.filter(reactions => reactions.reaction === 4),
        reactions.filter(reactions => reactions.reaction === 5),
        reactions.filter(reactions => reactions.reaction === 6),
        reactions.filter(reactions => reactions.reaction === 7)
      ],
      count: [
        reactions.length,
        reactions.filter(reaction => reaction.reaction === 1).length,
        reactions.filter(reaction => reaction.reaction === 2).length,
        reactions.filter(reaction => reaction.reaction === 3).length,
        reactions.filter(reaction => reaction.reaction === 4).length,
        reactions.filter(reaction => reaction.reaction === 5).length,
        reactions.filter(reaction => reaction.reaction === 6).length,
        reactions.filter(reaction => reaction.reaction === 7).length
      ]
    };
  }
);

export const isTrending = createSelector(
  (state: AppState) => state.post.trendingComments,
  (state: AppState, id: number | undefined) => id,
  (trendingComments, id) => {
    if (id === undefined) return false;
    return trendingComments.find((mostReacted) => mostReacted[0] === id)?.[1] ?? false;
  }
);

export default PostSlice.reducer;