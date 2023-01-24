import { Friend } from 'features/chat/chatSlice.types';
import {User} from '../auth/authSlice.types';

export type FriendsResult = {
  items: Friend[];
  page: number;
  total: number;
  limit: number;
}

export type FriendsArg = {id: number, page: number, limit: number};

export type FriendsIdsResult = {
  ids: number[];
  count: number;
}

export type FriendsIdsArg = {id: number};

export type DeleteFriendResult = { message: string };

export type DeleteFriendArg = { id: number; }

export type AddFriendResult = { message: string };

export type AddFriendArg = { id: number; }

export type SendPending = {
  id: number;
  pending: User;
  state: 'waiting' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
  updated_at_original: string;
}

export type ReceivedPending = {
  id: number;
  user: User;
  state: 'waiting' | 'accepted' | 'declined';
  created_at: string;
  updated_at: string;
  updated_at_original: string;
}

export type SendPendingsResult = SendPending[]

export type SendPendingsArg = undefined;

export type ReceivedPendingsResult = ReceivedPending[];

export type ReceivedPendingsArg = undefined;

export type AcceptPendingResult = { message: string };

export type AcceptPendingArg = { pendingId: number; }

export type DeclinePendingResult = { message: string };

export type DeclinePendingArg = { pendingId: number; }

export type FriendState = {
  // ...
};