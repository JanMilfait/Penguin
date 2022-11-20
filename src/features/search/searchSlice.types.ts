export type User = {
  id: number;
  name: string;
  avatar_url: string | null;
  avatar_name: string | null;
}

export type Post = {
  id: number;
  body: string;
  user: User;
}

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
