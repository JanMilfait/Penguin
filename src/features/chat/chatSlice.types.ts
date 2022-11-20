import {User} from '../auth/authSlice.types';

export type Friend = {
  id: User['id'];
  name: User['name'];
  avatar_name: User['avatar_name'];
  avatar_url: User['avatar_url'];
  is_active?: 1 | 0;
}


export type Chat = {
  id: number;
  type: 'friend' | 'group';
  last_message?: string | null;
  last_message_by: string | null;
  updated_at: string;
  users: Friend[];
  scrollToBottom?: number;
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

export type friendsResult = {
  items: Friend[];
  page: number;
  total: number;
  limit: number;
}

export type friendsArg = {id: number, page: number, limit: number};

export type chatResult = Chat;

export type chatArg = {id: number};

export type messagesResult = {
  items: Message[];
  page: number;
  total: number;
  limit: number;
}

export type messagesArg = {id: number, page: number, limit: number};

export type messageResult = Message;

export type sendMessageArg = {id: number, userId: number, body?: string, image?: FormData};

export type ChatState = {
  activeChats: Chat[];
  openedChats: number[];
  openedEmojiPicker: number[];
  openedGiphyPicker: number[];
  closeAnimationTimeout: number;
  expandChats: boolean;
};