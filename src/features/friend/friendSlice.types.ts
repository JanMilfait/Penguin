import {Friend} from '../chat/chatSlice.types';

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

export type FriendState = {

};