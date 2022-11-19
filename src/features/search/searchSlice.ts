import { createSlice } from '@reduxjs/toolkit';
import {apiSlice} from '../../app/api/apiSlice';
import * as T from './searchSlice.types';

export const SearchApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    fetchSearch: builder.query<T.SearchResult, T.SearchArg>({
      query: ({text, page}) => 'api/search?text=' + text + '&offset=' + (page * 5),
      providesTags: (result) =>
        result ? [...result.ids.map((id) => ({type: 'SearchResult' as const, id})), 'SearchResult'] : ['SearchResult']
    })
  })
});

export const SearchSlice = createSlice({
  name: 'search',
  initialState: {
    text: '',
    page: 0,
    debounced: false
  } as T.SearchState,
  reducers: {
    setSearch: (state, action) => {
      state.text = action.payload;
      state.page = 0;
      state.debounced = false;
    },
    setPage: (state, action) => {
      state.page = state.page + action.payload;
    },
    setDebounced: (state, action) => {
      state.debounced = action.payload;
    }
  }
});

export const {
  setSearch,
  setPage,
  setDebounced
} = SearchSlice.actions;

export default SearchSlice.reducer;