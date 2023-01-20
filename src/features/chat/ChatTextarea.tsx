import React, { useEffect, useRef, useState } from 'react';
import s from 'styles/6_components/Chats.module.scss';
import { Chat } from './chatSlice.types';
import { Send, SendFill, FiletypeGif, CardImage, EmojiSunglasses } from 'react-bootstrap-icons';
import { isOpenedEmojiPicker, isOpenedGiphyPicker, toggleEmojiPicker, toggleGiphyPicker, useSendMessageMutation } from './chatSlice';
import {AppDispatch, AppState } from 'app/store';
import { useDispatch, useSelector } from 'react-redux';
import EmojiPickerReact from './EmojiPickerReact';
import GiphyPickerReact from './GiphyPickerReact';
import TextareaAutosize from 'react-textarea-autosize';

const ChatTextarea = ({chat}: {chat: Chat}) => {
  const dispatch = useDispatch<AppDispatch>();
  const textareaRef = useRef<HTMLTextAreaElement|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hoverSend, setHoverSend] = useState(false);
  const id = useSelector((state: AppState) => state.auth.data!.id);
  const isMobile = useSelector((state: AppState) => state.root.isMobile);

  const [sendMessage] = useSendMessageMutation();
  const isOpenedEmoji = useSelector((state: AppState) => isOpenedEmojiPicker(state, chat.id));
  const isOpenedGiphy = useSelector((state: AppState) => isOpenedGiphyPicker(state, chat.id));


  /**
   * Send Image On fileInput change
   */
  useEffect(() => {
    const handleFileInputChange = () => {
      if (!fileInputRef.current) return;
      const files = fileInputRef.current.files;
      if (!files) return;
      const file = files[0];
      if (!file) return;
      const formData = new FormData();
      formData.append('image', file);

      sendMessage({
        id: chat.id,
        userId: id,
        image: formData
      });
      fileInputRef.current.value = '';
    };
    fileInputRef.current?.addEventListener('change', handleFileInputChange);
    return () => {
      fileInputRef!.current?.removeEventListener('change', handleFileInputChange);
    };
  }, [fileInputRef]);


  /**
   * Prevent scroll on mobile if Emoji or Giphy is opened
   */
  useEffect(() => {
    if (!isMobile) return;

    if (isOpenedEmoji || isOpenedGiphy) {
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = 'auto';
    }
  }, [isOpenedEmoji, isOpenedGiphy]);


  const handleFocus = () => {
    if (isMobile) {
      isOpenedEmoji && dispatch(toggleEmojiPicker(chat.id));
      isOpenedGiphy && dispatch(toggleGiphyPicker(chat.id));
    }
  };

  const handleSendMessage = () => {
    if (!textareaRef.current || !textareaRef.current.value) return;

    sendMessage({
      id: chat.id,
      userId: id,
      body: textareaRef.current.value
    });
    textareaRef.current.value = '';
    textareaRef.current.focus();
    isOpenedEmoji && dispatch(toggleEmojiPicker(chat.id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  return (
    <div className={s.activeChats__textarea}>
      <div className="position-relative d-flex align-items-center">
        <TextareaAutosize
          ref={(el) => textareaRef.current = el}
          placeholder="Type a message..."
          onFocus={handleFocus}
          onKeyDown={(e) => handleKeyDown(e)}
          autoFocus={!isMobile}
        ></TextareaAutosize>
        <div className={s.activeChats__textareaSend}
          onMouseEnter={() => setHoverSend(true)}
          onMouseLeave={() => setHoverSend(false)}
          onClick={handleSendMessage}
        >
          {hoverSend ? <SendFill size={20} /> : <Send size={20} />}
        </div>
      </div>
      <div className={s.activeChats__textareaIcons} >
        <CardImage onClick={() => fileInputRef.current?.click()} />
        <FiletypeGif className={isOpenedGiphy ? 'svg-fill-primary' : ''} onClick={() => dispatch(toggleGiphyPicker(chat.id))} />
        <EmojiSunglasses className={isOpenedEmoji ? 'svg-fill-primary' : ''} onClick={()=>dispatch(toggleEmojiPicker(chat.id))} />
      </div>
      <input ref={fileInputRef} className="d-none" type="file" accept="image/*" />
      {isOpenedEmoji && <EmojiPickerReact textarea={textareaRef} />}
      {isOpenedGiphy && <GiphyPickerReact userId={id} chatId={chat.id} />}
    </div>
  );
};

export default ChatTextarea;