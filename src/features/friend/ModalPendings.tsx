import React, {useEffect, useMemo, useRef, useState } from 'react';
import {useDispatch, useSelector } from 'react-redux';
import s from 'styles/6_components/NavModal.module.scss';
import ss from 'styles/6_components/Pendings.module.scss';
import {useGetReceivedPendingsQuery, useGetSendPendingsQuery} from './friendSlice';
import {AppDispatch, AppState} from '../../app/store';
import {ReceivedPending, ReceivedPendingsResult, SendPending, SendPendingsResult} from './friendSlice.types';
import {useInfiniteScroll} from '../../app/hooks/useInfiniteScroll';
import Pending from './Pending';
import {markPendingAsReaded, unreadedPendingNotifications, useMarkNotificationsAsReadedMutation} from '../notification/notificationSlice';
import debounce from 'lodash/debounce';

const ModalPendings = () => {
  const dispatch = useDispatch<AppDispatch>();
  const containerRef = useRef<HTMLDivElement>(null);
  const id = useSelector((state: AppState) => state.auth.data?.id);
  const unreadedPendings = useSelector((state: AppState) => unreadedPendingNotifications(state, false)) as Map<string, number|undefined>;
  const [data1, setData1] = useState<SendPendingsResult>([]);
  const [data2, setData2] = useState<ReceivedPendingsResult>([]);

  /**
   * It's better to sort data on client, because same queries are used in other components (cache)
   */
  const {data: sendPendings} = useGetSendPendingsQuery(undefined, {skip: typeof id !== 'number'});
  const {data: receivedPendings} = useGetReceivedPendingsQuery(undefined, {skip: typeof id !== 'number'});

  useEffect(() => {
    sendPendings && setData1(sendPendings);
    receivedPendings && setData2(receivedPendings);
  }, [sendPendings, receivedPendings]);

  const sortedPendings = useMemo(() => {
    const combinedData = [...data1, ...data2];
    return combinedData.sort((a, b) => {
      const aDate = new Date(a.updated_at_original);
      const bDate = new Date(b.updated_at_original);
      return bDate.getTime() - aDate.getTime();
    });
  }, [data1, data2]);

  const [pendings] = useInfiniteScroll(sortedPendings, containerRef, 50);

  //****************************
  // Mark as readed
  //****************************

  const debounceTime = useSelector((state: AppState) => state.notification.debounceTime);
  const [markNotificationsAsReaded] = useMarkNotificationsAsReadedMutation();
  const [markReaded, setMarkReaded] = useState<number[]>([]);
  const debouncedRef = useRef(debounce((markReaded) => {
    markNotificationsAsReaded({ids: markReaded});
    setMarkReaded([]);
  }, debounceTime));

  const markAsReaded = (id: number) => {
    if (!markReaded.includes(id)) {
      dispatch(markPendingAsReaded(id));
      setMarkReaded([...markReaded, id]);
    }
  };

  useEffect(() => {
    markReaded.length > 0 && debouncedRef.current(markReaded);
  }, [markReaded]);


  return (
    <div className={s.navModal}>
      <div ref={containerRef} className={ss.pendings}>
        {pendings.map((item: SendPending|ReceivedPending) => {
          const notificationId = unreadedPendings.get(`${item.id + 'pending'}`);
          return (
            <Pending
              key={item.id}
              id={item.id}
              type={'user' in item ? 'received' : 'send'}
              user={'user' in item ? item.user : item.pending}
              state={item.state}
              updated_at={item.updated_at}
              unreaded={typeof notificationId === 'number'}
              onHover={typeof notificationId === 'number' ? () => markAsReaded(notificationId) : undefined}
            />
          );
        })}
        {pendings.length === 0 && <p className="f--medium d-flex justify-content-center align-items-center h-100 mb-0">No pendings yet</p>}
      </div>
    </div>
  );
};

export default ModalPendings;