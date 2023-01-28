import {AnyAction, createSlice } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import * as T from './authSlice.types';
import { MessageResponse } from '../root/rootSlice.types';
import { HYDRATE } from 'next-redux-wrapper';
import { setActivityStatus } from 'features/friend/friendSlice';


export const AuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchClient: builder.query<T.FetchClientResult, void>({
      query: () => '/api/user',
      onQueryStarted: (arg, {dispatch, queryFulfilled}) => {
        queryFulfilled.then((result) => {
          const user = result.data;
          if (user && user.is_active !== undefined) {
            dispatch(setActivityStatus({id: user.id, status: user.is_active}));
          }
        });
      },
      keepUnusedDataFor: 0,
      providesTags: (result) =>
        result
          ? [{type: 'User', id: result.id}, 'User']
          : ['User']
    }),
    login: builder.mutation<T.LoginResult, T.LoginArg>({
      query: (credentials: {email: string; password: string}) => ({
        url: '/login',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation<T.RegisterResult, T.RegisterArg>({
      query: (credentials: {name: string, email: string; password: string, password_confirmation: string}) => ({
        url: '/register',
        method: 'POST',
        body: credentials
      })
    }),
    logout: builder.mutation<T.LogoutResult, void>({
      query: () => ({
        url: '/logout',
        method: 'POST'
      })
    }),
    resetPassword: builder.mutation<T.ForgotPasswordResult, T.ForgotPasswordArg>({
      query: (credentials: {email: string}) => ({
        url: '/forgot-password',
        method: 'POST',
        body: credentials
      })
    }),
    getUser: builder.query<T.GetUserResult, T.GetUserArg>({
      query: ({id}) => '/api/user/' + id,
      onQueryStarted: (arg, {dispatch, queryFulfilled}) => {
        queryFulfilled.then((result) => {
          const user = result.data;
          if (user && user.is_active !== undefined) {
            dispatch(setActivityStatus({id: user.id, status: user.is_active}));
          }
        });
      },
      providesTags: (result, error, arg) =>
        result
          ? [{type: 'User', id: arg.id}, 'User']
          : ['User']
    }),
    updateUser: builder.mutation<MessageResponse, T.UpdateUserArg>({
      query: ({formData}) => {
        formData.append('_method', 'PUT');
        return ({
          url: '/api/user',
          method: 'POST',
          body: formData
        });
      },
      invalidatesTags: (result, error, arg) => [{type: 'User', id: arg.formData.get('id') as string}]
    })
  })
});


export const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    data: null,
    profile: {
      id: null,
      edit: null,
      quill: ''
    }
  } as T.AuthState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = {...state.profile, ...action.payload};
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, (state, action: AnyAction) => {
        return {
          ...state,
          ...action.payload.auth
        };
      })
      .addMatcher(AuthApi.endpoints.fetchClient.matchFulfilled, (state, action) => {
        if ('id' in action.payload) {
          state.data = action.payload;
        }
      })
      .addMatcher(AuthApi.endpoints.login.matchFulfilled, (state, action) => {
        if ('token' in action.payload) {
          state.token = action.payload.token;
          state.data = action.payload.user;
        }
      })
      .addMatcher(AuthApi.endpoints.register.matchFulfilled, (state, action) => {
        if ('token' in action.payload) {
          state.token = action.payload.token;
          state.data = action.payload.user;
        }
      })
      .addMatcher(AuthApi.endpoints.getUser.matchFulfilled, (state, action) => {
        if ('id' in action.payload && state.data?.id === action.payload.id) {
          state.data = action.payload;
        }
      });
  }
});


export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useResetPasswordMutation,
  useGetUserQuery,
  useUpdateUserMutation
} = AuthApi;

export const {
  setToken,
  setProfile
} = AuthSlice.actions;

export default AuthSlice.reducer;