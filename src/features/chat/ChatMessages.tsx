import React, { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import s from 'styles/6_components/Chats.module.scss';
import { ChatApi } from './chatSlice';
import usePerfectScrollbar from '../../app/hooks/usePerfectScrollbar';
import { Chat, Friend, Message } from './chatSlice.types';
import throttle from 'lodash.throttle';
import MessageMe from './MessageMe';
import MessageOther from './MessageOther';
import MessageDate from './MessageDate';
import useLazyInfiniteData from '../../app/hooks/useLazyInfiniteData';

const ChatMessages = ({id, chat}: {id: number, chat: Chat}) => {
  // PerfectScrollbar
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollToRef = useRef<HTMLDivElement>(null);
  const [oldScrollHeight, setOldScrollHeight] = React.useState(0);
  const { updateScroll, scrollTop } = usePerfectScrollbar(containerRef, {suppressScrollX: true, minScrollbarLength: 50});

  const [lastMessageId, setLastMessageId] = React.useState(0);
  const [firstMessagesRendered, setFirstMessagesRendered] = React.useState(false);
  const { combinedData, hasMore, loadMore } = useLazyInfiniteData({api: ChatApi, apiEndpointName: 'getMessages', apiArgs: {id: chat.id}, limit: 20});


  /**
   * Whenever image is loaded inside chat, scroll by the height of the image to prevent disorientation
   * (shouldn't be problem on slow connections, thanks to placeholder images)
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const imgScrollDown = (e: Event) => {
      const img = e.target as HTMLImageElement;
      if (img && img.classList.contains('imgScrollDown')) {
        container.scrollTop += img.offsetHeight;
      }
    };
    container.addEventListener('load', imgScrollDown, true);
    return () => {
      container.removeEventListener('load', imgScrollDown, true);
    };
  }, []);


  /**
   * If first render -> scroll to bottom
   * If oldScrollHeight isn't same as new scrollHeight -> new content was added -> scroll through difference
   * If lastMessageId is different from last message id -> new message was added -> scroll to bottom
   */
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !combinedData.length) return;

    if (!firstMessagesRendered && scrollToRef.current) {
      scrollTop(scrollToRef.current.offsetTop);
      setFirstMessagesRendered(true);
    }
    if (oldScrollHeight !== 0 && oldScrollHeight !== container.scrollHeight) {
      scrollTop(container.scrollHeight - oldScrollHeight);
      setOldScrollHeight(0);
    }
    if (firstMessagesRendered
      && lastMessageId !== combinedData[combinedData.length - 1].id
      && scrollToRef.current) {
      scrollTop(scrollToRef.current.offsetTop, true);
    }

    setLastMessageId(combinedData[combinedData.length - 1].id);
    updateScroll();
  }, [combinedData, oldScrollHeight, lastMessageId]);


  /**
   * If scrolled to top, load more messages and save old scrollHeight
   */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !combinedData.length) return;

    // Reverse infinite scroll must be throttled, otherwise client might hold cursor on top of container and get server timeout
    const throttled = throttle(() => {
      hasMore && loadMore(true);
      setOldScrollHeight(container.scrollHeight);
    }, 500, {trailing: false});

    const handleScroll = () => {
      if (firstMessagesRendered && container.scrollTop === 0) {
        throttled();
      }
    };
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [combinedData, firstMessagesRendered]);


  // Prepare users outside of render
  const users = useMemo(() => {
    return  chat.users.reduce((acc, user) => {
      acc[user.id] = user;
      return acc;
    }, {} as {[key: number]: Friend});
  }, [chat.users.length]);


  return (
    <>
      <div ref={containerRef} className={s.activeChats__messages} >
        <div>
          {combinedData.map((message: Message) => (
            <div key={message.id}>
              { message.showDate && <MessageDate date={message.formattedDate} /> }
              { message.user_id === id
                ? <MessageMe body={message.body} img={message.image_url} />
                : <MessageOther user={users[message.user_id]} body={message.body} img={message.image_url} />
              }
            </div>
          ))}
          <div ref={scrollToRef} ></div>
        </div>
      </div>
    </>
  );
};

export default ChatMessages;