import { User } from 'features/auth/authSlice.types';

export type Post = {
  id: number;
  body: string | null;
  created_at: string;
  updated_at: string;
  comments_count: number;
  most_reacted_comment: PostComment | null;
  user: User
  image: PostImage | null;
  video: PostVideo | null;
  sharings: PostSharing[];
  reactions: Reaction[];
  reports: number[];
}

export type PostComment = {
  id: number;
  body: string;
  created_at: string;
  updated_at: string;
  user: User;
  replies: PostReply[];
  reactions: Reaction[];
}

export type PostReply = {
  id: number;
  body: string;
  created_at: string;
  updated_at: string;
  user: User;
  replies: undefined;
  reactions: Reaction[];
}

export type PostImage = {
  id: number;
  name: string;
  url: string;
}

export type PostVideo = {
  id: number;
  name: string;
  url: string;
  poster: string;
}

export type PostSharing = {
  id: number;
  created_at: string;
  user: User;
}

export type Reaction = {
  id: number;
  reaction: number;
  user: User;
}

export type PostsResult = {
  items: Post[];
  page: number;
  limit: number;
}

export type PostsArg = {
  page: number;
  limit: number;
  category?: string;
  media?: string;
  trendingDays?: number;
}

export type AddPostArg = {
    formData: FormData;
    category: string;
};

export type updatePostArg = {
  formData: FormData;
  id: number;
}

export type DeletePostArg = { id: number; }

export type ReportPostArg = {
  id: number;
  reason: string;
}

export type SharePostArg = { id: number; }

export type UnsharePostArg = { id: number; }

export type ReactPostArg = {
  id: number;
  reaction: number;
}

export type PostState = {
  filter: {
    category: 'latest' | 'trending' | 'shared';
    trendingDays: number;
    media: 'all' | 'photo' | 'video';
    reset: number;
  },
  expandedComments: number[];
  infiniteScrollSync: number;
}