import Pusher from 'pusher-js';

export const pusherMiddleware = (store) => (next) => (action) => {
  const auth = store.getState().auth;

  if (auth.token && auth.data && !Pusher.instances[0]) {
    if (process.env.NEXT_PUBLIC_APP_ENV === 'local') {
      Pusher.logToConsole = true;
    }

    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
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

  if (action.type === 'chat/subscribeRoom') {
    const channel = Pusher.instances[0].subscribe('presence-room.' + action.payload);
    channel.bind('pusher:subscription_succeeded', () => {
      console.log('bind events for presence room channel');
    });
  }

  if (action.type === 'chat/unsubscribeRoom') {
    Pusher.instances[0].unsubscribe('presence-room.' + action.payload);
  }

  return next(action);
};