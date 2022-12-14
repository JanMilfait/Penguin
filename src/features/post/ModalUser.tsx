import React from 'react';
import Avatar from '../../components/Avatar';
import Emoji from '../../components/Emoji';
import {User} from '../auth/authSlice.types';
import {AppState} from '../../app/store';
import {useGetFriendsIdsQuery} from '../friend/friendSlice';
import { useSelector } from 'react-redux';

type ModalUserProps = {
  id: number,
  type: 'reactions'|'sharing',
  user: User,
  reaction?: number,
  created_at?: string,
}
// TODO: ADD FRIEND
const ModalUser = ({id: reactionId, reaction, type, user, created_at}: ModalUserProps) => {

  const id = useSelector((state: AppState) => state.auth.data!.id);
  const {data: friendsIds} = useGetFriendsIdsQuery({id});

  return (
    <div className="row mt-3 mb-3" key={reactionId}>
      <div className="col-auto position-relative">
        <Avatar {...user} size={50} />
        {type === 'reactions' ? <div className="position-absolute bottom-0 end-0"><Emoji id={reaction} size={20} /></div> : null}
      </div>
      <div className="col d-flex align-items-center mw-0">
        {type === 'reactions'
          ? <h3 className="f--small mb-0 text-truncate">{user.name}</h3>
          : <>
            <div className="d-flex flex-column">
              <h3 className="f--small mb-0 text-truncate">{user.name}</h3>
              <p className="f--xx-small mb-0 text-truncate">{created_at}</p>
            </div>
          </>
        }
      </div>
      {user.id !== id && !friendsIds?.ids.includes(user.id) ? <div className="col-auto d-flex align-items-center"><button className="button button--small">Add Friend</button></div> : null}
    </div>
  );
};

export default React.memo(ModalUser);