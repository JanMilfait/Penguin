import {User} from '../auth/authSlice.types';

export type Chat = {
  id: number;
  type: 'friend' | 'group';
  last_message?: string | null;
  last_message_by: string | null;
  updated_at: string;
  users: Friend[];
  scrollToBottom?: number;
}

export type Friend = {
  id: User['id'];
  name: User['name'];
  avatar_name: User['avatar_name'];
  avatar_url: User['avatar_url'];
  is_active?: 1 | 0;
}

export type Message = {
  id?: number;
  user_id: number;
  body: string | null;
  image_url: string | null;
  created_at: string;
  showDate?: boolean;
  formattedDate?: string;
}

export type FriendsResult = {
  items: Friend[];
  page: number;
  total: number;
  limit: number;
}

export type FriendsArg = {id: number, page: number, limit: number};

export type ChatResult = Chat;

export type ChatArg = {id: number};

export type MessagesResult = {
  items: Message[];
  page: number;
  total: number;
  limit: number;
}

export type MessagesArg = {id: number, page: number, limit: number};

export type MessageResult = Message;

export type SendMessageArg = {id: number, userId: number, body?: string, image?: FormData};

export type ChatState = {
  activeChats: Chat[];
  openedChats: number[];
  openedEmojiPicker: number[];
  openedGiphyPicker: number[];
  closeAnimationTimeout: number;
  expandChats: boolean;
};