import {useEffect } from 'react';
import {AppDispatch, AppState} from '../store';
import {setCloseLoader, setOpenLoader} from '../../features/root/rootSlice';
import {useDispatch, useSelector } from 'react-redux';

export const useLoader = (isLoading: boolean): [isOpenLoader: boolean] => {
  const dispatch = useDispatch<AppDispatch>();
  const isOpenLoader = useSelector((state: AppState) => state.root.loader.isOpen);

  useEffect(() => {
    if (isLoading) {
      dispatch(setOpenLoader());
    } else {
      isOpenLoader && dispatch(setCloseLoader());
    }
  }, [isLoading]);

  return [isOpenLoader];
};