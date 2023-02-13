import * as React from 'react';
import s from '../../styles/6_components/SearchBar.module.scss';
import { PersonFill } from 'react-bootstrap-icons';
import Avatar from '../../components/Avatar';
import {AppDispatch} from '../../app/store';
import {setSearch} from './searchSlice';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { User } from 'features/auth/authSlice.types';

export const SearchUser = ({user}: {user: User}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/profile/${user.slug}`);
    dispatch(setSearch(''));
  };

  return (
    <li className={s.searchBar__user} key={user.id} onClick={handleClick}>
      <div className="row m-0">
        <div className="col-2">
          <div className="d-flex align-items-center justify-content-center h-100">
            <Avatar {...user} size={40} />
          </div>
        </div>
        <div className="col-8">
          <div className="d-flex align-items-center h-100">
            <p className="text-truncate">{user.name}</p>
          </div>
        </div>
        <div className="col-2">
          <div className="d-flex align-items-center justify-content-center h-100">
            <PersonFill />
          </div>
        </div>
      </div>
    </li>
  );
};

export default SearchUser;