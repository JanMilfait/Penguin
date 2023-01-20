import dynamic from 'next/dynamic';
import React from 'react';
import { PostVideo } from './postSlice.types';
import { PlayCircle } from 'react-bootstrap-icons';

const PostVideo = ({ name, url, poster, className }: PostVideo & { className?: string }) => {

  const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: true });

  const preventJump = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.parentElement) {
      target.parentElement.style.height = target.parentElement.offsetHeight + 'px';
    }
  };

  return (
    <ReactPlayer
      {...{className}}
      url={url + name}
      light={poster}
      controls={true}
      playing={true}
      width='100%'
      height='100%'
      onClickPreview={(e) => preventJump(e)}
      playIcon={<PlayCircle size={64} className="svg-fill-primary" style={{ opacity: 0.8 }} />}
    />
  );
};

export default PostVideo;