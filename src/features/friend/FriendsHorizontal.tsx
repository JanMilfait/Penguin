import React, { useEffect } from 'react';
import s from 'styles/6_components/FriendsHorizontal.module.scss';
import { Friend } from '../chat/chatSlice.types';
import FriendAvatar from './FriendAvatar';
import { AppState } from '../../app/store';
import { useSelector } from 'react-redux';
import useLazyInfiniteData from '../../app/hooks/useLazyInfiniteData';
import { FriendApi } from './friendSlice';

const FriendsHorizontal = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  const id = useSelector((state: AppState) => state.auth.data?.id);
  const width = useSelector((state: AppState) => state.root.window.width);
  const resetInfiniteScroll = useSelector((state: AppState) => state.friend.resetInfiniteScroll);
  const infiniteScrollSync = useSelector((state: AppState) => state.friend.infiniteScrollSync);
  const { combinedData, loadMore, isDone, hardReset, syncDataAndCache } = useLazyInfiniteData({api: FriendApi, apiEndpointName: 'getFriends', apiArgs: {id: id}, limit: 20});


  /**
   * After adding friend, we need to remove subs and refetch only first page
   */
  useEffect(() => {
    if (resetInfiniteScroll) {
      hardReset();
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
   *  Load more when scroll is close to width end
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Tolerance of 5px
      if (container.scrollWidth - container.scrollLeft - container.clientWidth < 5) {
        loadMore();
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
    if (content.clientWidth !== 0 && container.clientWidth - 6 > content.clientWidth) {
      !isDone && loadMore();
    }
  }, [combinedData, width]);


  return (
    <div ref={containerRef} className={s.friendsHorizontal}>
      {combinedData &&
        <div ref={contentRef} className="d-inline-flex align-items-center">
          {combinedData.map((friend: Friend) => (
            <div key={friend.id} className="mr-1">
              <FriendAvatar {...friend} clickOpenChat={{friendId: friend.id}} />
            </div>
          ))}
        </div>
      }
      {!combinedData && <p>No friends</p>}
    </div>
  );
};

export default FriendsHorizontal;