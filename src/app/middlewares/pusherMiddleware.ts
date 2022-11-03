import Pusher from 'pusher-js';

export const pusherMiddleware = (store) => (next) => (action) => {

  if (store.getState().auth.token && !Pusher.instances[0]) {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'local') {
      Pusher.logToConsole = true;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      authEndpoint: process.env.NEXT_PUBLIC_API_BASE_URL + '/pusher/auth',
      auth: {
        headers: {
          'Authorization': `Bearer ${store.getState().auth.token}`
        }
      }
    });

    const channel = pusher.subscribe('private-user.' + store.getState().auth.data.id);
    channel.bind('pusher:subscription_succeeded', () => {
      console.log('bind events for private user channel');
    });
  }

  if (action.type === 'chat/subscribe') {
    const channel = Pusher.instances[0].subscribe('private-chat.' + action.payload);
    channel.bind('pusher:subscription_succeeded', () => {
      console.log('bind events for private chat channel');
    });
  }

  if (action.type === 'chat/unsubscribe') {
    Pusher.instances[0].unsubscribe('private-chat.' + action.payload);
  }

  return next(action);
};