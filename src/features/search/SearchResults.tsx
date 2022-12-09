import {AppDispatch, AppState} from 'app/store';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/SearchBar.module.scss';
import {setPage, setDebounced, useLazyFetchSearchQuery} from './searchSlice';
import debounce from 'lodash.debounce';
import { ArrowRightCircle, ArrowLeftCircle } from 'react-bootstrap-icons';
import SearchUser from './SearchUser';
import SearchPost from './SearchPost';
import SearchNothingFound from './SearchNothingFound';
import DotLoaderSpin from '../../components/DotLoaderSpin';
import usePerfectScrollbar from '../../app/hooks/usePerfectScrollbar';


const SearchResults = () => {
  // PerfectScrollbar
  const modalRef = useRef<HTMLDivElement>(null);
  const { updateScroll } = usePerfectScrollbar(modalRef);

  const dispatch = useDispatch<AppDispatch>();
  const text = useSelector((state: AppState) => state.search.text);
  const debounced = useSelector((state: AppState) => state.search.debounced);
  const page = useSelector((state: AppState) => state.search.page);
  const [trigger, { data, isError, isFetching, isSuccess }] = useLazyFetchSearchQuery();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(debounce(async (text, page) => {
    await trigger({text: text, page: page}, true);
    dispatch(setDebounced(true));
  }, 500), []);

  /**
   *  Debounce if the user is typing else immediately search
   */
  useEffect(() => {
    (async () => {
      !debounced
        ? await debouncedSearch(text, page)
        : await trigger({text: text, page: page}, true);

      updateScroll(true);
    })();
  }, [text, page]);


  const handleSetPage = (e: React.MouseEvent<Element, MouseEvent>, page: number) => {
    if (!isSuccess || isFetching) return;
    e.stopPropagation();
    dispatch(setPage(page));
  };


  if (!data) {
    return (
      <div ref={modalRef} className={s.searchBar__modal}>
        <div className="row m-0">
          <div className="col-12 p-5">
            <div className="d-flex align-items-center justify-content-center h-100 p-5">
              <DotLoaderSpin />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={modalRef} className={s.searchBar__modal}>
      {data.items.length !== 0 && data.last_page !== 1 &&
        <div className={s.searchBar__pages}>
          {page !== 1 && page === data.last_page && <a onClick={(e) => handleSetPage(e, -1)}>Go back <ArrowLeftCircle/></a>}
          {page > 1 && page < data.last_page && <a onClick={(e) => handleSetPage(e, -1)}><ArrowLeftCircle/></a>}
          {page !== data.last_page && <a onClick={(e) => handleSetPage(e, +1)}><ArrowRightCircle/> Show more</a>}
        </div>
      }
      { data.items.length === 0 || isError
        ? <SearchNothingFound />
        : (
          <ul className="d-flex flex-column">
            { data.items.map((result) => (
              'name' in result
                ? <SearchUser key={result.id} user={result}/>
                : <SearchPost key={result.id} post={result}/>
            ))}
          </ul>
        )}
    </div>
  );
};

export default SearchResults;