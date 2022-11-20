import dynamic from 'next/dynamic';
import React from 'react';

const GiphyPickerReact = (props: {userId: number, chatId: number}) => {
  const GiphyPicker = dynamic(() => import('./GiphyPicker'), { ssr: false });

  return <GiphyPicker {...props} />;
};

export default React.memo(GiphyPickerReact);