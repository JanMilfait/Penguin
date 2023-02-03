import dynamic from 'next/dynamic';
import React from 'react';
import { PostVideo } from './postSlice.types';
import { PlayCircle } from 'react-bootstrap-icons';

const PostVideo = ({ name, url, poster, className }: PostVideo & { className?: string }) => {

  const ReactPlayer = dynamic(() => import('react-player/lazy'), { ssr: true });

  return (
    <div {...{className}} style={{ position: 'relative', paddingTop: '56.25%' }}>
      <ReactPlayer
        style={{ position: 'absolute', top: 0, left: 0 }}
        url={url + name}
        light={poster}
        controls={true}
        playing={true}
        width='100%'
        height='100%'
        playIcon={<PlayCircle size={64} className="svg-fill-primary" style={{ opacity: 0.8 }} />}
      />
    </div>
  );
};

export default PostVideo;