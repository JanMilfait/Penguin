export type Notification = {
  id: number;
  source: 'chat' | 'post' | 'comment' | 'reply' | 'pending' | 'sharing' | 'message'
  source_id: number;
  source_data: string;
  readed_at: string;
  created_at: string;
}

export type ModalNotification = {
  id: number;
  source: 'chat' | 'post' | 'comment' | 'reply' | 'sharing'
  source_id: number;
  source_data: string;
  readed_at: string;
  created_at: string;
}

export type NotificationState = {
  pendingNotifications: Notification[];
  messageNotifications: Notification[];
  otherNotifications: Notification[];
  debounceTime: number;
}