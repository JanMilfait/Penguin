import React, {useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import s from 'styles/6_components/FriendsSb.module.scss';
import { AppState } from '../../app/store';
import { useGetSidebarFriendsQuery } from './chatSlice';
import usePerfectScrollbar from '../../app/hooks/usePerfectScrollbar';
import useInfiniteScroll from 'app/hooks/useInfiniteScroll';
import { Friend } from './chatSlice.types';
import FriendSb from './FriendSb';
import dynamic from 'next/dynamic';

const FriendsSideBar = () => {
  // PerfectScrollbar
  const containerRef = useRef<HTMLDivElement>(null);
  const { updateScroll } = usePerfectScrollbar(containerRef);

  const id = useSelector((state: AppState) => state.auth.data!.id);
  const { combinedData, loadMore } = useInfiniteScroll(useGetSidebarFriendsQuery, {id: id, limit: 20});
  const contentRef = useRef<HTMLDivElement>(null);

  const ReactTooltip = dynamic(() => import('react-tooltip'), { ssr: true });

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Fill remaining space on big screens
    if (content.clientHeight !== 0 && container.clientHeight - 40 > content.clientHeight) {
      loadMore();
      updateScroll();
    }

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
  }, [combinedData]);


  return (
    <div ref={containerRef} className={s.friendsSideBar + (combinedData.length === 0 ? ' d-none' : '')}>
      <div ref={contentRef}>
        {combinedData.map((friend: Friend) => (
          <FriendSb  key={friend.id} friend={friend} />
        ))}
        <ReactTooltip id="friendTooltip" place="left" type="light" />
      </div>
    </div>
  );
};

export default FriendsSideBar;