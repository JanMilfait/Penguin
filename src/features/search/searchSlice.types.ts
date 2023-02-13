import { User } from 'features/auth/authSlice.types';

export type SearchResult = {
  items: {
    id: number;
    user: User;
    slug: string;
    body: string;
  } | User[];
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
