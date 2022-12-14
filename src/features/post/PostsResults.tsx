import React, { useEffect } from 'react';
import {Post as PostType} from './postSlice.types';
import Post from './Post';
import DotLoaderSpin from '../../components/DotLoaderSpin';
import {AppDispatch, AppState} from '../../app/store';
import useLazyInfiniteData from '../../app/hooks/useLazyInfiniteData';
import {PostApi} from './postSlice';
import {useDispatch, useSelector } from 'react-redux';
import { Montserrat } from '@next/font/google';

const montserrat = Montserrat();

const PostsResults = () => {
  const dispatch = useDispatch<AppDispatch>();

  const category = useSelector((state: AppState) => state.post.filter.category);
  const trendingDays = useSelector((state: AppState) => state.post.filter.trendingDays);
  const media = useSelector((state: AppState) => state.post.filter.media);
  const reset = useSelector((state: AppState) => state.post.filter.reset);
  const infiniteScrollSync = useSelector((state: AppState) => state.post.infiniteScrollSync);
  const { combinedData, loadMore, isFetching, syncDataAndCache, hardReset } = useLazyInfiniteData({api: PostApi, apiEndpointName: 'getPosts',
    apiArgs: {category: category, media: media, trendingDays: category === 'trending' ? trendingDays : undefined}, limit: 3});


  /**
   * After adding post, we need to remove subs and refetch only first page
   */
  useEffect(() => {
    if (reset) {
      hardReset().then(() => {
        dispatch(PostApi.util.invalidateTags(['Post']));
      });
    }
  }, [reset]);

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
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
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
      loadMore();
    }
  }, [combinedData]);


  return (
    <div className={montserrat.className}>
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
    </div>
  );
};

export default PostsResults;