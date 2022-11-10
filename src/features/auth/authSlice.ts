import {createSlice} from '@reduxjs/toolkit';
import {apiSlice} from '../../app/api/apiSlice';


export const AuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchClient: builder.query<FetchClientResult, void>({
      query: () => 'api/user'
    }),
    login: builder.mutation<LoginResult, LoginArg>({
      query: (credentials: {email: string; password: string}) => ({
        url: 'login',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation<RegisterResult, RegisterArg>({
      query: (credentials: {name: string, email: string; password: string, password_confirmation: string}) => ({
        url: 'register',
        method: 'POST',
        body: credentials
      })
    }),
    logout: builder.mutation<LogoutResult, void>({
      query: () => ({
        url: 'logout',
        method: 'POST'
      })
    }),
    resetPassword: builder.mutation<ForgotPasswordResult, ForgotPasswordArg>({
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
  } as AuthState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
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

export default AuthSlice.reducer;