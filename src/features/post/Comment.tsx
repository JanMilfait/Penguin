import Link from 'next/link';
import React from 'react';
import s from 'styles/6_components/Comment.module.scss';
import {PostComment, PostReply} from './postSlice.types';
import Avatar from '../../components/Avatar';
import Emoji from '../../components/Emoji';
import {getMostUsedReaction, roundCount} from '../../app/helpers/helpers';
import EmojiModal from './EmojiModal';
import HoverModal from '../../components/HoverModal';

const Comment = ({id, body, user, replies, reactions, updated_at}: PostComment | PostReply) => {

  const [showReplies, setShowReplies] = React.useState(false);

  return (
    <div className="row mt-2 mb-2">
      <div className="col-auto">
        <Link href={'/profile/' + user.id}>
          <Avatar {...user} size={32} />
        </Link>
      </div>
      <div className="col">
        <div className="row">
          <div className="col-auto">
            <div className={s.comment}>
              <Link href={'/profile/' + user.id}><h3 className="f--xx-small fw-bold text-truncate">{user.name}</h3></Link>
              <p className="f--x-small">{body}</p>
            </div>
          </div>
        </div>
        <div className="row mt-1">
          <div className="col-auto">
            <ul className={s.comment__reactions}>
              <HoverModal
                hover={<li className={s.posts__iconLeft}>{reactions.length > 0
                  ? <div className="d-flex h-100"><Emoji id={getMostUsedReaction(reactions)} size={14} /><p className="f--xx-small">{roundCount(reactions.length)}</p></div>
                  : <div className="d-flex h-100"><Emoji id={1} size={14} /><p className="f--xx-small">Hover</p></div>}
                </li>}
                modal={<EmojiModal />}
              />
              {replies && <li><p className="cp f--xx-small">Reply</p></li>}
              <li><p className="f--xx-small">{updated_at}</p></li>
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
                  <div className={s.comment__replies}>
                    {replies.map((reply: PostReply) => <Comment key={reply.id} {...reply} />)}
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

export default Comment;