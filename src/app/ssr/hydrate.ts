import { AnyAction } from '@reduxjs/toolkit';

export const unsubscribeApi = (action: AnyAction, endpoints: string[]) => {
  Object.defineProperty(action, 'payload', {
    value: {
      ...action.payload,
      api: {
        ...action.payload.api,
        queries: Object.entries(action.payload.api.queries).reduce((acc: {[key: string]: unknown}, [key, value]) => {
          if (!endpoints.includes(key)) {
            acc[key] = value;
          }
          return acc;
        }, {}),
        subscriptions: Object.entries(action.payload.api.subscriptions).reduce((acc: {[key: string]: unknown}, [key, value]) => {
          if (!endpoints.includes(key)) {
            acc[key] = value;
          }
          return acc;
        }, {})
      }
    }
  });

  return action;
};
