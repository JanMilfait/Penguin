import React, { useMemo } from 'react';
import { setOpenModal } from '../root/rootSlice';
import s from '../../styles/6_components/Dropdown.module.scss';
import { AppDispatch, AppState } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { useGetFriendsIdsNamesQuery } from 'features/friend/friendSlice';
import {Chat, Friend} from './chatSlice.types';

const ChatHeadDropdown = ({id, type, users}: {id: Chat['id'], type: Chat['type'], users: Friend[]}) => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: AppState) => state.auth.data);

  const {data: friends, isSuccess} = useGetFriendsIdsNamesQuery({id: auth!.id}, {skip: !auth?.id});

  const notAddedFriends = useMemo(() => friends?.filter((friend) => !users.some((user) => user.id === friend[0])), [friends?.length, users.length]);

  const handleAddToChat = () => {
    if (!isSuccess) return;

    dispatch(setOpenModal({
      request: {
        tag: 'formAddToChat',
        data: {id}
      },
      props: {
        type: 'form',
        title: '<span class="d-flex align-items-center justify-content-center">Add friends to chat <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-plus-fill ml-3 mb-1" viewBox="0 0 16 16">  <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>  <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/></svg></span>',
        button: 'Add Selected',
        select: {
          name: 'friends',
          options: notAddedFriends ?? []
        }
      }
    }));
  };

  const handleLeaveChat = () => {
    if (!auth?.id) return;

    dispatch(setOpenModal({
      request: {
        tag: 'confirmLeaveChat',
        data: {id, userId: auth.id}
      },
      props: {
        icon: 'warning',
        type: 'confirm',
        title: 'Are you sure, you want to leave this chat?',
        message: 'You will not have access to group chat anymore, unless you will be added.',
        button: 'Leave chat'
      }
    }));
  };

  const handleDeleteChat = () => {
    dispatch(setOpenModal({
      request: {
        tag: 'confirmDeleteChat',
        data: {id}
      },
      props: {
        icon: 'error',
        type: 'confirm',
        title: 'Are you sure, you want to delete this chat?',
        message: 'All messages will be deleted and you will not be able to restore it.',
        button: 'Delete chat'
      }
    }));
  };


  return (
    <ul className={s.dropdown}>
      <li><a onClick={handleAddToChat}>Add to chat</a></li>
      {type === 'group' && <li><a onClick={handleLeaveChat}>Leave chat</a></li>}
      <li className="text-danger"><a onClick={handleDeleteChat}>Delete chat</a></li>
    </ul>
  );
};

export default ChatHeadDropdown;