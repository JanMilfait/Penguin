import {AppDispatch, AppState } from 'app/store';
import React from 'react';
import {useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/Posts.module.scss';
import Avatar from '../../components/Avatar';
import { PostComment } from './postSlice.types';
import Comment from './Comment';
import { expandComments, isExpanded } from './postSlice';

const PostComments = ({postId, commentsCount, mostReacted}: {postId: number, commentsCount: number, mostReacted: PostComment | null}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: AppState) => state.auth.data!);
  const isExpandedComments = useSelector((state: AppState) => isExpanded(state, postId));

  return (
    <div className={s.posts__comments}>
      <div className="row align-items-center mt-2 mb-2">
        <div className="col-auto">
          <Avatar {...user} size={32} />
        </div>
        <div className="col">
          <input className={s.posts__addComment + ' f--x-small'} type="text" placeholder="Write a comment..." />
        </div>
        <div className="col-auto">
          <button className="button button--small f--xx-small">Add</button>
        </div>
      </div>
      <div>
        {commentsCount > 0 && <Comment {...mostReacted!} />}
        {!isExpandedComments && commentsCount > 1 && <div className="d-flex mt-3 mb-2"><p className="cp f--x-small mb-0" onClick={() => dispatch(expandComments(postId))}>View all {commentsCount} comments</p></div>}
        {/*{isExpandedComments && */}
      </div>
    </div>
  );
};

export default PostComments;