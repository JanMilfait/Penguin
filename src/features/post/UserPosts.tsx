import React from 'react';
import s from 'styles/6_components/Posts.module.scss';
import UserPostsResults from './UserPostsResults';

const UserPosts = () => {
  return (
    <div className={s.posts}>
      <UserPostsResults />
    </div>
  );
};

export default UserPosts;