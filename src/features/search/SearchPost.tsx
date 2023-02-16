import * as React from 'react';
import s from '../../styles/6_components/SearchBar.module.scss';
import { PencilSquare } from 'react-bootstrap-icons';
import Avatar from '../../components/Avatar';
import {setSearch} from './searchSlice';
import { useRouter } from 'next/router';
import { AppDispatch } from 'app/store';
import { useDispatch } from 'react-redux';
import { Post } from 'features/post/postSlice.types';

export const SearchPost = ({post}: {post: Post}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleClick = () => {
    router.push('/post/' + post.slug);
    dispatch(setSearch(''));
  };

  return (
    <li className={s.searchBar__post} key={post.id} onClick={handleClick}>
      <div className="row m-0">
        <div className="col-10">
          <div className="row mb-1">
            <div className="col-2">
              <div className="d-flex align-items-center justify-content-center h-100">
                <Avatar {...post.user} size={30} />
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
    </li>
  );
};

export default SearchPost;