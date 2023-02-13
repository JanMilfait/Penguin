import React, { PointerEventHandler } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import {AppDispatch, AppState} from '../../app/store';
import {useGetPostQuery} from './postSlice';
import {Post} from './postSlice.types';
import {setOpenModal} from '../root/rootSlice';
import s from '../../styles/6_components/PostPage.module.scss';
import HoverModal from '../../components/HoverModal';
import Emoji from '../../components/Emoji';
import {getMostUsedReaction, roundCount} from '../../app/helpers/helpers';
import EmojiModal from './EmojiModal';
import PostComments from '../comment/PostComments';
import { Share } from 'react-bootstrap-icons';
import PostBody from './PostBody';
import PostHead from './PostHead';

const PostForPageText = () => {
  const dispatch = useDispatch<AppDispatch>();
  const slug = useSelector((state: AppState) => state.post.post.slug);

  const {data, isSuccess, isLoading} = useGetPostQuery({slug: slug!}, {skip: typeof slug !== 'string'});
  const {id, body, comments_count, most_reacted_comment, reactions, sharings, user, updated_at} = data as Post;

  if (isLoading || !isSuccess) return null;

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

  return (
    <div className="col-12 col-xl-8 offset-0 offset-xl-2 p-xl-0 h-100 d-flex flex-column">
      <div className={s.postPage__post} style={{borderRadius: '10px'}}>
        <PostHead {...{id, body, user, updated_at, sharings}} />
        <PostBody {...{id, body, slug}} />
        <div className="row pt-2 pb-2">
          <div className="col-auto">
            <HoverModal
              hover={<div className={s.postPage__iconLeft} onPointerDown={openReactionsModal}>{reactions.length > 0
                ? <div className="d-flex h-100"><Emoji id={getMostUsedReaction(reactions)} size={18} /><p className="f--x-small">{roundCount(reactions.length)}</p></div>
                : <div className="d-flex h-100"><Emoji id={1} size={18} /><p className="f--x-small">Hover</p></div>}
              </div>}
              modal={<EmojiModal id={id} type={'post'} reactions={reactions} />}
            />
          </div>
          <div className="col d-flex justify-content-end">
            {sharings.length > 0 && <div className={s.postPage__iconRight} onClick={openSharingModal}>
              <div className="cp d-flex h-100"><Share size={18} /><p className="f--x-small">{roundCount(sharings.length)}</p></div>
            </div>}
          </div>
        </div>
      </div>
      <PostComments
        className={s.postPage__comments}
        postId={id}
        commentsCount={comments_count}
        mostReacted={most_reacted_comment}
      />
    </div>
  );
};

export default PostForPageText;