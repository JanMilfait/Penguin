import React, { useEffect } from 'react';
import { PostImage } from './postSlice.types';

const PostImage = ({ name, url, small = false, className }:  PostImage & { small?: boolean } & { className?: string }) => {

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
    <div>
      {
        !isGif
          ? imgLoaded
            ? <img {...{ className }} src={url + (small ? '700_' : '') + name} loading="lazy" />
            : <img {...{ className }} src={imgPlaceholder}  loading="lazy" />
          : <img {...{ className }} src={url + name} loading="lazy" />
      }
    </div>
  );
};

export default PostImage;