import React from 'react';
import s from 'styles/6_components/Notifications.module.scss';
import ss from '../../styles/6_components/Navigation.module.scss';
import {ModalNotification} from './notificationSlice.types';
import {activateChat} from '../chat/chatSlice';
import Avatar from '../../components/Avatar';
import Link from 'next/link';
import { AppDispatch } from 'app/store';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';


const Notification = ({source, source_id, source_data, created_at, unreaded, onHover}: ModalNotification & {unreaded: boolean, onHover?: () => void}) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const data = JSON.parse(source_data);

  const action = {
    chat: activateChat({chatId: source_id}),
    post: '',
    comment: '',
    reply: '',
    sharing: ''
  };

  const href = {
    chat: '',
    post: data.path,
    comment: data.path,
    reply: data.path,
    sharing: data.path
  };

  const text = {
    chat: <><span className="fw-bold">{data.name}</span> {data.state === 'removed' ? 'left' : 'was added to'} the chat <span className="fw-bold">{data.names && data.names.join(', ')}</span></>,
    post: <><span className="fw-bold">{data.name}</span> created a new post <span className="fw-bold">{data.preview}</span></>,
    comment: <><span className="fw-bold">{data.name}</span> commented on your post <span className="fw-bold">{data.preview}</span></>,
    reply: <><span className="fw-bold">{data.name}</span> replied to your comment <span className="fw-bold">{data.preview}</span></>,
    sharing: <><span className="fw-bold">{data.name}</span> shared your post <span className="fw-bold">{data.preview}</span></>
  };

  const handleClick = () => {
    if (action[source] !== '') {
      dispatch(action[source] as any);
    }
    if (href[source]) {
      router.push(href[source]);
    }
  };

  return (
    <div
      className={s.notifications__notification}
      onPointerEnter={onHover}
    >
      <div className="row h-100" onClick={handleClick}>
        <div className="col-auto">
          <Link href={'/user/' + data.id}>
            <Avatar id={data.id} avatar={data.avatar} size={40} />
          </Link>
        </div>
        <div className="col d-flex flex-column justify-content-center mw-0">
          <h3 className="f--x-small mb-0">{text[source]}</h3>
          <h3 className="f--xx-small opacity-50 mb-0">{created_at}</h3>
        </div>
      </div>
      {unreaded && <div className={ss.navigation__unreaded + ' ' + ss.navigation__unreadedCloser}></div>}
    </div>
  );
};

export default Notification;