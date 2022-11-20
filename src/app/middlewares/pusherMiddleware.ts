import { ChatApi } from 'features/chat/chatSlice';
import Pusher from 'pusher-js';
import { Middleware } from 'redux';
import * as CT from '../../features/chat/chatSlice.types';
import { appendDatesToMessages } from '../helpers/helpers';
import * as T from './pusherMiddleware.types';

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
      console.log('bind events for private user channel');
    });
  }

  if (!pusher) return next(action);

  if (action.type === 'chat/activateChat/fulfilled') {
    const channel = pusher.subscribe('presence-chat-room.' + action.payload.id);
    channel.bind('pusher:subscription_succeeded', () => {

      /**
       * Event: new_message
       * Channel: presence-chat-room
       *
       * Add new message to all clients rtk-query cache
       */
      channel.bind('new-message', (data: T.EventNewMessage) => {
        if (data.user_id === auth.data.id) return;

        const message: CT.Message = {
          id: -Math.floor(Math.random() * 100000000), // temporary id
          user_id: data.user_id,
          body: data.body ? data.body.trim() : null,
          image_url: data.image_url ?? null,
          created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
        store.dispatch<any>(ChatApi.util.updateQueryData('getMessages', {id: action.payload.id, limit: 20, page: 1}, (draft) => {
          const prevMessage = draft.items[draft.items.length - 1];
          appendDatesToMessages(prevMessage, message);
          draft.items.push(message);
        }));
      });

    });
  }

  if (action.type === 'chat/deactivateChat') {
    pusher.unsubscribe('presence-chat-room.' + action.payload);
  }

  return next(action);
};