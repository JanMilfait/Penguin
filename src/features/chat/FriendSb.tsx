import s from '../../styles/6_components/FriendsSb.module.scss';
import Avatar from '../../components/Avatar';
import { activateChat } from './chatSlice';
import { Friend } from './chatSlice.types';
import { AppDispatch } from '../../app/store';
import { useDispatch } from 'react-redux';
import React from 'react';

export const FriendSb = ({friend}: {friend: Friend}) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
      <div className={s.friendsSideBar__friend}
        data-tip={friend.name}
        data-for="friendTooltip"
      >
        {friend.is_active
          ? <div className={s.friendsSideBar__online} ></div>
          : <div className={s.friendsSideBar__offline} ></div>
        }
        <Avatar user={friend} size={50} onClick={()=>dispatch(activateChat({id: friend.id}))} />
      </div>
    </>
  );
};

export default React.memo(FriendSb);