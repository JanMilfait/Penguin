import React from 'react';
import Avatar from '../../components/Avatar';
import s from '../../styles/6_components/Posts.module.scss';
import ToggleModal from '../../components/ToggleModal';
import PostDropdown from './PostDropdown';
import Link from 'next/link';
import {AppState} from '../../app/store';
import { useSelector } from 'react-redux';
import { ThreeDotsVertical } from 'react-bootstrap-icons';
import { Post } from './postSlice.types';

type PostHeadProps = {id: Post['id'], body: Post['body'], user: Post['user'], image?: Post['image'], video?: Post['video'], updated_at: Post['updated_at'], sharings: Post['sharings']};

const PostHead = ({id, body, user, image, video, updated_at, sharings}: PostHeadProps) => {
  const authId = useSelector((state: AppState) => state.auth.data?.id);
  const isAuth = typeof authId === 'number';
  const isMobile = useSelector((state: AppState) => state.root.isMobile);

  return (
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
              <h4 className="text-truncate">
                <Link className="text-black" href={'/profile/' + user.id}>{user.name}</Link>
                {image?.name && !isMobile && <>, posted an <a href={image.url + image.name} target="_blank" rel="noreferrer">image</a></>}
                {video?.name && !isMobile && <>, posted a <a href={video.url + video.name} target="_blank" rel="noreferrer">video</a></>}
              </h4>
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
        <ToggleModal
          toggle={<ThreeDotsVertical size={24} />}
          modal={<PostDropdown id={id} body={body} ownerId={user.id} sharings={sharings} />}
          clickClose={true}
          disabled={!isAuth}
        />
      </div>
    </div>
  );
};

export default PostHead;