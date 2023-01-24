import { Roboto } from '@next/font/google';
import { AppDispatch, AppState } from 'app/store';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/Dropdown.module.scss';
import { setOpenModal } from '../root/rootSlice';
import { PostSharing } from './postSlice.types';

const roboto = Roboto({weight: ['400', '500', '700']});

const PostDropdown = ({id, ownerId, sharings}: {id: number, ownerId: number, sharings: PostSharing[]}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: AppState) => state.auth.data);
  const isShared = sharings.some(sharing => sharing.user.id === user?.id);

  const handleDelete = () => {
    dispatch(setOpenModal({
      request: {
        tag: 'confirmDeletePost',
        data: {id}
      },
      props: {
        icon: 'warning',
        type: 'confirm',
        title: 'Delete post',
        message: 'Are you sure you want to delete this post? This action cannot be undone.',
        button: 'Delete post'
      }
    }));
  };

  const handleShare = () => {
    dispatch(setOpenModal({
      request: {
        tag: 'confirmSharePost',
        data: {id}
      },
      props: {
        type: 'confirm',
        icon: 'info',
        title: 'Post will be shared on your profile'
      }
    }));
  };

  const handleUnshare = () => {
    dispatch(setOpenModal({
      request: {
        tag: 'confirmUnsharePost',
        data: {id}
      },
      props: {
        type: 'confirm',
        icon: 'info',
        title: 'Post will be removed from your profile'
      }
    }));
  };

  const handleReport = () => {
    dispatch(setOpenModal({
      request: {
        tag: 'promptReportPost',
        data: {id}
      },
      props: {
        type: 'prompt',
        icon: 'warning',
        title: 'Are you sure you want to report this post?',
        message: 'Write a reason for reporting this post.',
        button: 'Report'
      }
    }));
  };

// TODO: EDIT
  return (
    <ul className={s.dropdown + ' ' + roboto.className}>
      <li><a>Hide</a></li>
      {user?.id === ownerId ? (
        <>
          <li><a>Edit</a></li>
          <li onClick={handleDelete}><a className="text-danger" >Delete</a></li>
        </>
      ) : (
        <>
          {isShared
            ? <li onClick={handleUnshare}><a>Unshare</a></li>
            : <li onClick={handleShare}><a>Share</a></li>
          }
          <li onClick={handleReport}><a className="text-danger">Report</a></li>
        </>
      )}
    </ul>
  );
};

export default PostDropdown;