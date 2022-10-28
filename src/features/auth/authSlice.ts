import {createSlice} from '@reduxjs/toolkit';
import {HYDRATE} from 'next-redux-wrapper';
import {AppState} from 'app/store';
import {apiSlice} from '../../app/api/apiSlice';


export const AuthApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchClient: builder.query({
      // by token provided in the request header
      query: () => 'users/me'
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
      .addCase(HYDRATE, (state, action) => {
        if (action.payload.auth) {
          return {
            ...state,
            ...action.payload.auth
          };
        }
      })
      .addMatcher(AuthApi.endpoints.fetchClient.matchFulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addMatcher(AuthApi.endpoints.fetchClient.matchRejected, (state) => {
        state.data = null;
      });
  }
});


export const {setToken} = AuthSlice.actions;
export const selectClient = (state: AppState) => state.auth;

export default AuthSlice.reducer;