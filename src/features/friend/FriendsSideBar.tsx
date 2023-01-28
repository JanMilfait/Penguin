import React, {useEffect, useRef } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/FriendsSb.module.scss';
import {AppDispatch, AppState} from '../../app/store';
import usePerfectScrollbar from '../../app/hooks/usePerfectScrollbar';
import { Friend } from '../chat/chatSlice.types';
import dynamic from 'next/dynamic';
import useLazyInfiniteData from '../../app/hooks/useLazyInfiniteData';
import {FriendApi} from './friendSlice';
import FriendAvatar from './FriendAvatar';

const FriendsSideBar = () => {
  // PerfectScrollbar
  const containerRef = useRef<HTMLDivElement>(null);
  const { updateScroll } = usePerfectScrollbar(containerRef, {wheelPropagation: false});
  const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: true });

  const dispatch = useDispatch<AppDispatch>();
  const id = useSelector((state: AppState) => state.auth.data?.id);
  const friendsSBSlideIn = useSelector((state: AppState) => state.chat.friendsSBSlideIn);
  const resetInfiniteScroll = useSelector((state: AppState) => state.friend.resetInfiniteScroll);
  const infiniteScrollSync = useSelector((state: AppState) => state.friend.infiniteScrollSync);
  const { combinedData, loadMore, isDone, hardReset, syncDataAndCache } = useLazyInfiniteData({api: FriendApi, apiEndpointName: 'getFriends', apiArgs: {id: id}, limit: 20});
  const contentRef = useRef<HTMLDivElement>(null);
  const height = useSelector((state: AppState) => state.root.window.height);


  /**
   * After adding friend, we need to remove subs and refetch only first page
   */
  useEffect(() => {
    if (resetInfiniteScroll) {
      hardReset().then(() => {
        dispatch(FriendApi.util.invalidateTags(['Friend']));
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
   *  Load more when scroll is close to bottom
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Tolerance of 5px
      if (container.scrollHeight - container.scrollTop - container.clientHeight < 5) {
        loadMore();
        updateScroll();
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);


  /**
   * Fill remaining space
   */
  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Fill remaining space on big screens
    if (content.clientHeight !== 0 && container.clientHeight - 40 > content.clientHeight) {
      !isDone && loadMore();
      updateScroll();
    }
  }, [combinedData, height]);


  return (
    <div ref={containerRef} className={s.friendsSideBar + (friendsSBSlideIn ? ' ' + s.friendsSideBar__slideIn : '') + (combinedData.length === 0 ? ' d-none' : '')}>
      <div ref={contentRef}>
        {combinedData.map((friend: Friend) => (
          <FriendAvatar key={friend.id} tooltip="friendSb" {...friend} clickOpenChat={{friendId: friend.id}} />
        ))}
      </div>
      <ReactTooltip id="friendSb" place="left" type="light" />
    </div>
  );
};

export default FriendsSideBar;