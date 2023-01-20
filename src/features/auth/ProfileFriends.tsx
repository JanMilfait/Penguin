import React, {useEffect, useRef } from 'react';
import s from '../../styles/6_components/Profile.module.scss';
import {AppState} from '../../app/store';
import { useSelector } from 'react-redux';
import {FriendApi, useGetFriendsIdsQuery} from '../friend/friendSlice';
import usePerfectScrollbar from '../../app/hooks/usePerfectScrollbar';
import useLazyInfiniteData from '../../app/hooks/useLazyInfiniteData';
import dynamic from 'next/dynamic';
import {Friend} from '../chat/chatSlice.types';
import FriendAvatar from 'features/friend/FriendAvatar';

const ProfileFriends = () => {
  // PerfectScrollbar
  const containerRef = useRef<HTMLDivElement>(null);
  const { updateScroll } = usePerfectScrollbar(containerRef, {wheelPropagation: false, suppressScrollX: true});
  const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: true });

  const userId = useSelector((state: AppState) => state.auth.profile.id);
  const { data: friendsIds, isSuccess, isFetching } = useGetFriendsIdsQuery({id: userId!}, {skip: typeof userId !== 'number'});
  const { combinedData, loadMore, isDone } = useLazyInfiniteData({api: FriendApi, apiEndpointName: 'getFriends', apiArgs: {id: userId}, limit: 10});
  const contentRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
        loadMore();
        updateScroll();
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Fill grid
    if (content.clientHeight !== 0 && container.clientHeight >= content.clientHeight) {
      !isDone && loadMore();
      updateScroll();
    }
  }, [combinedData]);

  if (!isSuccess || isFetching) return null;

  return (
    <div className={s.profile__friends + ' mb-4'}>
      <div className={s.profile__friendsHeader}>
        <h3 className="f--small mb-1">Friends</h3>
        {isSuccess && <p className="f--x-small mb-1">{friendsIds.ids.length} friends</p>}
      </div>
      <div className="mt-3">
        <div ref={containerRef} className={s.profile__friendsContainer}>
          <div ref={contentRef} className={s.profile__friendsContent}>
            {combinedData.map((friend: Friend) => (
              <div key={friend.id}>
                <FriendAvatar tooltip={'friendProfile'} {...friend} href={'/profile/' + friend.id}/>
              </div>
            ))}
            <ReactTooltip id="friendProfile" type="light" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileFriends;