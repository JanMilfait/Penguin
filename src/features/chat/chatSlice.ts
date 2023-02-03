import { createSlice, createAsyncThunk, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { apiSlice } from '../../app/api/apiSlice';
import * as T from './chatSlice.types';
import { Chat } from './chatSlice.types';
import { AppState } from '../../app/store';
import { appendDatesToMessages } from 'app/helpers/helpers';

export const ChatApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query<T.ChatsResult, void>({
      query: () => '/api/chats',
      providesTags: (result): any =>
        result
          ? [...result.map(({id}) => ({type: 'Chats', id})), 'Chats']
          : ['Chats']
    }),
    getChat: builder.query<T.ChatResult, T.ChatArg>({
      query: ({id}) => '/api/chat/' + id,
      keepUnusedDataFor: 0,
      transformResponse: (response: T.ChatResult) => {
        response.scrollToBottom = 1;
        return response;
      },
      providesTags: (result, error, arg): any => [{type: 'Chats', id: arg.id}]
    }),
    getChatFriend: builder.query<T.ChatResult, T.ChatArg>({
      query: ({id}) => '/api/chat/friend/' + id,
      keepUnusedDataFor: 0,
      transformResponse: (response: T.ChatResult) => {
        response.scrollToBottom = 1;
        return response;
      }
    }),
    deleteChat: builder.mutation<T.DeleteChatResult, T.DeleteChatArg>({
      query: ({id}) => ({
        url: '/api/chat/' + id,
        method: 'DELETE'
      })
    }),
    getMessages: builder.query<T.MessagesResult, T.MessagesArg>({
      query: ({id, page, limit}) => '/api/chat/' + id + '/messages?page=' + page + '&limit=' + limit,
      transformResponse: (response: T.MessagesResult) => {
        response.items.map((message) => {
          const prevMessage = response.items[response.items.indexOf(message) - 1];
          return appendDatesToMessages(prevMessage, message);
        });
        return response;
      }
    }),
    sendMessage: builder.mutation<T.MessageResult, T.SendMessageArg>({
      query: ({id, body, image}) => ({
        url: '/api/chat/' + id + '/message',
        method: 'POST',
        body: body ? {body} : image ?? null,
        headers: body ? {'Content-Type': 'application/json'} : {}
      }),
      async onQueryStarted(arg, {dispatch, queryFulfilled}) {
        if (!arg.image && arg.body) {
          dispatch(ChatApi.util.updateQueryData('getMessages', {id: arg.id, limit: 20, page: 1}, (draft) => {
            const prevMessage = draft.items[draft.items.length - 1];

            const message: T.Message = {
              id: -Math.floor(Math.random() * 100000000), // temporary id
              user_id: arg.userId,
              body: arg.body ? arg.body.trim() : null,
              image_url: null,
              created_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };
            appendDatesToMessages(prevMessage, message);
            draft.items.push(message);
            dispatch(syncInfiniteScroll());
          }));
        } else {
          const result = await queryFulfilled;
          const message = await Object.assign({}, result.data);
          dispatch(ChatApi.util.updateQueryData('getMessages', {id: arg.id, limit: 20, page: 1}, (draft) => {
            const prevMessage = draft.items[draft.items.length - 1];

            appendDatesToMessages(prevMessage, message);
            draft.items.push(message);
            dispatch(syncInfiniteScroll());
          }));
        }
      }
    }),
    addParticipant: builder.mutation<T.AddParticipantResult, T.AddParticipantArg>({
      query: ({id, userId}) => ({
        url: '/api/chat/' + id + '/participant',
        method: 'POST',
        body: {user_id: userId}
      }),
      invalidatesTags: (result, error, arg): any => [{type: 'Chats', id: arg.id}] // TODO: check
    }),
    removeParticipant: builder.mutation<T.RemoveParticipantResult, T.RemoveParticipantArg>({
      query: ({id, userId}) => ({
        url: '/api/chat/' + id + '/participant/' + userId,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, arg): any => [{type: 'Chats', id: arg.id}]
    })
  })
});


/**
 * Create action for pusher middleware and fetch on every dispatch
 * (friend clicked -> api automatically create private chat if previous was changed to group)
 */
export const activateChat = createAsyncThunk('chat/activateChat', async ({friendId, chatId}: {friendId?: number, chatId?: number}, {getState, dispatch, rejectWithValue}): Promise<Chat|any> => {
  const store = getState() as AppState;

  // Mobile Devices
  if (store.root.isMobile) {
    dispatch(deactivateChatAll());
    dispatch(setExpandChats(true));
  }

  const chatInit = dispatch(ChatApi.endpoints[friendId ? 'getChatFriend' : 'getChat'].initiate({id: friendId ?? chatId!}));
  const chat = await chatInit;
  await chatInit.unsubscribe();
  if (!chat.data || chat.isError) {
    return rejectWithValue({message: 'Error while fetching chat'});
  }
  return chat.data;
});


export const ChatSlice = createSlice({
  name: 'chat',
  initialState: {
    activeChats: [],
    openedChats: [],
    openedEmojiPicker: [],
    openedGiphyPicker: [],
    expandChats: false,
    animation: {
      time: 200,
      closeTimeout: 180 // unmount chat just before animation ends to prevent flickering
    },
    infiniteScrollSync: 0
  } as T.ChatState,
  reducers: {
    setExpandChats: (state, action: PayloadAction<boolean>) => {
      state.expandChats = action.payload;
    },
    toggleChat: (state, action: PayloadAction<number>) => {
      const isOpened = state.openedChats.find(id => id === action.payload);
      isOpened
        ? state.openedChats = state.openedChats.filter(id => id !== action.payload)
        : state.openedChats.push(action.payload);
    },
    toggleEmojiPicker: (state, action: PayloadAction<number>) => {
      const isOpenedGiphy = state.openedGiphyPicker.find(id => id === action.payload);
      isOpenedGiphy && (state.openedGiphyPicker = state.openedGiphyPicker.filter(id => id !== action.payload));

      const isOpened = state.openedEmojiPicker.find(id => id === action.payload);
      isOpened
        ? state.openedEmojiPicker = state.openedEmojiPicker.filter(id => id !== action.payload)
        : state.openedEmojiPicker.push(action.payload);
    },
    toggleGiphyPicker: (state, action: PayloadAction<number>) => {
      const isOpenedEmoji = state.openedEmojiPicker.find(id => id === action.payload);
      isOpenedEmoji && (state.openedEmojiPicker = state.openedEmojiPicker.filter(id => id !== action.payload));

      const isOpened = state.openedGiphyPicker.find(id => id === action.payload);
      isOpened
        ? state.openedGiphyPicker = state.openedGiphyPicker.filter(id => id !== action.payload)
        : state.openedGiphyPicker.push(action.payload);
    },
    minimizeChat: (state, action: PayloadAction<number>) => {
      state.openedChats = state.openedChats.filter((id) => id !== action.payload);
    },
    deactivateChat: (state, action: PayloadAction<number>) => {
      state.openedChats = state.openedChats.filter((id) => id !== action.payload);
      state.activeChats = state.activeChats.filter(chat => chat.id !== action.payload);
    },
    deactivateChatAll: (state) => {
      state.openedChats = [];
      state.activeChats = [];
    },
    setFriendsSBSlideIn: (state) => {
      state.friendsSBSlideIn = true;
    },
    syncInfiniteScroll: (state) => {
      state.infiniteScrollSync++;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(activateChat.fulfilled, (state, action: PayloadAction<Chat>) => {
        // If 6 or more chats are opened, remove last activated
        if (state.activeChats.length >= 6) {
          state.activeChats = state.activeChats.slice(1);
        }
        const isActive = state.activeChats.find(chat => chat.id === action.payload.id);
        !isActive && state.activeChats.push(action.payload);

        const isOpened = state.openedChats.find(id => id === action.payload.id);
        !isOpened && state.openedChats.push(action.payload.id);
      });
  }
});

export const {
  useGetChatsQuery,
  useSendMessageMutation
} = ChatApi;

export const {
  setExpandChats,
  toggleChat,
  toggleEmojiPicker,
  toggleGiphyPicker,
  minimizeChat,
  deactivateChat,
  deactivateChatAll,
  setFriendsSBSlideIn,
  syncInfiniteScroll
} = ChatSlice.actions;

export const isSomeChatActive = createSelector(
  (state: AppState) => state.chat.activeChats,
  (activeChats) => activeChats.length > 0
);

export const getActiveChat = createSelector(
  (state: AppState) => state.chat.activeChats,
  (state: AppState, id: number) => id,
  (activeChats, id) => activeChats.find(chat => chat.id === id)
);

export const isOpenedChat = createSelector(
  (state: AppState) => state.chat.openedChats,
  (state: AppState, id: number) => id,
  (openedChats, id) => {
    const isOpened = openedChats.find(openedId => openedId === id);
    return !!isOpened;
  }
);

export const isOpenedEmojiPicker = createSelector(
  (state: AppState) => state.chat.openedEmojiPicker,
  (state: AppState, id: number) => id,
  (openedEmojiPicker, id) => {
    const isOpened = openedEmojiPicker.find(openedId => openedId === id);
    return !!isOpened;
  }
);

export const isOpenedGiphyPicker = createSelector(
  (state: AppState) => state.chat.openedGiphyPicker,
  (state: AppState, id: number) => id,
  (openedGiphyPicker, id) => {
    const isOpened = openedGiphyPicker.find(openedId => openedId === id);
    return !!isOpened;
  }
);

export default ChatSlice.reducer;
