import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { calculateUserCompletion, containsOnlyTags } from '../../app/helpers/helpers';
import { AppDispatch, AppState } from '../../app/store';
import s from '../../styles/6_components/Profile.module.scss';
import 'react-quill/dist/quill.snow.css';
import Quill from '../../components/Quill';
import { useUpdateUserMutation } from './authSlice';
import { setOpenModal } from '../root/rootSlice';
import { hasErrMessage } from '../../app/helpers/errorHandling';
import SkillEditor from 'features/skill/SkillEditor';

const ProfileInfoEdit = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: AppState) => state.auth.data!);
  const description = useSelector((state: AppState) => state.auth.profile?.quill);
  const profile = user.profile;

  const [update, {error}] = useUpdateUserMutation();
  const [clicked, setClicked] = useState(false);

  const { missing, percent } = calculateUserCompletion(user!);
  const missingText = {
    avatar: 'profile picture',
    address: 'address',
    age: 'age',
    description: 'description about yourself',
    nationality: 'nationality',
    telephone: 'telephone number',
    skills: 'skills and interests'
  } as { [key: string]: string };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setClicked(true);

    const formData = new FormData();
    formData.append('id', `${user.id}`);
    e.target.telephone.value ? formData.append('telephone', e.target.telephone.value) : null;
    e.target.address.value ? formData.append('address', e.target.address.value) : null;
    e.target.age.value ? formData.append('age', e.target.age.value) : null;
    e.target.nationality.value ? formData.append('nationality', e.target.nationality.value) : null;
    e.target.description.value ? formData.append('description', e.target.description.value) : null;
    e.target['skills[]']?.value
      ? formData.append('skills[]', e.target['skills[]'].value)
      : e.target['skills[]']?.length
        ? e.target['skills[]'].forEach((skill: any) => formData.append('skills[]', skill.value))
        : formData.append('skills[]', 'detach');

    const response = await update({formData});

    if (!('error' in response)) {
      dispatch(setOpenModal({
        props: {
          type: 'alert',
          icon: 'success',
          title: 'Profile changed',
          message: 'Your profile information has been updated successfully.',
          clickOutside: true
        }
      }));
    }
    setClicked(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={'row mt-4' + (percent === 100 ? ' d-none' : '')}>
        {percent !== 0 ? (
          percent !== 100 &&
            <h3 className="f--x-small text-center text-danger mb-4">Your profile is missing
              {missing.map((item, index) =>
                <span key={index}> {missingText[item]}{index !== missing.length - 1 ? (index === missing.length - 2 ? ' and ' : ', ' ) : '.'}</span>
              )}
            </h3>
        ) : (
          <h3 className="f--x-small text-center text-danger mb-4">
            Fill out information about yourself, visibility of your profile is set to &quot;{user.profile_visibility}&quot;.
          </h3>
        )}
      </div>
      <div className="row mt-4 flex-wrap-reverse">
        <div className="col-12 col-xl-4">
          <ul className={s.profile__info}>
            <li className="mb-2 mt-2">
              <div className="row align-items-center flex-nowrap">
                <div className="col-4"><h3 className="f--small mb-0 fw-bold">E-mail:</h3></div>
                <div className="col"><input className='f--small' type="text" name="email" defaultValue={user?.email ?? ''} readOnly/></div>
              </div>
            </li>
            <li className="mb-2 mt-2">
              <div className="row align-items-center flex-nowrap">
                <div className="col-4"><h3 className="f--small mb-0 fw-bold">Phone:</h3></div>
                <div className="col"><input className={'f--small' + (hasErrMessage(error, 'telephone') ? ' isInvalid' : '')} type="tel" name="telephone" defaultValue={profile?.telephone ?? ''} /></div>
              </div>
              {hasErrMessage(error, 'telephone') && <div className="row"><div className="col-4"></div><div className="col"><p className="isInvalidText">{error.data?.validationErrors?.telephone.join('\n')}</p></div></div>}
            </li>
            <li className="mb-2 mt-2">
              <div className="row align-items-center flex-nowrap">
                <div className="col-4"><h3 className="f--small mb-0 fw-bold">Age:</h3></div>
                <div className="col"><input className={'f--small' + (hasErrMessage(error, 'age') ? ' isInvalid' : '')} type="number" name="age" min="1" defaultValue={profile?.age ?? ''} /></div>
              </div>
              {hasErrMessage(error, 'age') && <div className="row"><div className="col-4"></div><div className="col"><p className="isInvalidText">{error.data?.validationErrors?.age.join('\n')}</p></div></div>}
            </li>
            <li className="mb-2 mt-2">
              <div className="row align-items-center flex-nowrap">
                <div className="col-4"><h3 className="f--small mb-0 fw-bold">Address:</h3></div>
                <div className="col"><input className={'f--small' + (hasErrMessage(error, 'address') ? ' isInvalid' : '')} type="text" name="address" defaultValue={profile?.address ?? ''} /></div>
              </div>
              {hasErrMessage(error, 'address') && <div className="row"><div className="col-4"></div><div className="col"><p className="isInvalidText">{error.data?.validationErrors?.address.join('\n')}</p></div></div>}
            </li>
            <li className="mt-2 mb-2">
              <div className="row align-items-center flex-nowrap">
                <div className="col-4"><h3 className="f--small mb-0 fw-bold">Country:</h3></div>
                <div className="col"><input className={'f--small' + (hasErrMessage(error, 'nationality') ? ' isInvalid' : '')} type="text" name="nationality" defaultValue={profile?.nationality ?? ''} /></div>
              </div>
              {hasErrMessage(error, 'nationality') && <div className="row"><div className="col-4"></div><div className="col"><p className="isInvalidText">{error.data?.validationErrors?.nationality.join('\n')}</p></div></div>}
            </li>
          </ul>
        </div>
        <div className="col-12 col-xl-7 offset-0 offset-xl-1 mb-4 mb-xl-0">
          <div className={s.profile__descriptionEditor}>
            <Quill defaultValue={profile?.description ?? ''} />
            <input type="hidden" name="description" value={description} />
          </div>
          {hasErrMessage(error, 'description') && <p className="isInvalidText">{error.data?.validationErrors?.description.join('\n')}</p>}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h3 className="f--medium fw-bold mt-5 mb-4 ml-1">Skills and interests:</h3>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <SkillEditor />
        </div>
      </div>
      <div className="row justify-content-center justify-content-md-end mt-4">
        <div className="col-auto">
          <button className="button--blue" type="submit" disabled={clicked}>Save</button>
        </div>
      </div>
    </form>
  );
};

export default ProfileInfoEdit;