import React, { useEffect } from 'react';
import s from 'styles/6_components/MobileChats.module.scss';
import ss from 'styles/6_components/Chats.module.scss';
import { ChatDotsFill } from 'react-bootstrap-icons';
import { AppDispatch, AppState } from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import { setExpandChats } from './chatSlice';

const ChatMobileButton = () => {
  const dispatch = useDispatch<AppDispatch>();
  const buttonRef = React.useRef<HTMLDivElement>(null);

  const closeTimeout = useSelector((state: AppState) => state.chat.animation.closeTimeout);
  const isExpanded = useSelector((state: AppState) => state.chat.expandChats);
  const virtualKeyboard = useSelector((state: AppState) => state.chat.virtualKeyboardHeight);
  const isTyping = isExpanded && virtualKeyboard;


  /**
   * Change height on Virtual Keyboard open/close
   */
  useEffect(() => {
    const container = buttonRef.current?.parentElement?.parentElement;
    const chatWindow = container?.querySelector('.' + s.mobileChats__window) as HTMLElement;
    if (!container || !chatWindow) return;

    if (isTyping) {
      container.style.bottom = '12px';
      chatWindow.style.height = 'calc(var(--visual100vh) - 24px)';
      buttonRef.current.style.display = 'none';
      document.body.style.overflow = 'hidden';

      const messages = chatWindow.querySelector('.' + ss.activeChats__messages) as HTMLElement;
      messages && messages.scrollTo(0, messages.scrollHeight + virtualKeyboard);
    } else {
      container.style.bottom = '95px';
      chatWindow.style.height = 'calc(var(--visual100vh) - 109px)';
      buttonRef.current.style.display = 'flex';
      document.body.style.overflow = 'auto';
    }
  }, [isTyping, virtualKeyboard]);


  const handleClick = (e: React.MouseEvent) => {
    if (isExpanded) {
      const chatWindow = (e.target as Element).closest('.' + s.mobileChats__container)?.querySelector('.' + s.mobileChats__window);
      chatWindow?.classList.add(s.mobileChats__windowScaleDown);

      setTimeout(() => {
        dispatch(setExpandChats(false));
      }, closeTimeout);
    } else {
      dispatch(setExpandChats(true));
    }
  };

  return (
    <div ref={buttonRef} className={s.mobileChats__button} onClick={handleClick}>
      <ChatDotsFill size={30} fill={'#fff'} />
    </div>
  );
};

export default ChatMobileButton;