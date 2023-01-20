import {AppDispatch, AppState } from 'app/store';
import React from 'react';
import {useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/Posts.module.scss';
import Avatar from '../../components/Avatar';
import { PostComment } from '../post/postSlice.types';
import Comment from './Comment';
import {expandComments, isExpanded} from '../post/postSlice';
import CommentsResults from './CommentsResults';
import {useAddCommentMutation} from './commentSlice';

const PostComments = ({postId, commentsCount, mostReacted}: {postId: number, commentsCount: number, mostReacted: PostComment | null}) => {
  const dispatch = useDispatch<AppDispatch>();
  const commentsRef = React.useRef<HTMLDivElement>(null);
  const user = useSelector((state: AppState) => state.auth.data!);
  const isExpandedComments = useSelector((state: AppState) => isExpanded(state, postId));

  const id = useSelector((state: AppState) => state.auth.data?.id);
  const isAuth = typeof id === 'number';

  const inputAddRef = React.useRef<HTMLInputElement>(null);
  const [addComment] = useAddCommentMutation();


  const handleAddComment = () => {
    const el = inputAddRef.current;
    if (!el || el.value === '') return;

    const body = el.value;
    el.value = '';
    addComment({id: postId, body: body});
  };


  return (
    <div className={s.posts__comments}>
      {isAuth &&
        <div className="row align-items-center mt-3 mb-3">
          <div className="col-auto">
            <Avatar {...user} size={32} />
          </div>
          <div className="col">
            <input ref={inputAddRef} className={s.posts__addComment + ' f--x-small'} type="text" placeholder="Write a comment..." onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddComment();
              }
            }} />
          </div>
          <div className="col-auto">
            <button className="button button--small f--xx-small" onClick={handleAddComment}>Add</button>
          </div>
        </div>
      }
      <div ref={commentsRef} className={s.posts__commentsContent}>
        {commentsCount > 0 && <Comment {...mostReacted!} postId={postId} />}
        {!isExpandedComments
          ? commentsCount > 1 && <div className="d-flex mt-3 mb-2"><p className="cp f--x-small mb-0" onClick={() => dispatch(expandComments(postId))}>View all {commentsCount} comments</p></div>
          : <CommentsResults commentsRef={commentsRef} postId={postId} />
        }
      </div>
    </div>
  );
};

export default PostComments;