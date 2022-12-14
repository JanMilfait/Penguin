import { AppDispatch, AppState } from 'app/store';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/Dropdown.module.scss';
import { setFilter } from './postSlice';

const MediaDropdown = () => {
  const dispatch = useDispatch<AppDispatch>();
  const media = useSelector((state: AppState) => state.post.filter.media);

  return (
    <ul className={s.dropdown}>
      <li onClick={() => dispatch(setFilter({media: 'all'}))}><a className={media === 'all' ? s.dropdown__active : ''}>All</a></li>
      <li onClick={() => dispatch(setFilter({media: 'photo'}))}><a className={media === 'photo' ? s.dropdown__active : ''}>Photo</a></li>
      <li onClick={() => dispatch(setFilter({media: 'video'}))}><a className={media === 'video' ? s.dropdown__active : ''}>Video</a></li>
    </ul>
  );
};

export default MediaDropdown;