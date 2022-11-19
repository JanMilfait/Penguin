import * as React from 'react';
import s from '../../styles/6_components/SearchBar.module.scss';
import { User } from './searchSlice.types';
import Link from 'next/link';
import { PersonFill } from 'react-bootstrap-icons';
import Avatar from '../../components/Avatar';

export const SearchUser = ({user}: {user: User}) => {
  return (
    <li className={s.searchBar__user} key={user.id}>
      <Link href={`/users/${user.id}`}>
        <div className="row m-0">
          <div className="col-2">
            <div className="d-flex align-items-center justify-content-center h-100">
              <Avatar user={user} size={40} />
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
      </Link>
    </li>
  );
};

export default SearchUser;