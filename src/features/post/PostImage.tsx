import React, {CSSProperties, useEffect } from 'react';
import { PostImage } from './postSlice.types';

const PostImage = ({ name, url, small = false, className, style }:  PostImage & { small?: boolean, className?: string, style?: CSSProperties }) => {

  const isGif = name?.endsWith('.gif');
  const imgPlaceholder = url?.replace(/\/storage\/posts\/images\//, '/storage/posts/images/placeholder/') + '700_' + name || '';
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

  if (!name) return null;

  return (
    <>
      {
        !isGif
          ? imgLoaded
            ? <img {...{ className, style }} src={url + (small ? '700_' : '') + name} loading="lazy" />
            : <img {...{ className, style }} src={imgPlaceholder}  loading="lazy" />
          : <img {...{ className, style }} src={url + name} loading="lazy" />
      }
    </>
  );
};

export default PostImage;