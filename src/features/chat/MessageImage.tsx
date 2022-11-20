import React, { useEffect } from 'react';
import {Message} from './chatSlice.types';
import s from 'styles/6_components/Chats.module.scss';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const MessageImage = ({img}: {img: Message['image_url']}) => {
  const isGif = img?.endsWith('.gif');
  const imgPlaceholder = img?.replace(/\/chat\/images\//, '/chat/images/placeholder/') || '';
  const [imgLoaded, setImgLoaded] = React.useState(false);

  /**
   * Show placeholder image until full image is loaded
   * ignore if gif (gif download first frame immediately)
   */
  useEffect(() => {
    if (!isGif) {
      const img = new Image();
      img.src = imgPlaceholder;
      img.onload = () => setImgLoaded(true);
    }
  }, []);

  if (!img) return null;

  return (
    <Zoom>
      {
        !isGif
          ? imgLoaded
            ? <img className={s.activeChats__messageImg} src={img} loading="lazy" />
            : <img className={s.activeChats__messageImg + ' imgScrollDown'} src={imgPlaceholder}  loading="lazy" />
          : <img className={s.activeChats__messageImg + ' imgScrollDown'} src={img} loading="lazy" />
      }
    </Zoom>
  );
};

export default MessageImage;