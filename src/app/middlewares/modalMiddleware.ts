import { Middleware } from '@reduxjs/toolkit';
import { ChatApi, deactivateChat } from 'features/chat/chatSlice';
import { PostApi } from '../../features/post/postSlice';
import { setOpenModal } from '../../features/root/rootSlice';

export const modalMiddleware: Middleware = (store) => (next) => (action) => {
  if (action.type !== 'root/setCloseModal') return next(action);
  const { tag, data } = action.payload ?? {};

  if (tag === 'confirmDeletePost') {
    store.dispatch(PostApi.endpoints.deletePost.initiate({ id: data.id }));
  }

  if (tag === 'confirmSharePost') {
    store.dispatch(PostApi.endpoints.sharePost.initiate({ id: data.id }));
  }

  if (tag === 'confirmUnsharePost') {
    store.dispatch(PostApi.endpoints.unsharePost.initiate({ id: data.id }));
  }

  if (tag === 'promptReportPost') {
    store.dispatch(PostApi.endpoints.reportPost.initiate({ id: data.id, reason: data.textarea }))
      .then((res: any) => {
        if (!res.error) {
          store.dispatch(setOpenModal({
            props: {
              type: 'alert',
              icon: 'success',
              title: 'Post was reported',
              message: 'Thank you for reporting this post. We will review it shortly.',
              clickOutside: true
            }
          }));
        } else {
          store.dispatch(setOpenModal({
            props: {
              type: 'alert',
              icon: 'error',
              title: 'Couldn\'t report post',
              message: res.error.data.message,
              clickOutside: true
            }
          }));
        }
      });
  }

  if (tag === 'confirmDeleteChat') {
    store.dispatch(ChatApi.endpoints.deleteChat.initiate({ id: data }))
      .then((res: any) => {
        if (!res.error) {
          store.dispatch(deactivateChat(data));
          store.dispatch(setOpenModal({
            props: {
              type: 'alert',
              icon: 'success',
              title: 'Chat was deleted',
              message: 'Chat was deleted successfully.',
              clickOutside: true
            }
          }));
        } else {
          store.dispatch(setOpenModal({
            props: {
              type: 'alert',
              icon: 'error',
              title: 'Couldn\'t delete chat',
              message: res.error.data.message,
              clickOutside: true
            }
          }));
        }
      });
  }

  if (tag === 'formAddToChat') {
    let isError = false;

    data.selected.forEach(({value: userId}: {value: number}) => {
      if (isError) return;

      store.dispatch(ChatApi.endpoints.addParticipant.initiate({id: data.id, userId }))
        .then((res: any) => {
          if (res.error) {
            isError = true;
            store.dispatch(setOpenModal({
              props: {
                type: 'alert',
                icon: 'error',
                title: 'Couldn\'t add user to chat',
                message: res.error.data.message,
                clickOutside: true
              }
            }));
          }
        });
    });
  }

  return next(action);
};
