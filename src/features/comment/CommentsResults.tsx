import { PostComment } from 'features/post/postSlice.types';
import React, { useEffect } from 'react';
import useLazyInfiniteData from '../../app/hooks/useLazyInfiniteData';
import {clearInfiniteScroll, CommentApi} from './commentSlice';
import Comment from './Comment';
import {AppDispatch, AppState} from '../../app/store';
import {useDispatch, useSelector } from 'react-redux';
import {apiSlice} from '../../app/api/apiSlice';

const CommentsResults = ({postId, commentsRef}: {postId: number, commentsRef: React.RefObject<HTMLDivElement>}) => {
  const dispatch = useDispatch<AppDispatch>();

  const resetInfiniteScroll = useSelector((state: AppState) => state.comment.resetInfiniteScroll.value);
  const restartedInfiniteScroll = useSelector((state: AppState) => state.comment.resetInfiniteScroll.restarted);
  const infiniteScrollSync = useSelector((state: AppState) => state.comment.infiniteScrollSync);

  const { combinedData, loadMore, syncDataAndCache, hardReset } = useLazyInfiniteData({api: CommentApi, apiEndpointName: 'getComments',
    apiArgs: {id: postId}, limit: 8});


  /**
   * After commenting, we need to remove subs and refetch only first page
   */
  useEffect(() => {
    if (resetInfiniteScroll && restartedInfiniteScroll === postId) {
      hardReset().then(() => {
        dispatch(apiSlice.util.invalidateTags([{type: 'Comment', id: 'post_' + postId}]));
      });
    }
    return () => {
      dispatch(clearInfiniteScroll());
    };
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
   * LoadMore Comments when scroll reaches bottom of commentsRef
   */
  useEffect(() => {
    const el = commentsRef.current;
    const handleScroll = () => {
      if (el && el.scrollHeight - el.scrollTop === el.clientHeight) {
        loadMore();
      }
    };
    el?.addEventListener('scroll', handleScroll);
    return () => {
      el?.removeEventListener('scroll', handleScroll);
    };
  }, []);


  return (
    <>
      {combinedData.map((comment: PostComment) => <Comment key={comment.id} {...comment} postId={postId} />)}
    </>
  );
};

export default CommentsResults;