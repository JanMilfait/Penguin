import React from 'react';
import { useSelector } from 'react-redux';
import {AppState} from '../../app/store';
import {PostSharing} from './postSlice.types';
import s from '../../styles/6_components/ModalReactionsSharing.module.scss';
import {useInfiniteScroll} from '../../app/hooks/useInfiniteScroll';
import ModalUser from './ModalUser';

const ModalSharing = () => {
  const sharing = useSelector((state: AppState) => state.root.modal.request!.data.sharings) as PostSharing[];

  const usersRef = React.useRef<HTMLDivElement>(null);
  const [items] = useInfiniteScroll(sharing, usersRef, 50);

  return (
    <div className={s.modalReactionsSharing}>
      <div className="row">
        <div className="col">
          <div ref={usersRef} className={s.modalReactionsSharing__users}>
            {items.map((sharing: PostSharing) =>
              <ModalUser
                key={sharing.id}
                type={'sharing'}
                id={sharing.id}
                user={sharing.user}
                created_at={sharing.created_at}
              />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalSharing;