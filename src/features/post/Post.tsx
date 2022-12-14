import React from 'react';
import s from 'styles/6_components/Posts.module.scss';
import { Post as PostType } from './postSlice.types';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import ToggleModal from '../../components/ToggleModal';
import PostDropdown from './PostDropdown';
import Avatar from '../../components/Avatar';
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
import PostComments from './PostComments';
import { toggleComments } from './postSlice';
import {setOpenModal} from '../root/rootSlice';

const Post = ({id, body, user, updated_at, image, video, reactions, sharings, comments_count, most_reacted_comment}: PostType) => {
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useSelector((state: AppState) => state.root.isMobile);

  const openReactionsModal = () => {
    if (!reactions.length) return;

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

  return (
    <div className="mb-5">
      <div className={s.posts__post}>
        <div className="row align-items-center">
          <div className="col-auto">
            <Link href={'/profile/' + user.id}>
              <Avatar {...user} size={50} />
            </Link>
          </div>
          <div className="col mw-0">
            <div className="row">
              <div className="col-auto">
                <div className={s.posts__title}>
                  <Link href={'/profile/' + user.id}>
                    <h4 className='text-truncate'>{user.name}</h4>
                  </Link>
                  {image?.name && !isMobile && <h4 className={s.posts__postImage}>, posted an <a href={image.url + image.name} target="_blank" rel="noreferrer">image</a></h4>}
                  {video?.name && !isMobile && <h4 className={s.posts__postImage}>, posted a <a href={video.url + video.name} target="_blank" rel="noreferrer">video</a></h4>}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col">
                <div className={s.posts__updated}>
                  <p className="text-truncate">{updated_at}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="col-auto">
            <ToggleModal toggle={<ThreeDotsVertical size={24} />} modal={<PostDropdown id={id} ownerId={user.id} sharings={sharings} />} anchorClickClose={true} />
          </div>
        </div>
        <h3 className="f--small mt-4 mb-3 pt-2 pb-2" onDoubleClick={() => window.open('/post/' + id, '_blank')}>
          {body}
        </h3>
        {image?.name && <div className="mb-3"><Link className="text-decoration-none" href={'/post/' + id}><PostImage {...image} small={true} className="aspect-ratio w-100" /></Link></div>}
        {video?.name && <div className="mb-3"><PostVideo {...video} className="aspect-ratio aspect-ratio-16x9 bg-black" /></div>}
        <div className="row pt-2 pb-2">
          <div className="col-auto">
            <HoverModal
              hover={<div className={s.posts__iconLeft} onClick={openReactionsModal}>{reactions.length > 0
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