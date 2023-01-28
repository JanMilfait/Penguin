import React from 'react';
import s from '../../styles/6_components/Profile.module.scss';
import Avatar from '../../components/Avatar';
import { AppState } from '../../app/store';
import { useSelector } from 'react-redux';
import { useGetFriendsIdsQuery } from '../friend/friendSlice';
import { useGetUserQuery, useUpdateUserMutation } from './authSlice';
import ProfileHeadButtons from './ProfileHeadButtons';
import ImgUploadHover from 'components/ImgUploadHover';


const ProfileHead = () => {
  const id = useSelector((state: AppState) => state.auth.data?.id);
  const userId = useSelector((state: AppState) => state.auth.profile.id);

  const { data: user, isLoading, isSuccess } = useGetUserQuery({id: userId!}, {skip: typeof userId !== 'number'});
  const { data: friendsIds, isLoading: isLoadingF, isSuccess: isSuccessF } = useGetFriendsIdsQuery({id: userId!}, {skip: typeof userId !== 'number'});
  const activityStatus = useSelector((state: AppState) => state.friend.activityStatus[user?.id || 0]);

  if (isLoading || !isSuccess) return null;

  return (
    <div className={s.profile__head}>
      <div className="row h-100">
        <div className="col-auto">
          <div className={s.profile__avatar}>
            {id !== userId
              ? <Avatar {...user} size={160} />
              : <ImgUploadHover
                className={s.profile__avatarImg}
                element={<Avatar {...user} size={160} />}
                mutation={useUpdateUserMutation}
                args={{id: userId}}
                name={'avatar'}
              />
            }
          </div>
        </div>
        <div className="col d-flex align-items-center mw-0">
          <div className={s.profile__avatarContent}>
            <div className="row">
              <div className="col-12">
                <h2 className="fw-bold text-truncate mb-0">
                  {user.name}
                  {activityStatus === 1 && <span className={s.profile__active + ' f--x-small'}>is online</span>}
                  {activityStatus === 0 && <span className={s.profile__offline + ' f--x-small'}>is offline</span>}
                </h2>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                {!isLoadingF && (isSuccessF
                  ? <p className="text-truncate mb-0">friends (<span className="f--medium">{friendsIds.count}</span>)</p>
                  : <p className="text-truncate mb-0">profile is set to private</p>
                )}
              </div>
            </div>
            <ProfileHeadButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHead;