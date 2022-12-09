import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import range from 'ramda/es/range';
import chain from 'ramda/es/chain';
import propOr from 'ramda/es/propOr';
import inc from 'ramda/es/inc';
import { ApiEndpointQuery } from '@reduxjs/toolkit/dist/query/core/module';
import { QueryHooks } from '@reduxjs/toolkit/dist/query/react/buildHooks';

interface UseLazeyInfiniteDataProps<T, N> {
  api: T;
  /** any rtk-query api: passing the whole enpoint so we have access to api utils to invalidate provided tags */
  apiEndpointName: N;
  /** apiEndpoint name to retrieve correct apiEndpoint query which will have 'initiate' and 'useQuery' */
  apiArgs: { [key: string]: any; };
  /** apiArgs are the query arguments it should have a params objec */
  limit?: number;
  /** limit or page-size per request (defaults 20) */
  invalidatesTags?: any[];
}
/**
 * This hook is for having infinite loading experience with caching posibility of rtk-query
 * it's storing the data comming from rtk-q to local useState throgh a useEffect hook
 * in orther to make it work when invalidating tags it makes the first page request through rtk-query hook
 * and whenever it changes it will refetch the rest data
 */
const useLazyInfiniteData = <
  T extends { endpoints: any; util: any },
  N extends keyof T['endpoints'],
>({
    api,
    apiEndpointName,
    apiArgs,
    limit = 20,
    invalidatesTags
  }: UseLazeyInfiniteDataProps<T, N>) => {
  const dispatch = useDispatch<any>();
  const [pageNumber, setPageNumber] = useState(1); // first load only page 1
  const [maxPage, setMaxPage] = useState(0); // we don't know how many pages could exists yet
  const [accData, setAccData] = useState<any[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [prependData, setPrependData] = useState(false);

  const apiEndpoint: ApiEndpointQuery<any, any> & QueryHooks<any> =
    api.endpoints[apiEndpointName];
  // we need this extra hook to automate refetching when invalidating tag
  // this will make the useEffect rerender if the first page data changes
  const {
    currentData: firstPageData,
    isLoading,
    isFetching,
    refetch: refetch_
  } = apiEndpoint.useQuery({
    ...apiArgs,
    page: 1,
    limit
  });

  const refetch = useCallback(() => {
    if (invalidatesTags) {
      dispatch(api.util.invalidateTags());
    }
    refetch_();
  }, [api.util, dispatch, invalidatesTags, refetch_]);

  /** when params change like changing filters in the params then we reset the loading pages to 1 */
  useEffect(
    function resetPageLoadDataForSinglePage() {
      setPageNumber(1);
    },
    [apiArgs.params]
  );

  useEffect(
    function loadMoreDataOnPageNumberIncrease() {
      if (firstPageData)
        setMaxPage(Math.ceil((firstPageData as any).total / limit));

      if (pageNumber === 1) {
        setAccData((firstPageData as any)?.items ?? []);
      }
      if (pageNumber > 1) {
        setIsFetchingMore(true);

        const inits = [] as any[];
        const promises = range(1, pageNumber + 1).map((page: any) => {
          const init = dispatch(
            apiEndpoint.initiate({
              ...apiArgs,
              page,
              limit
            }),
          );
          inits.push(init);
          return init.unwrap();
        });
        inits[0].unsubscribe();

        Promise.all(promises)
          .then((data: any) => {
            data = data.filter((d: any) => d !== firstPageData);
            let items;

            if (prependData) {
              data = data.reverse();
              items = chain(propOr([], 'items'), [
                ...data,
                firstPageData
              ]);
            } else {
              items = chain(propOr([], 'items'), [
                firstPageData,
                ...data
              ]);
            }
            setAccData(items);
          })
          .catch(console.error)
          .finally(() => {
            setIsFetchingMore(false);
          });

        return () => {
          inits.forEach((init: any) => init.unsubscribe());
        };
      }
    },
    [firstPageData, pageNumber, prependData]
  );

  /** increasing pageNumber will make the useEffect run */
  const loadMore = useCallback((prepend = false) => {
    if (prepend && !prependData) {
      setPrependData(true);
    }
    setPageNumber(inc);
  }, [prependData]);

  return {
    combinedData: accData,
    loadMore,
    hasMore: pageNumber < maxPage,
    isLoading,
    isFetching,
    isFetchingMore,
    refetch
  };
};

export default useLazyInfiniteData;