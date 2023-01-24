import React, {useEffect, useRef, useState } from 'react';
import s from 'styles/6_components/NavModal.module.scss';
import ss from '../../styles/6_components/Notifications.module.scss';
import {AppDispatch, AppState} from '../../app/store';
import {useDispatch, useSelector } from 'react-redux';
import { useInfiniteScroll } from '../../app/hooks/useInfiniteScroll';
import { ModalNotification } from './notificationSlice.types';
import Notification from './Notification';
import {markOtherAsReaded, unreadedOtherNotifications, useMarkNotificationsAsReadedMutation} from './notificationSlice';
import debounce from 'lodash.debounce';

const ModalNotifications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const containerRef = useRef<HTMLDivElement>(null);
  const notificationsData = useSelector((state: AppState) => state.notification.otherNotifications);
  const unreadedOthers = useSelector((state: AppState) => unreadedOtherNotifications(state, false)) as Map<string, number|undefined>;

  const [notifications] = useInfiniteScroll(notificationsData, containerRef, 50);

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
      dispatch(markOtherAsReaded(id));
      setMarkReaded([...markReaded, id]);
    }
  };

  useEffect(() => {
    markReaded.length > 0 && debouncedRef.current(markReaded);
  }, [markReaded]);


  return (
    <div className={s.navModal}>
      <div ref={containerRef} className={ss.notifications}>
        {notifications.map((item: ModalNotification) => {
          const notificationId = unreadedOthers.get(`${item.source_id + item.source}`);
          return (
            <Notification
              key={item.id}
              {...item}
              unreaded={typeof notificationId === 'number'}
              onHover={typeof notificationId === 'number' ? () => markAsReaded(notificationId) : undefined}
            />
          );
        })}
        {notifications.length === 0 && <p className="f--medium d-flex justify-content-center align-items-center h-100 mb-0">No new notifications</p>}
      </div>
    </div>
  );
};

export default ModalNotifications;