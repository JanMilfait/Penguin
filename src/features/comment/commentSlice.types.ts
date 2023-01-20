import {PostComment} from '../post/postSlice.types';

export type CommentsResult = {
  items: PostComment[];
  page: number;
  limit: number;
  trendingComment: number;
}

export type CommentsArg = {
  id: number;
  page: number;
  limit: number;
}

export type AddCommentArg = {
  id: number;
  body: string;
}

export type DeleteCommentArg = {
  id: number;
  postId: number;
}

export type EditCommentArg = {
  id: number;
  body: string;
}

export type ReactCommentArg = {
  id: number;
  reaction: number;
}

export type UnreactCommentArg = {
  id: number;
}

export type AddReplyArg = {
  id: number;
  body: string;
}

export type DeleteReplyArg = {
  id: number;
  commentId: number;
}

export type EditReplyArg = {
  id: number;
  commentId: number;
  body: string;
}

export type ReactReplyArg = {
  id: number;
  reaction: number;
  commentId?: number;
}

export type UnreactReplyArg = {
  id: number;
  commentId?: number;
}


export type ChatState = {
  resetInfiniteScroll: {
    restarted: number;
    value: number,
  }
  infiniteScrollSync: number;
}