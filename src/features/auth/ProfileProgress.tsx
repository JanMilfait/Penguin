import React from 'react';
import s from 'styles/6_components/ProfileProgress.module.scss';
import Avatar from '../../components/Avatar';
import { AppState } from '../../app/store';
import { useSelector } from 'react-redux';
import ProgressBar from 'components/ProgressBar';
import Link from 'next/link';
import { calculateUserCompletion } from '../../app/helpers/helpers';

const ProfileProgress = () => {
  const user = useSelector((state: AppState) => state.auth.data!);
  const {percent} = calculateUserCompletion(user!);

  return (
    <div className={s.profileProgress}>
      <div className={s.profileProgress__image}><Avatar {...user} size={130} /></div>
      <div className={s.profileProgress__content}>
        <div className={s.profileProgress__text}>
          <h3 className="text-truncate mb-0">{user?.name}</h3>
          <p className="text-truncate">{user?.email}</p>
        </div>
        <div className={s.profileProgress__progress}>
          <p>Profile Complete</p>
          <p>{percent}%</p>
        </div>
        <ProgressBar percent={percent} />
        <Link href=""><button className="button--fluid">Complete Profile</button></Link>
      </div>
    </div>
  );
};

export default ProfileProgress;