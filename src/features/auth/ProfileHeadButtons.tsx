import React, { useState } from 'react';
import LinkCallback from '../../components/LinkCallback';
import {dispatchSSR} from '../../app/helpers/helpers';
import Link from 'next/link';
import {activateChat} from '../chat/chatSlice';
import { PencilFill, ChatFill, PersonPlusFill, PersonCheckFill, SendCheckFill, PersonXFill, EyeFill } from 'react-bootstrap-icons';
import {AppDispatch, AppState} from '../../app/store';
import { useDispatch, useSelector } from 'react-redux';
import {setProfile, useGetUserQuery} from './authSlice';
import {useAddFriendMutation, useDeleteFriendMutation, useGetFriendsIdsQuery, useGetSendPendingsQuery} from '../friend/friendSlice';


const ProfileHeadButtons = () => {
  const dispatch = useDispatch<AppDispatch>();
  const id = useSelector((state: AppState) => state.auth.data?.id);
  const userId = useSelector((state: AppState) => state.auth.profile.id);
  const editId = useSelector((state: AppState) => state.auth.profile.edit);
  const url = useSelector((state: AppState) => state.root.routerPath);

  const isAuth = typeof id === 'number';
  const isInfo = url === '/profile/' + userId + '/info';
  const isEditing = editId === id;

  const [isFriendHover, setIsFriendHover] = useState(false);
  const { data: user, isSuccess, isLoading } = useGetUserQuery({id: userId!}, {skip: typeof userId !== 'number'});
  const { data: friends, isSuccess: isSuccessF } = useGetFriendsIdsQuery({id: id!}, {skip: !isAuth});
  const { data: friendsPending } = useGetSendPendingsQuery(undefined, {skip: !isAuth});
  const [addFriend] = useAddFriendMutation();
  const [deleteFriend] = useDeleteFriendMutation();

  if (isLoading || !isSuccess) return null;

  return (
    <div className="row justify-content-start justify-content-md-end">
      <div className="col-auto d-flex flex-wrap" style={{marginRight: '-0.5rem'}}>
        {isAuth && id !== userId && (isSuccessF && friends?.ids.includes(user.id)
          ? ( // isFriend
            <>
              <div
                onPointerOver={() => setIsFriendHover(true)}
                onPointerLeave={() => setIsFriendHover(false)}
                onClick={() => setIsFriendHover(true)}
              >
                {isFriendHover
                  ? <button className="button--small button--red mt-1 mr-2" onClick={() => deleteFriend({id: user.id})}><span><PersonXFill /></span>Remove Friend</button>
                  : <button className="button--small button--blue mt-1 mr-2"><span><PersonCheckFill /></span>Friend</button>
                }
              </div>
              <button className="button--small mt-1 mr-2" onClick={()=>dispatch(activateChat({friendId: user.id}))}><span><ChatFill /></span>Open Chat</button>
            </>
          ) : ( // isNotFriend
            friendsPending?.find((pending) => pending.pending.id === user.id && pending.state === 'waiting')
              ? <button className="button--small mt-1 mr-2" disabled><span><SendCheckFill /></span>Request sent</button>
              : <button className="button--small mt-1 mr-2" onClick={()=>addFriend({id: user.id})}><span><PersonPlusFill /></span>Add Friend</button>
          )
        )}
        {isInfo && <Link href={'/profile/' + userId}><button className="button--small mt-1 mr-2">Show Posts</button></Link>}
        {isAuth && id === userId && isInfo &&
          (isEditing
            ? <button className="button--small mt-1 mr-2" onClick={() => dispatch(setProfile({edit: null}))}><span><EyeFill /></span>Preview</button>
            : <button className="button--small mt-1 mr-2" onClick={() => dispatch(setProfile({edit: userId}))}><span><PencilFill /></span>Edit Profile</button>
          )
        }
        {isAuth && id === userId && !isInfo &&
            <LinkCallback href={'/profile/' + userId + '/info'} onClick={() => dispatchSSR('auth/setProfile', {edit: userId})}>
              <button className="button--small mt-1 mr-2"><span><PencilFill /></span>Edit Profile</button>
            </LinkCallback>
        }
      </div>
    </div>
  );
};

export default ProfileHeadButtons;