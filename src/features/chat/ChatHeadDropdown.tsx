import { Roboto } from '@next/font/google';
import React from 'react';
import { setOpenModal } from '../root/rootSlice';
import s from '../../styles/6_components/Dropdown.module.scss';
import { AppDispatch } from '../../app/store';
import { useDispatch } from 'react-redux';

const roboto = Roboto({weight: ['400', '500', '700']});

const ChatHeadDropdown = ({id}: {id: number}) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToChat = () => {
    dispatch(setOpenModal({
      request: {
        tag: 'formAddToChat',
        data: {id}
      },
      props: {
        type: 'form',
        title: 'Add friends to chat',
        button: 'AddSelected',
        select: {
          name: 'friends', // TODO - change to MULTIPLE POST
          options: []
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
    <ul className={s.dropdown + ' ' + roboto.className}>
      <li><a onClick={handleAddToChat}>Add to chat</a></li>
      <li className="text-danger"><a onClick={handleDeleteChat}>Delete chat</a></li>
    </ul>
  );
};

export default ChatHeadDropdown;