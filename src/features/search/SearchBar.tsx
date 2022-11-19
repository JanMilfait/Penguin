import React, {useRef, useEffect} from 'react';
import s from 'styles/6_components/SearchBar.module.scss';
import { Search } from 'react-bootstrap-icons';
import SearchResults from './SearchResults';
import { useDispatch, useSelector } from 'react-redux';
import { setSearch } from './searchSlice';
import { AppState } from 'app/store';

const SearchBar = () => {
  const dispatch = useDispatch();
  const search = useSelector((state: AppState) => state.search.text);

  const containerRef = useRef<HTMLDivElement>(null),
    inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const handleClickOutside = (e: Event) => {
      if (search && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        dispatch(setSearch(''));
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [search, dispatch]);


  return (
    <div ref={containerRef} className={s.searchBar}>
      <Search className={s.searchBar__icon} onClick={() => inputRef.current?.focus()} />
      <input ref={inputRef} placeholder="Search" onChange={(e) => dispatch(setSearch(e.target.value))} onFocus={(e) => dispatch(setSearch(e.target.value))} />
      {search && <SearchResults />}
    </div>
  );
};

export default SearchBar;