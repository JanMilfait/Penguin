import { useCallback, useEffect, useRef, useState } from 'react';
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
    limit = 20
  }: UseLazeyInfiniteDataProps<T, N>) => {
  const dispatch = useDispatch<any>();
  const [pageNumber, setPageNumber] = useState(0);
  const [combinedData, setCombinedData] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [prependData, setPrependData] = useState(false);
  const [disabled, setDisabled] = useState(1000);
  const [forceSync, setForceSync] = useState(0);
  const lastInits = useRef<any[]>([]);

  const apiEndpoint: ApiEndpointQuery<any, any> & QueryHooks<any> =
    api.endpoints[apiEndpointName];

  const reset = useCallback(() => {
    setDisabled(1000);
    setPageNumber(0);
  }, []);

  const hardReset = useCallback(() => {
    setDisabled(1000);
    setPageNumber(0);
    lastInits.current.shift();
    return Promise.all(
      lastInits.current.map((init) => {
        return init.unsubscribe();
      })
    );
  }, [lastInits]);


  /** when args change like changing filters in the args then we reset the loading pages to 1 */
  useEffect(() => {
    reset();
    setForceSync(inc);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, Object.values(apiArgs));

  useEffect(() => {
    setIsFetching(true);
    const inits = [] as any[];

    const pages = pageNumber >= disabled
      ? range(0, disabled + 1)
      : range(0, pageNumber + 1);

    const promises = pages.map((page: number) => {
      page = page + 1;
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
    lastInits.current = inits;

    Promise.all(promises)
      .then((data: any) => {
        if (pageNumber < disabled) {
          if (data[data.length - 1]?.items.length === 0) {
            setDisabled(pageNumber);
          }
        }
        if (prependData) {
          data = data.reverse();
        }
        const items = chain(propOr([], 'items'), data);

        setCombinedData(items as any);
      })
      .catch(console.error)
      .finally(() => {
        setIsFetching(false);
      });

    return () => {
      inits.forEach((init: any) => init.unsubscribe());
    };
  }, [pageNumber, prependData, disabled, forceSync]);


  const syncDataAndCache = useCallback(() => {
    setForceSync(inc);
  }, []);

  /** increasing pageNumber will make the useEffect run */
  const loadMore = useCallback((prepend = false) => {
    if (prepend && !prependData) {
      setPrependData(true);
    }
    setPageNumber(inc);
  }, [prependData]);

  return {
    combinedData,
    loadMore,
    syncDataAndCache,
    isFetching,
    hardReset
  };
};

export default useLazyInfiniteData;