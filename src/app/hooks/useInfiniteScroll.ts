import { UseQuery } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { useState, useEffect, useCallback, useMemo } from 'react';

const calculateMaxPages = (total: number, limit: number) => {
  return Math.ceil(total / limit);
};

export const isValidNotEmptyArray = (array: any[]): boolean => {
  return !!(array && array?.length && array?.length > 0);
};

export interface IListQueryResponse {
  items: any[];
  total: number;
  page: number;
  limit: number;
}

const useInfiniteScroll = (useGetDataListQuery: UseQuery<any>, { limit = 10, ...queryParameters }) => {
  const [loadPrepend, setLoadPrepend] = useState(false);
  const [localPage, setLocalPage] = useState(1);
  const [combinedData, setCombinedData] = useState<any>([]);

  const queryResponse = useGetDataListQuery({
    ...queryParameters,
    limit,
    page: localPage
  });
  const {
    items: fetchData = [],
    page: remotePage = 1,
    total: remoteTotal = 0,
    limit: remoteLimit = 10
  } = queryResponse?.data as IListQueryResponse || {};

  useEffect(() => {
    if (isValidNotEmptyArray(fetchData)) {
      if (localPage === 1) setCombinedData(fetchData);
      else if (localPage === remotePage) {
        loadPrepend
          ? setCombinedData((previousData: any[]) => [...fetchData, ...previousData])
          : setCombinedData((previousData: any[]) => [...previousData, ...fetchData]);
      }
    }
  }, [fetchData]);

  const maxPages = useMemo<number>(() => {
    return calculateMaxPages(remoteTotal, remoteLimit);
  }, [remoteTotal, remoteLimit]);

  const refresh = useCallback(() => {
    setLocalPage(1);
  }, []);

  const loadMore = (prepend = false) => {
    if (prepend && !loadPrepend) setLoadPrepend(true);

    if (localPage < maxPages && localPage === remotePage) {
      setLocalPage((page) => page + 1);
    }
  };

  return { combinedData, localPage, loadMore, refresh, isLoading: queryResponse?.isLoading, isFetching: queryResponse?.isFetching };
};

export default useInfiniteScroll;