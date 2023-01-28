import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {AppState} from '../../app/store';
import {useGetUserQuery} from './authSlice';
import s from 'styles/6_components/Profile.module.scss';
import Link from 'next/link';
import {skillsByTag} from '../../app/helpers/helpers';
import SkillBar from '../skill/SkillBar';
import { sanitize } from 'dompurify';

const ProfileInfo = () => {
  const userId = useSelector((state: AppState) => state.auth.profile?.id);
  const { data: user, isSuccess, isLoading } = useGetUserQuery({id: userId!}, {skip: typeof userId !== 'number'});
  const skills = useMemo(() => skillsByTag(user?.skills ?? []), [user?.skills]);

  if (isLoading || !isSuccess) return null;

  const profile = user.profile;
  const notSet = <span className="opacity-50">- not set -</span>;

  if (!user.email) {
    return (
      <div className="row mt-5">
        <p className="text-center">
          User has set their profile to private, <Link href={'/register'}>register</Link> and send them friend request.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="row mt-4 flex-wrap-reverse">
        <div className="col-12 col-xl-4">
          <ul className={s.profile__info}>
            <li className="mb-2 mt-2">
              <div className="row flex-nowrap">
                <div className="col-4"><h3 className="f--small mb-0 fw-bold">E-mail:</h3></div>
                <div className="col"><p className="f--small mb-0 text-break"><a href={'mailto:' + user.email}>{user.email ?? notSet}</a></p></div>
              </div>
            </li>
            <li className="mb-2 mt-2">
              <div className="row flex-nowrap">
                <div className="col-4"><h3 className="f--small mb-0 fw-bold">Phone:</h3></div>
                <div className="col">
                  <p className="f--small mb-0 text-break">
                    {profile?.telephone
                      ? <a href={'tel:' + profile?.telephone}>{profile?.telephone}</a>
                      : <p className="f--small mb-0 text-break">{notSet}</p>
                    }
                  </p>
                </div>
              </div>
            </li>
            <li className="mb-2 mt-2">
              <div className="row flex-nowrap">
                <div className="col-4"><h3 className="f--small mb-0 fw-bold">Age:</h3></div>
                <div className="col"><p className="f--small mb-0 text-break">{profile?.age ?? notSet}</p></div>
              </div>
            </li>
            <li className="mb-2 mt-2">
              <div className="row flex-nowrap">
                <div className="col-4"><h3 className="f--small mb-0 fw-bold">Address:</h3></div>
                <div className="col"><p className="f--small mb-0 text-break">{profile?.address ?? notSet}</p></div>
              </div>
            </li>
            <li className="mt-2 mb-2">
              <div className="row flex-nowrap">
                <div className="col-4"><h3 className="f--small mb-0 fw-bold">Country:</h3></div>
                <div className="col"><p className="f--small mb-0 text-break">{profile?.nationality ?? notSet}</p></div>
              </div>
            </li>
          </ul>
        </div>
        <div className="col-12 col-xl-7 offset-0 offset-xl-1 mb-4 mb-xl-0">
          <div className={s.profile__description}>
            <h3 className="f--medium fw-bold mt-2 mb-4">Description:</h3>
            {profile?.description
              ? <div className="d-flex h-100 flex-grow-1 mb-2" dangerouslySetInnerHTML={{__html: sanitize(profile.description)}} />
              : <div className="d-flex justify-content-center align-items-center h-100 flex-grow-1 mb-2"><p>{notSet}</p></div>
            }
          </div>
        </div>
      </div>
      {skills.length > 0 &&
        <>
          <div className="row">
            <div className="col-12">
              <h3 className="f--medium fw-bold mt-5 mb-4 ml-1">Skills and interests:</h3>
            </div>
          </div>
          {skills.map((item, index) => (
            <SkillBar key={index} tag={item.tag} skills={item.skills} />
          ))}
        </>
      }
    </>
  );
};

export default ProfileInfo;