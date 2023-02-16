import React, { PointerEventHandler } from 'react';
import s from 'styles/6_components/Posts.module.scss';
import { Post as PostType } from './postSlice.types';
import {useDispatch, useSelector } from 'react-redux';
import {AppDispatch, AppState } from '../../app/store';
import PostImage from './PostImage';
import PostVideo from './PostVideo';
import Link from 'next/link';
import { ChatSquare, Share } from 'react-bootstrap-icons';
import { getMostUsedReaction, roundCount } from 'app/helpers/helpers';
import Emoji from '../../components/Emoji';
import HoverModal from 'components/HoverModal';
import EmojiModal from './EmojiModal';
import PostComments from '../comment/PostComments';
import { toggleComments, isHidden } from './postSlice';
import {setOpenModal} from '../root/rootSlice';
import PostHead from './PostHead';
import PostBody from './PostBody';

const Post = ({id, slug, body, user, updated_at, image, video, reactions, sharings, comments_count, most_reacted_comment}: PostType) => {
  const dispatch = useDispatch<AppDispatch>();
  const isPostHidden = useSelector((state: AppState) => isHidden(state, id));
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

  const openSharingModal = () => {
    if (!sharings.length) return;

    dispatch(setOpenModal({
      request: {
        tag: 'sharingModal',
        data: {sharings}
      },
      props: {
        type: 'sharing',
        clickOutside: true
      }
    }));
  };

  if (isPostHidden) return (
    <div className="mb-3">
      <div className={s.posts__post} style={{borderRadius: '10px'}}>
        <PostHead {...{id, body, user, image, video, updated_at, sharings}} />
      </div>
    </div>
  );

  return (
    <div className="mb-5">
      <div className={s.posts__post}>
        <PostHead {...{id, body, user, image, video, updated_at, sharings}} />
        <PostBody {...{id, slug, body}} />
        {image?.name && <div className="mb-3"><Link className="text-decoration-none" href={'/post/' + slug}><PostImage {...image} small={true} className="aspect-ratio w-100" style={{maxHeight: '450px', objectFit: 'cover'}} /></Link></div>}
        {video?.name && <div className="mb-3"><PostVideo {...video} className="aspect-ratio aspect-ratio-16x9 bg-black" /></div>}
        <div className="row pt-2 pb-2">
          <div className="col-auto">
            <HoverModal
              hover={<div className={s.posts__iconLeft} onPointerDown={openReactionsModal}>{reactions.length > 0
                ? <div className="d-flex h-100"><Emoji id={getMostUsedReaction(reactions)} size={18} /><p className="f--x-small">{roundCount(reactions.length)}</p></div>
                : <div className="d-flex h-100"><Emoji id={1} size={18} /><p className="f--x-small">Hover</p></div>}
              </div>}
              modal={<EmojiModal id={id} type={'post'} reactions={reactions} />}
            />
          </div>
          <div className="col d-flex justify-content-end">
            {comments_count > 0 && <div className={s.posts__iconRight} onClick={() => comments_count > 1 && dispatch(toggleComments(id))}>
              <div className="cp d-flex h-100"><ChatSquare size={18} /><p className="f--x-small">{roundCount(comments_count)}</p></div>
            </div>}
            {sharings.length > 0 && <div className={s.posts__iconRight} onClick={openSharingModal}>
              <div className="cp d-flex h-100"><Share size={18} /><p className="f--x-small">{roundCount(sharings.length)}</p></div>
            </div>}
          </div>
        </div>
      </div>
      <PostComments postId={id} commentsCount={comments_count} mostReacted={most_reacted_comment} />
    </div>
  );
};

export default React.memo(Post);