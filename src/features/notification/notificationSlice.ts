import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MessageResponse } from 'features/root/rootSlice.types';
import { apiSlice } from '../../app/api/apiSlice';
import * as T from './notificationSlice.types';
// @ts-ignore
import {AppState, store} from '../../app/store';


export const NotificationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<T.Notification[], void>({
      query: () => '/api/user/notifications',
      transformResponse: (response: T.Notification[]): any => {
        // @ts-ignore
        store.dispatch(setNotifications(response));
      },
      providesTags: ['Notification']
    }),
    markNotificationsAsReaded: builder.mutation<MessageResponse, {ids: number[]}>({
      query: ({ids}) => ({
        url: '/api/user/notifications',
        method: 'PATCH',
        body: {notifications: ids}
      })
    })
  })
});


export const NotificationSlice = createSlice({
  name: 'notification',
  initialState: {
    pendingNotifications: [],
    messageNotifications: [],
    otherNotifications: [],
    debounceTime: 1000
  } as T.NotificationState,
  reducers: {
    setNotifications: (state, action) => {
      const pendingNotifications = [];
      const messageNotifications = [];
      const otherNotifications = [];
      for (let i = 0; i < action.payload.length; i++) {
        const notification = action.payload[i];
        if (notification.source === 'pending') {
          pendingNotifications.push(notification);
        } else if (notification.source === 'message') {
          messageNotifications.push(notification);
        } else {
          otherNotifications.push(notification);
        }
        state.pendingNotifications = pendingNotifications;
        state.messageNotifications = messageNotifications;
        state.otherNotifications = otherNotifications;
      }
    },
    addPendingNotification: (state, action: PayloadAction<T.Notification>) => {
      const index = state.pendingNotifications.findIndex((notification) => notification.id === action.payload.id);
      if (index !== -1) {
        state.pendingNotifications[index] = action.payload;
      } else {
        state.pendingNotifications.unshift(action.payload);
      }
    },
    addMessageNotification: (state, action: PayloadAction<T.Notification>) => {
      const index = state.messageNotifications.findIndex((notification) => notification.id === action.payload.id);
      if (index !== -1) {
        state.messageNotifications[index] = action.payload;
      } else {
        state.messageNotifications.unshift(action.payload);
      }
    },
    addOtherNotification: (state, action: PayloadAction<T.Notification>) => {
      const index = state.otherNotifications.findIndex((notification) => notification.id === action.payload.id);
      if (index !== -1) {
        state.otherNotifications[index] = action.payload;
      } else {
        state.otherNotifications.unshift(action.payload);
      }
    },
    markPendingAsReaded: (state, action) => {
      const notification = state.pendingNotifications.findIndex((notification) => notification.id === action.payload);
      if (notification !== -1) {
        state.pendingNotifications[notification].readed_at = new Date().toISOString();
      }
    },
    markMessageAsReaded: (state, action) => {
      const notification = state.messageNotifications.findIndex((notification) => notification.id === action.payload);
      if (notification !== -1) {
        state.messageNotifications[notification].readed_at = new Date().toISOString();
      }
    },
    markOtherAsReaded: (state, action) => {
      const notification = state.otherNotifications.findIndex((notification) => notification.id === action.payload);
      if (notification !== -1) {
        state.otherNotifications[notification].readed_at = new Date().toISOString();
      }
    }
  }
});


export const {
  useGetNotificationsQuery,
  useMarkNotificationsAsReadedMutation
} = NotificationApi;

export const {
  setNotifications,
  addPendingNotification,
  addMessageNotification,
  addOtherNotification,
  markPendingAsReaded,
  markMessageAsReaded,
  markOtherAsReaded
} = NotificationSlice.actions;


export const unreadedPendingNotifications = createSelector(
  (state: AppState) => state.notification.pendingNotifications,
  (state: AppState, count: boolean) => count,
  (pendingNotifications, count) => {
    if (count) {
      return pendingNotifications.filter((notification) => !notification.readed_at).length;
    } else {
      const unreaded = new Map();
      pendingNotifications.filter((notification) => !notification.readed_at).forEach((notification) => {
        unreaded.set(`${notification.source_id + notification.source}`, notification.id);
      });
      return unreaded;
    }
  }
);

export const unreadedMessageNotifications = createSelector(
  (state: AppState) => state.notification.messageNotifications,
  (state: AppState, count: boolean) => count,
  (messageNotifications, count) => {
    if (count) {
      return messageNotifications.filter((notification) => !notification.readed_at).length;
    } else {
      const unreaded = new Map();
      messageNotifications.filter((notification) => !notification.readed_at).forEach((notification) => {
        unreaded.set(`${notification.source_id + notification.source}`, notification.id);
      });
      return unreaded;
    }
  }
);

export const unreadedOtherNotifications = createSelector(
  (state: AppState) => state.notification.otherNotifications,
  (state: AppState, count: boolean) => count,
  (otherNotifications, count) => {
    if (count) {
      return otherNotifications.filter((notification) => !notification.readed_at).length;
    } else {
      const unreaded = new Map();
      otherNotifications.filter((notification) => !notification.readed_at).forEach((notification) => {
        unreaded.set(`${notification.source_id + notification.source}`, notification.id);
      });
      return unreaded;
    }
  }
);

export default NotificationSlice.reducer;