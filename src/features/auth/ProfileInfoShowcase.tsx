import Link from 'next/link';
import React from 'react';
import { useSelector } from 'react-redux';
import s from 'styles/6_components/Profile.module.scss';
import {AppState} from '../../app/store';
import {useGetUserQuery} from './authSlice';

const ProfileInfoShowcase = () => {
  const userId = useSelector((state: AppState) => state.auth.profile.id);
  const { data: user, isSuccess, isLoading } = useGetUserQuery({id: userId!}, {skip: typeof userId !== 'number'});

  if (isLoading || !isSuccess) return null;

  const profile = user.profile;
  const hasSkills = user.skills?.length > 0;
  const hasDesc = user.profile && profile?.description !== null;

  return (
    <ul className={s.profile__infoShowcase + ' mb-4'}>
      {user.email &&
        <li>
          <div className="row flex-nowrap">
            <div className="col-4"><h3 className="f--small mb-0">E-mail:</h3></div>
            <div className="col"><p className="f--small mb-0 text-break"><a href={'mailto:' + user.email}>{user.email}</a></p></div>
          </div>
        </li>
      }
      {profile?.telephone &&
        <li className="mt-2">
          <div className="row flex-nowrap">
            <div className="col-4"><h3 className="f--small mb-0">Phone:</h3></div>
            <div className="col"><p className="f--small mb-0 text-break"><a href={'tel:' + profile.telephone}>{profile.telephone}</a></p></div>
          </div>
        </li>
      }
      {profile?.age &&
        <li className="mt-2">
          <div className="row flex-nowrap">
            <div className="col-4"><h3 className="f--small mb-0">Age:</h3></div>
            <div className="col"><p className="f--small mb-0 text-break">{profile.age}</p></div>
          </div>
        </li>
      }
      {profile?.address &&
        <li className="mt-2">
          <div className="row flex-nowrap">
            <div className="col-4"><h3 className="f--small mb-0">Address:</h3></div>
            <div className="col"><p className="f--small mb-0 text-break">{profile.address}</p></div>
          </div>
        </li>
      }
      {profile?.nationality &&
        <li className="mt-2">
          <div className="row flex-nowrap">
            <div className="col-4"><h3 className="f--small mb-0">Country:</h3></div>
            <div className="col"><p className="f--small mb-0 text-break">{profile.nationality}</p></div>
          </div>
        </li>
      }
      {hasSkills &&
        <>
          <li className="mt-4">
            <div className="row">
              <div className="col-12">
                <p className="f--small mb-0 text-break text-center w-75 m-auto">
                  User has {hasDesc && 'description'}{hasSkills && hasDesc && ' and '}{hasSkills && 'skills'} on their profile.
                </p>
              </div>
            </div>
          </li>
          <li className="mt-3">
            <div className="row">
              <div className="col-12">
                <Link href={'/profile/' + user.id + '/info'}><button className="button button--small button--fluid">See More</button></Link>
              </div>
            </div>
          </li>
        </>
      }
    </ul>
  );
};

export default ProfileInfoShowcase;