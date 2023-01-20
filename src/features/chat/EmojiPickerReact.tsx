import { EmojiClickData } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import React from 'react';
import s from '../../styles/6_components/Chats.module.scss';
import {AppState} from '../../app/store';
import { useSelector } from 'react-redux';

const EmojiPickerReact = ({textarea}: {textarea: React.RefObject<HTMLTextAreaElement>}) => {
  const isMobile = useSelector((state: AppState) => state.root.isMobile);

  const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

  const handleEmojiClick = (data: EmojiClickData) => {
    if (!textarea.current) return;
    textarea.current.value += data.emoji;
    !isMobile && textarea.current.focus();
  };

  return (
    <div className={s.activeChats__emojiPicker}>
      <EmojiPicker
        width="100%"
        height={380}
        previewConfig={{showPreview: false}}
        skinTonesDisabled
        onEmojiClick={(emojiData) => handleEmojiClick(emojiData)}
        autoFocusSearch={!isMobile}
      />
    </div>
  );
};

export default React.memo(EmojiPickerReact);