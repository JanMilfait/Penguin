import { User } from 'features/auth/authSlice.types';
import { Post } from '../post/postSlice.types';

export type SearchResult = {
  items: Post[] | User[];
  page: number;
  last_page: number;
  limit: number;
};

export type SearchArg = {text: string, page: number}

export type SearchState = {
  text: string;
  page: number;
  debounced: boolean;
}
