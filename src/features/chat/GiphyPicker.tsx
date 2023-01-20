import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import React, {SyntheticEvent, useState } from 'react';
import ResizeObserver from 'react-resize-observer';
import s from '../../styles/6_components/Chats.module.scss';
import { Search } from 'react-bootstrap-icons';
import { IGif } from '@giphy/js-types';
import { AppDispatch, AppState } from 'app/store';
import { useDispatch, useSelector } from 'react-redux';
import {toggleGiphyPicker, useSendMessageMutation} from './chatSlice';

const giphyFetch = new GiphyFetch(process.env.NEXT_PUBLIC_GIPHY_API_KEY!);

const GiphyPicker = ({userId, chatId}: {userId: number, chatId: number}) => {
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useSelector((state: AppState) => state.root.isMobile);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState('');
  const [width, setWidth] = useState(window.innerWidth);

  const [sendMessage] = useSendMessageMutation();

  const fetchGifs = (offset: number) => {
    if (search) {
      return giphyFetch.search(search, { offset, limit: 10 });
    } else {
      return giphyFetch.trending({ offset, limit: 10 });
    }
  };

  const handleGifClick = async (gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => {
    e.preventDefault();
    const gifUrl = gif.images.original.url;
    dispatch(toggleGiphyPicker(chatId));

    fetch(gifUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const formData = new FormData();
        const file = new File([blob], 'gif.gif', { type: 'image/gif' });
        formData.append('image', file);
        sendMessage({
          id: chatId,
          userId: userId,
          image: formData
        });
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className={s.activeChats__giphyPicker}>
      <div className={s.activeChats__giphySearch}>
        <Search />
        <input placeholder="Search" onChange={(e) => setSearch(e.target.value)} autoFocus={!isMobile} />
      </div>
      <div className={s.activeChats__giphyContent}>
        <div className={s.activeChats__giphyInner}>
          <Grid
            onGifClick={handleGifClick}
            fetchGifs={fetchGifs}
            width={width}
            columns={2}
            gutter={6}
            hideAttribution={true}
            key={search}
          />
          <ResizeObserver onResize={({ width }) => setWidth((width) - 14)}/>
        </div>
      </div>
    </div>
  );
};

export default GiphyPicker;