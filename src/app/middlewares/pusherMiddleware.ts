import {activateChat, ChatApi, syncInfiniteScroll} from 'features/chat/chatSlice';
import Pusher from 'pusher-js';
import { Middleware } from 'redux';
import * as CT from '../../features/chat/chatSlice.types';
import { appendDatesToMessages } from '../helpers/helpers';
import {Notification} from '../../features/notification/notificationSlice.types';
import {addMessageNotification, addOtherNotification, addPendingNotification} from 'features/notification/notificationSlice';
import {FriendApi, resetInfiniteScroll, setActivityStatus} from 'features/friend/friendSlice';
import {Chat} from '../../features/chat/chatSlice.types';

type EventFriendStatus = {
  friend_id: number;
}

type EventNewMessage = {
  id: number;
  user_id: number;
  body: string|null;
  image_url: string|null;
}

export const pusherMiddleware: Middleware = (store) => (next) => (action) => {
  const pusher = Pusher.instances[0];
  const auth = store.getState().auth;

  if (!pusher && auth.token && auth.data) {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'local') {
      Pusher.logToConsole = true;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY || '', {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      authEndpoint: process.env.NEXT_PUBLIC_API_BASE_URL + '/pusher/auth',
      auth: {
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      }
    });

    const channel = pusher.subscribe('private-user.' + auth.data.id);
    channel.bind('pusher:subscription_succeeded', () => {

      /**
       * Event: friend-online
       * Channel: private-user
       *
       * Save friend's online status to client's store
       */
      channel.bind('friend-online', (data: EventFriendStatus) => {
        store.dispatch(setActivityStatus({id: data.friend_id, status: 1}));
      });


      /**
       * Event: friend-offline
       * Channel: private-user
       *
       * Save friend's offline status to client's store
       */
      channel.bind('friend-offline', (data: EventFriendStatus) => {
        store.dispatch(setActivityStatus({id: data.friend_id, status: 0}));
      });


      /**
       * Event: new-notification
       * Channel: private-user
       *
       * Add new notification to client's store
       */
      channel.bind('new-notification', (data: Notification) => {

        // Pending notifications
        if (data.source === 'pending') {
          store.dispatch(addPendingNotification(data));
          const sourceData = JSON.parse(data.source_data);

          if (sourceData.state === 'waiting') {
            store.dispatch(FriendApi.util.invalidateTags(['ReceivedPending']));
          } else {
            sourceData.state === 'accepted' && store.dispatch(resetInfiniteScroll());
            store.dispatch(FriendApi.util.invalidateTags(['SendPending']));
          }
        }

        // Chat notifications (new message)
        if (data.source === 'message') {
          store.dispatch(addMessageNotification(data));
          store.dispatch(ChatApi.util.invalidateTags(['Chats']));
        }

        // Other notifications
        if (data.source !== 'pending' && data.source !== 'message') {
          store.dispatch(addOtherNotification(data));

          // someone left/added user to chat
          if (data.source === 'chat') {
            store.dispatch(ChatApi.util.invalidateTags(['Chats']));
            if (store.getState().chat.activeChats.find((chat: Chat) => chat.id === data.source_id)) {
              store.dispatch(activateChat({chatId: data.source_id}));
            }
          }
        }
      });
    });
  }

  if (!pusher) return next(action);

  if (action.type === 'chat/activateChat/fulfilled') {
    const channel = pusher.subscribe('presence-chat-room.' + action.payload.id);
    channel.bind('pusher:subscription_succeeded', () => {

      /**
       * Event: new-message
       * Channel: presence-chat-room
       *
       * Add new message to all clients rtk-query cache
       */
      channel.bind('new-message', (data: EventNewMessage) => {
        if (data.user_id === auth.data.id) return;

        const message: CT.Message = {
          id: -Math.floor(Math.random() * 100000000), // temporary id / optimistic update
          user_id: data.user_id,
          body: data.body ? data.body.trim() : null,
          image_url: data.image_url ?? null,
          created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        store.dispatch<any>(ChatApi.util.updateQueryData('getMessages', {id: action.payload.id, limit: 20, page: 1}, (draft) => {
          const prevMessage = draft.items[draft.items.length - 1];
          appendDatesToMessages(prevMessage, message);
          draft.items.push(message);
          store.dispatch(syncInfiniteScroll());
        }));
      });

    });
  }

  if (action.type === 'chat/deactivateChat') {
    pusher.unsubscribe('presence-chat-room.' + action.payload);
  }

  return next(action);
};
