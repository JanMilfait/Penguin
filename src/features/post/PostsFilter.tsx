import React from 'react';
import s from 'styles/6_components/Posts.module.scss';
import ToggleModal from '../../components/ToggleModal';
import MediaDropdown from './MediaDropdown';
import {AppDispatch, AppState} from '../../app/store';
import {useDispatch, useSelector } from 'react-redux';
import { CaretLeftFill } from 'react-bootstrap-icons';
import { setFilter } from './postSlice';
import RangeSlider from 'components/RangeSlider';

const PostsFilter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const category = useSelector((state: AppState) => state.post.filter.category);
  const trendingDays = useSelector((state: AppState) => state.post.filter.trendingDays);
  const media = useSelector((state: AppState) => state.post.filter.media);

  return (
    <div className={s.posts__filter}>
      <div className="row justify-content-between align-items-center">
        <div className="col pt-2 pb-2 overflow-auto">
          <ul className={s.posts__category}>
            <li onClick={() => dispatch(setFilter({category: 'latest'}))} className={category === 'latest' ? s.posts__categoryActive : ''}><p className="f--medium">Latest</p></li>
            <li onClick={() => dispatch(setFilter({category: 'trending'}))} className={category === 'trending' ? s.posts__categoryActive : ''}><p className="f--medium">Trending</p></li>
            {<div className={category === 'trending' ? '' : 'd-none'}>
              <div className={s.posts__trendingDays}>
                <p className="f--small">{trendingDays}</p>
                <RangeSlider width={100} min={1} max={30} starting={7} onRelease={(val) => dispatch(setFilter({trendingDays: val}))} />
              </div>
            </div>}
            <li onClick={() => dispatch(setFilter({category: 'shared'}))} className={category === 'shared' ? s.posts__categoryActive : ''}><p className="f--medium">Shared</p></li>
          </ul>
        </div>
        <div className="col-auto pt-2 pb-2">
          <ToggleModal
            toggle={<div className={s.posts__filterMedia + ' rotate-90'}><p className="f--medium">{media}</p><CaretLeftFill /></div>}
            modal={<MediaDropdown />}
            clickClose={true}
          />
        </div>
      </div>
    </div>
  );
};

export default PostsFilter;