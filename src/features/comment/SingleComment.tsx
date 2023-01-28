import Link from 'next/link';
import React, {PointerEventHandler, useRef, useState } from 'react';
import s from 'styles/6_components/Comment.module.scss';
import sd from '../../styles/6_components/Dropdown.module.scss';
import { PostComment, PostReply } from '../post/postSlice.types';
import Avatar from '../../components/Avatar';
import Emoji from '../../components/Emoji';
import { getMostUsedReaction, roundCount } from '../../app/helpers/helpers';
import EmojiModal from '../post/EmojiModal';
import HoverModal from '../../components/HoverModal';
import { ThreeDots } from 'react-bootstrap-icons';
import { Roboto } from '@next/font/google';
import {AppDispatch, AppState } from 'app/store';
import {useDispatch, useSelector } from 'react-redux';
import {useAddReplyMutation, useDeleteCommentMutation, useDeleteReplyMutation, useEditCommentMutation, useEditReplyMutation} from './commentSlice';
import {isTrending, PostApi} from '../post/postSlice';
import {setOpenModal} from '../root/rootSlice';
import ToggleModalFixed from '../../components/ToggleModalFixed';
import TextareaAutosize from 'react-textarea-autosize';

const roboto = Roboto({weight: ['400', '500', '700']});
type CommentProps = (PostComment | PostReply) & {type?: 'comment' | 'reply', postId: number, replyToId?: number};

const SingleComment = ({id: commentId, postId,  replyToId, body, user, replies, reactions, created_at, type = 'comment'}: CommentProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const textareaRef = useRef<HTMLTextAreaElement|null>(null);
  const inputAddRef = useRef<HTMLInputElement>(null);
  const [showReplies, setShowReplies] = useState(false);
  const [edit, setEdit] = useState('');

  const auth = useSelector((state: AppState) => state.auth.data);
  const id = auth?.id;
  const isAuth = typeof id === 'number';
  const trendingComment = useSelector((state: AppState) => isTrending(state, (type === 'comment' ? commentId : replyToId)));

  const [editComment] = useEditCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [editReply] = useEditReplyMutation();
  const [deleteReply] = useDeleteReplyMutation();
  const [addReply] = useAddReplyMutation();


  const handleEdit = () => {
    const el = textareaRef.current;
    const oldText = edit;
    setEdit('');
    if (!el) return;
    if (el.value === oldText) return;

    type === 'comment'
      ? editComment({id: commentId, body: el.value})
      : editReply({id: commentId, commentId: replyToId!, body: el.value});

    // Invalidate Post for trending comments - they are fetched with post
    if (typeof trendingComment === 'number') {
      dispatch(PostApi.util.invalidateTags([{type: 'Post', id: trendingComment}]));
    }
  };

  const handleDelete = () => {
    type === 'comment'
      ? deleteComment({id: commentId, postId})
      : deleteReply({id: commentId, commentId: replyToId!});

    // Invalidate Post for trending comments - they are fetched with post
    if (typeof trendingComment === 'number') {
      dispatch(PostApi.util.invalidateTags([{type: 'Post', id: trendingComment}]));
    }
  };

  const handleClickReply = () => {
    if (showReplies) {
      setShowReplies(false);
    } else {
      setShowReplies(true);
      setTimeout(() => inputAddRef.current && inputAddRef.current?.focus(), 200);
    }
  };

  const handleAddReply = () => {
    const el = inputAddRef.current;
    if (!el || el.value === '') return;

    const body = el.value;
    el.value = '';
    addReply({id: commentId, body: body});

    // Invalidate Post for trending comments - they are fetched with post
    if (typeof trendingComment === 'number') {
      dispatch(PostApi.util.invalidateTags([{type: 'Post', id: trendingComment}]));
    }
  };

  const openReactionsModal = (e: any): PointerEventHandler<HTMLLIElement>|void => {
    if (!reactions.length) return;

    if (e.target?.closest('.modal-open')) {
      dispatch(setOpenModal({
        request: {
          tag: 'reactionsModal',
          data: {reactions}
        },
        props: {
          type: 'reactions',
          clickOutside: true
        }
      }));
    }
  };


  return (
    <div className={'row mt-3 mb-3'}>
      <div className="col-auto">
        <Link href={'/profile/' + user.id}>
          <Avatar {...user} size={32} />
        </Link>
      </div>
      <div className="col">
        <div className="row flex-nowrap">
          <div className={'col-auto' + (edit === '' ? ' flex-shrink-1' : ' flex-grow-1')}>
            <div className={s.comment}>
              <Link href={'/profile/' + user.id}><h3 className="f--xx-small fw-bold text-truncate">{user.name}</h3></Link>
              {edit === ''
                ? <p className="f--x-small">{body}</p>
                : <TextareaAutosize
                  ref={(el) => textareaRef.current = el}
                  className="f--x-small"
                  defaultValue={body}
                  autoFocus
                  onBlur={handleEdit}
                  onFocus={e => e.target.selectionStart = e.target.selectionEnd = e.target.value.length}
                  onKeyDown={e => e.key === 'Enter' && handleEdit()}
                />
              }
            </div>
          </div>
          {id === user.id &&
            <div className="col-auto d-flex align-items-center">
              <ToggleModalFixed
                toggle={<ThreeDots className="cp" size={16} />}
                modal={
                  <ul className={roboto.className + ' ' + sd.dropdown}>
                    <li onClick={()=>setEdit(body)}><a>Edit</a></li>
                    <li><a className="text-danger" onClick={handleDelete}>Delete</a></li>
                  </ul>
                }
                clickClose={true}
              />
            </div>
          }
        </div>
        <div className="row mt-1">
          <div className="col-auto">
            <ul className={s.comment__reactions}>
              <HoverModal
                hover={<li className={s.posts__iconLeft} onPointerDown={openReactionsModal}>{reactions.length > 0
                  ? <div className="d-flex h-100"><Emoji id={getMostUsedReaction(reactions)} size={14} /><p className="f--xx-small">{roundCount(reactions.length)}</p></div>
                  : <div className="d-flex h-100"><Emoji id={1} size={14} /><p className="f--xx-small">Hover</p></div>}
                </li>}
                modal={<EmojiModal id={commentId} type={type} reactions={reactions} replyToId={replyToId} />}
              />
              {replies && <li><p className="cp f--xx-small" onClick={handleClickReply}>Reply</p></li>}
              <li><p className="f--xx-small">{created_at}</p></li>
            </ul>
          </div>
        </div>
        {replies &&
          <>
            {replies.length > 0 && (
              !showReplies ?
                <div className="row mt-2">
                  <div className="col-auto">
                    <p className="cp f--x-small mb-0" onClick={()=>setShowReplies(true)}>&#8594; {replies.length} replies</p>
                  </div>
                </div>
                :
                <div className="row mt-2">
                  <div className="col-auto">
                    <p className="cp f--x-small mb-0" onClick={()=>setShowReplies(false)}>&#x2191; hide replies</p>
                  </div>
                </div>
            )}
            {showReplies &&
              <div className="row mt-2">
                <div className="col">
                  {isAuth &&
                    <div className="row align-items-center mt-3 mb-3">
                      <div className="col-auto">
                        {auth && <Link href={'/profile/' + auth.id}><Avatar {...auth} size={32} /></Link>}
                      </div>
                      <div className="col">
                        <input ref={inputAddRef} className={s.posts__addComment + ' f--x-small'} type="text" placeholder="Reply to a comment..." onKeyPress={(e) => e.key === 'Enter' && handleAddReply()} />
                      </div>
                      <div className="col-auto">
                        <button className="button button--small f--xx-small" onClick={handleAddReply}>Add</button>
                      </div>
                    </div>
                  }
                  <div className={s.comment__replies}>
                    {replies.map((reply: PostReply) => <SingleComment key={reply.id} {...reply} type={'reply'} postId={postId} replyToId={commentId} />)}
                  </div>
                </div>
              </div>
            }
          </>
        }
      </div>
    </div>
  );
};

export default React.memo(SingleComment);