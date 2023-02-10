import React, { useEffect } from 'react';
import {Post as PostType} from './postSlice.types';
import Post from './Post';
import DotLoaderSpin from '../../components/DotLoaderSpin';
import {AppDispatch, AppState} from '../../app/store';
import useLazyInfiniteData from '../../app/hooks/useLazyInfiniteData';
import {PostApi} from './postSlice';
import {useDispatch, useSelector } from 'react-redux';
import s from '../../styles/6_components/Posts.module.scss';

const UserPostsResults = () => {
  const dispatch = useDispatch<AppDispatch>();

  const userId = useSelector((state: AppState) => state.auth.profile.id);
  const resetInfiniteScroll = useSelector((state: AppState) => state.post.resetInfiniteScroll);
  const infiniteScrollSync = useSelector((state: AppState) => state.post.infiniteScrollSync);
  const { combinedData, loadMore, isFetching, syncDataAndCache, hardReset, isDone } = useLazyInfiniteData({api: PostApi, apiEndpointName: 'getUserPosts',
    apiArgs: {id: userId}, limit: 3});
  const height = useSelector((state: AppState) => state.root.window.height);


  /**
   * After adding post, we need to remove subs and refetch only first page
   */
  useEffect(() => {
    if (resetInfiniteScroll) {
      hardReset().then(() => {
        dispatch(PostApi.util.invalidateTags(['Post']));
      });
    }
  }, [resetInfiniteScroll]);

  /**
   * This need to be run every time cache changes, for combinedData to be updated
   */
  useEffect(() => {
    if (infiniteScrollSync) {
      syncDataAndCache();
    }
  }, [infiniteScrollSync]);

  /**
   * LoadMore Posts when scroll reaches bottom of page
   */
  useEffect(() => {
    const handleScroll = () => {
      // tolerance of 5px from bottom of page
      if (window.innerHeight + document.documentElement.scrollTop + 5 < document.documentElement.offsetHeight) return;
      loadMore();
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  /**
   * If page height is less than window height, load more posts
   */
  useEffect(() => {
    if (document.body.clientHeight < window.innerHeight) {
      !isDone && loadMore();
    }
  }, [combinedData, height]);


  return (
    <div className={s.posts}>
      {combinedData.map((post: PostType) => (
        <Post key={post.id} {...post} />
      ))}
      {isFetching &&
        <div className="row">
          <div className="col-12 d-flex justify-content-center mt-2 mb-2">
            <DotLoaderSpin />
          </div>
        </div>
      }
      {isDone && (
        combinedData.length === 0 ?
          <div className="row">
            <div className="col-12 d-flex justify-content-center mt-5 mb-5">
              <p className="f--medium mb-0">No posts yet</p>
            </div>
          </div>
          :
          <div className="row">
            <div className="col-12 d-flex justify-content-center mb-5">
              <p className="f--medium mb-0">No more posts</p>
            </div>
          </div>
      )}
    </div>
  );
};

export default UserPostsResults;