import { AppState } from 'app/store';
import React from 'react';
import { useSelector } from 'react-redux';
import s from 'styles/6_components/Posts.module.scss';
import Emoji from '../../components/Emoji';
import {useReactPostMutation, useUnreactPostMutation} from './postSlice';
import {Reaction} from './postSlice.types';

const EmojiModal = ({id: postId, type, reactions}: {id: number, type: 'post'|'comment'|'reply', reactions: Reaction[]}) => {
  const id = useSelector((state: AppState) => state.auth.data!.id);
  const myReaction = reactions && reactions.find(r => r.user.id === id)?.reaction;

  const [reactPost] = useReactPostMutation();
  const [unreactPost] = useUnreactPostMutation();
  // TODO: ADD REST OF THE REACTIONS

  const handleClick = (reaction: number) => {
    if (type === 'post') {
      if (myReaction === reaction) {
        unreactPost({id: postId, reaction});
      } else {
        reactPost({id: postId, reaction});
      }
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