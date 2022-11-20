import { EmojiClickData } from 'emoji-picker-react';
import dynamic from 'next/dynamic';
import React from 'react';
import s from '../../styles/6_components/Chats.module.scss';

const EmojiPickerReact = ({textarea}: {textarea: React.RefObject<HTMLTextAreaElement>}) => {

  const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

  const handleEmojiClick = (data: EmojiClickData) => {
    if (!textarea.current) return;
    textarea.current.value += data.emoji;
    textarea.current.focus();
  };

  return (
    <div className={s.activeChats__emojiPicker}>
      <EmojiPicker
        width="100%"
        height={380}
        previewConfig={{showPreview: false}}
        skinTonesDisabled
        onEmojiClick={(emojiData) => handleEmojiClick(emojiData)}
      />
    </div>
  );
};

export default React.memo(EmojiPickerReact);