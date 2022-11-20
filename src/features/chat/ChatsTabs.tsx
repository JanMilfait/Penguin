import {AppDispatch, AppState } from 'app/store';
import React, { useEffect } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/Chats.module.scss';
import Chat from './Chat';
import Tab from './Tab';
import {setExpandChats} from './chatSlice';

function ChatsTabs() {
  const dispatch = useDispatch<AppDispatch>();
  const activeChats = useSelector((state: AppState) => state.chat.activeChats);

  /**
   * Calculate transition duration for each tab (skip first tab)
   */
  useEffect(() => {
    const tabs = document.querySelectorAll('.' + s.activeChats__tab);
    if (tabs) {
      tabs.forEach((tab, i) => {
        if (i !== tabs.length - 1) {
          const isPenultimate = i === tabs.length - 2; // skip penultimate tab margin-right transition, because of overflow bug

          setTimeout(() => tab.setAttribute('style', `
          transition-duration: ${((tabs.length) - i) * 0.15}s;
          transition-timing-function: ease-out;
          ${isPenultimate ? ' transition-property: width, transform;' : ' transition-property: width, transform, margin-right;'}
          `), 50);
        }
      });
    }
    return () => {
      tabs.forEach((tab) => {
        tab.removeAttribute('style');
      });
    };
  }, [activeChats.length]);


  return (
    <div className={s.activeChats + (activeChats.length === 0 ? ' d-none' : '')}>
      <div className={s.activeChats__chatsContainer}>
        {activeChats.map((chat) => (
          <Chat key={chat.id} chatId={chat.id} />
        ))}
      </div>
      <div className={s.activeChats__tabsContainer}
        {...activeChats.length > 1 && {
          onMouseEnter: () => dispatch(setExpandChats(true)),
          onMouseLeave: () => dispatch(setExpandChats(false))}
        }>
        {activeChats.map((chat) => (
          <Tab key={chat.id} chatId={chat.id} />
        ))}
      </div>
    </div>
  );
}

export default ChatsTabs;