import * as React from 'react';
import s from '../../styles/6_components/SearchBar.module.scss';
import { Post } from './searchSlice.types';
import Link from 'next/link';
import { PencilSquare } from 'react-bootstrap-icons';
import Avatar from '../../components/Avatar';

export const SearchUser = ({post}: {post: Post}) => {
  return (
    <li className={s.searchBar__post} key={post.id}>
      <Link href={`/posts/${post.id}`}>
        <div className="row m-0">
          <div className="col-10">
            <div className="row mb-1">
              <div className="col-2">
                <div className="d-flex align-items-center justify-content-center h-100">
                  <Avatar user={post.user} size={30} />
                </div>
              </div>
              <div className="col-10">
                <div className="d-flex align-items-center h-100">
                  <p className="text-truncate">{post.user.name}</p>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <p className={s.searchBar__body + ' text-truncate'}>{post.body}</p>
              </div>
            </div>
          </div>
          <div className="col-2">
            <div className="d-flex align-items-center justify-content-center h-100">
              <PencilSquare />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default SearchUser;