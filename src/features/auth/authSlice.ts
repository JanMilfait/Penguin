import {createSlice} from '@reduxjs/toolkit';
import {AppState} from 'app/store';
import {apiSlice} from '../../app/api/apiSlice';


export const AuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchClient: builder.query({
      query: () => 'api/user'
    }),
    login: builder.mutation({
      query: (credentials: {email: string; password: string}) => ({
        url: 'login',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation({
      query: (credentials: {name: string, email: string; password: string, password_confirmation: string}) => ({
        url: 'register',
        method: 'POST',
        body: credentials
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: 'logout',
        method: 'POST'
      })
    }),
    resetPassword: builder.mutation({
      query: (credentials: {email: string}) => ({
        url: 'forgot-password',
        method: 'POST',
        body: credentials
      })
    })
  })
});


export const AuthSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    data: null
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(AuthApi.endpoints.fetchClient.matchFulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addMatcher(AuthApi.endpoints.login.matchFulfilled, (state, action) => {
        state.token = action.payload.token;
        state.data = action.payload.user;
      })
      .addMatcher(AuthApi.endpoints.register.matchFulfilled, (state, action) => {
        state.token = action.payload.token;
        state.data = action.payload.user;
      });
  }
});


export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useResetPasswordMutation
} = AuthApi;
export const {setToken} = AuthSlice.actions;
export const selectClient = (state: AppState) => state.auth;

export default AuthSlice.reducer;