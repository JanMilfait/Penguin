import { AppState } from 'app/store';
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/SearchBar.module.scss';
import {setPage, SearchApi, setDebounced} from './searchSlice';
import debounce from 'lodash.debounce';
import { ArrowRightCircle, ArrowLeftCircle } from 'react-bootstrap-icons';
import SearchUser from './SearchUser';
import SearchPost from './SearchPost';
import SearchNothingFound from './SearchNothingFound';
import DotLoaderSpin from '../../components/DotLoaderSpin';


const SearchResults = () => {
  const dispatch = useDispatch();
  const { text, page, debounced } = useSelector((state: AppState) => state.search);
  const [trigger, result] = SearchApi.endpoints.fetchSearch.useLazyQuery();
  const { data, isError, error } = result;


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(async (text, page) => {
    await trigger({text: text, page: page}, true);
    dispatch(setDebounced(true));
  }, 500), []);

  /**
   *  Debounce if the user is typing else immediately search
   */
  useEffect(() => {
    !debounced
      ? debouncedSearch(text, page)
      : trigger({text: text, page: page}, true);
  }, [text, page, debouncedSearch, trigger, debounced]);


  const handleSetPage = (e: React.MouseEvent<Element, MouseEvent>, page: number) => {
    e.stopPropagation();
    dispatch(setPage(page));
  };


  /**
   * Modal content
   */
  const content = () => {
    if (isError) {
      console.error(error);
      return <SearchNothingFound />;
    }

    if (!data) {
      return (
        <div className="row m-0">
          <div className="col-12 p-5">
            <div className="d-flex align-items-center justify-content-center h-100 p-5">
              <DotLoaderSpin />
            </div>
          </div>
        </div>
      );
    }

    if (page > 0 && data.ids.length === 0) {
      return (
        <>
          <div className={s.searchBar__pages}>
            { page !== 0 && <a onClick={() => dispatch(setPage(-1))} >Go back <ArrowLeftCircle /></a> }
          </div>
          <SearchNothingFound />
        </>
      );
    }

    if (data.ids.length === 0) {
      return <SearchNothingFound />;
    }

    return (
      <>
        <div className={s.searchBar__pages}>
          { page > 0 && <a onClick={(e) => handleSetPage(e, -1)} ><ArrowLeftCircle /></a> }
          <a onClick={(e) => handleSetPage(e, +1)} ><ArrowRightCircle /> Search more</a>
        </div>
        <ul className="d-flex flex-column">
          {data.entities.map((result) => (
            'name' in result
              ? <SearchUser key={result.id} user={result} />
              : <SearchPost key={result.id} post={result} />
          ))}
        </ul>
      </>
    );
  };

  /**
   * Modal container
   */
  return (
    <div className={s.searchBar__modal}>
      {content()}
    </div>
  );
};

export default SearchResults;