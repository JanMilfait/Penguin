export type User = {
  entity_id: number;
  id: number;
  name: string;
  avatar_url: string;
  avatar_name: string;
}

export type Post = {
  entity_id: number;
  id: number;
  user_id: number;
  body: string;
  user: User;
}

export type SearchResult = {
  ids: number[] | [];
  entities: Post[] | User[] | [];
}

export type SearchArg = {text: string, page: number}

export type SearchState = {
  text: string;
  page: number;
  debounced: boolean;
}
