import React from 'react';
import { setOpenModal } from '../root/rootSlice';
import s from '../../styles/6_components/Dropdown.module.scss';
import { AppDispatch, AppState } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { useGetFriendsIdsNamesQuery } from 'features/friend/friendSlice';

const ChatHeadDropdown = ({id}: {id: number}) => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: AppState) => state.auth.data);

  const {data: friends, isSuccess} = useGetFriendsIdsNamesQuery({id: auth!.id}, {skip: !auth?.id});

  const handleAddToChat = () => {
    if (!isSuccess) return;

    dispatch(setOpenModal({
      request: {
        tag: 'formAddToChat',
        data: {id}
      },
      props: {
        type: 'form',
        title: '<span class="d-flex align-items-center justify-content-center">Add friends to chat <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person-hearts ml-3" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.5 1.246c.832-.855 2.913.642 0 2.566-2.913-1.924-.832-3.421 0-2.566ZM9 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-9 8c0 1 1 1 1 1h10s1 0 1-1-1-4-6-4-6 3-6 4Zm13.5-8.09c1.387-1.425 4.855 1.07 0 4.277-4.854-3.207-1.387-5.702 0-4.276ZM15 2.165c.555-.57 1.942.428 0 1.711-1.942-1.283-.555-2.281 0-1.71Z"/></svg</span>',
        button: 'Add Selected',
        select: {
          name: 'friends',
          options: friends
        }
      }
    }));
  };

  const handleDeleteChat = () => {
    dispatch(setOpenModal({
      request: {
        tag: 'confirmDeleteChat',
        data: id
      },
      props: {
        icon: 'warning',
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
      <li className="text-danger"><a onClick={handleDeleteChat}>Delete chat</a></li>
    </ul>
  );
};

export default ChatHeadDropdown;