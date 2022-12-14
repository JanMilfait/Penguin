import React from 'react';
import s from 'styles/6_components/Posts.module.scss';
import PostsFilter from './PostsFilter';
import PostsResults from './PostsResults';

const Posts = () => {
  return (
    <div className={s.posts}>
      <PostsFilter />
      <PostsResults />
    </div>
  );
};

export default Posts;