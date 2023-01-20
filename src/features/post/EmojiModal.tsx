import {AppDispatch, AppState } from 'app/store';
import React from 'react';
import {useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/Posts.module.scss';
import Emoji from '../../components/Emoji';
import {isTrending, PostApi, useReactPostMutation, useUnreactPostMutation} from './postSlice';
import {Reaction} from './postSlice.types';
import {useReactCommentMutation, useReactReplyMutation, useUnreactCommentMutation, useUnreactReplyMutation} from '../comment/commentSlice';

type EmojiModalProps = {id: number, type: 'post'|'comment'|'reply', reactions: Reaction[], replyToId?: number};

const EmojiModal = ({id: itemId, type, reactions, replyToId}: EmojiModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const id = useSelector((state: AppState) => state.auth.data?.id);
  const myReaction = reactions && reactions.find(r => r.user.id === id)?.reaction;
  const trendingComment = useSelector((state: AppState) => isTrending(state, (type !== 'post' ? type === 'comment' ? itemId : replyToId : undefined)));

  const [reactPost] = useReactPostMutation();
  const [unreactPost] = useUnreactPostMutation();
  const [reactComment] = useReactCommentMutation();
  const [unreactComment] = useUnreactCommentMutation();
  const [reactReply] = useReactReplyMutation();
  const [unreactReply] = useUnreactReplyMutation();

  const handleClick = (reaction: number) => {
    if (type === 'post') {
      myReaction === reaction
        ? unreactPost({id: itemId})
        : reactPost({id: itemId, reaction});
    } else if (type === 'comment') {
      myReaction === reaction
        ? unreactComment({id: itemId})
        : reactComment({id: itemId, reaction});
    } else if (type === 'reply') {
      myReaction === reaction
        ? unreactReply({id: itemId, commentId: replyToId})
        : reactReply({id: itemId, commentId: replyToId, reaction});
    }
    // Invalidate Post for trending comments - they are fetched with post
    if (typeof trendingComment === 'number') {
      dispatch(PostApi.util.invalidateTags([{type: 'Post', id: trendingComment}]));
    }
  };

  return (
    <div className={s.posts__emojiModal}>
      <ul>
        <li className={myReaction === 1 ? s.posts__emojiSelected : ''} onClick={() => handleClick(1)}><Emoji id={1} size={30} /></li>
        <li className={myReaction === 2 ? s.posts__emojiSelected : ''} onClick={() => handleClick(2)}><Emoji id={2} size={30} /></li>
        <li className={myReaction === 3 ? s.posts__emojiSelected : ''} onClick={() => handleClick(3)}><Emoji id={3} size={30} /></li>
        <li className={myReaction === 4 ? s.posts__emojiSelected : ''} onClick={() => handleClick(4)}><Emoji id={4} size={30} /></li>
        <li className={myReaction === 5 ? s.posts__emojiSelected : ''} onClick={() => handleClick(5)}><Emoji id={5} size={30} /></li>
        <li className={myReaction === 6 ? s.posts__emojiSelected : ''} onClick={() => handleClick(6)}><Emoji id={6} size={30} /></li>
        <li className={myReaction === 7 ? s.posts__emojiSelected : ''} onClick={() => handleClick(7)}><Emoji id={7} size={30} /></li>
      </ul>
    </div>
  );
};

export default EmojiModal;