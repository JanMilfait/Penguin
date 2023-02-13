import React, { useState } from 'react';
import s from '../../styles/6_components/Settings.module.scss';
import {hasErrMessage} from '../../app/helpers/errorHandling';
import { useUpdateUserMutation } from './authSlice';
import {AppDispatch, AppState } from '../../app/store';
import {useDispatch, useSelector } from 'react-redux';
import {setOpenModal} from '../root/rootSlice';

const SettingsForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: AppState) => state.auth.data);

  const [update, {error}] = useUpdateUserMutation();
  const [clicked, setClicked] = useState(false);
  const [lastName, setLastName] = useState(user?.name);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setClicked(true);

    const formData = new FormData();
    e.target.name.value !== lastName && formData.append('name', e.target.name.value);
    e.target.profile_visibility.value !== user?.profile_visibility && formData.append('profile_visibility', e.target.profile_visibility.value);
    e.target.password.value && formData.append('password', e.target.password.value);
    e.target.password_confirmation.value && formData.append('password_confirmation', e.target.password_confirmation.value);

    if (formData.entries().next().done) {
      setClicked(false);
      return;
    }

    const response = await update({formData});

    if (!('error' in response)) {
      setLastName(e.target.name.value);
      e.target.password.value = '';
      e.target.password_confirmation.value = '';

      dispatch(setOpenModal({
        props: {
          type: 'alert',
          icon: 'success',
          title: 'Settings changed',
          message: 'Your settings have been changed successfully.',
          clickOutside: true
        }
      }));
    }
    setClicked(false);
  };

  return (
    <form className={s.settings__form} onSubmit={handleSubmit}>
      <h3 className="f--medium">Name</h3>
      <div>
        <input type="text" name="name" placeholder="Name" defaultValue={user?.name} className={hasErrMessage(error, 'name') ? 'isInvalid' : ''} />
        {hasErrMessage(error, 'name') && <p className="isInvalidText">{error.data?.validationErrors?.name.join('\n')}</p>}
      </div>
      <h3 className="mt-4 f--medium">Profile visibility</h3>
      <div>
        <select name="profile_visibility" defaultValue={user?.profile_visibility}>
          <option value="public">Public</option>
          <option value="friends">Friends</option>
          <option value="private">Private</option>
        </select>
        {hasErrMessage(error, 'profile_visibility') && <p className="isInvalidText">{error.data?.validationErrors?.profile_visibility.join('\n')}</p>}
      </div>
      <h3 className="mt-4 f--medium">New password</h3>
      <div>
        <input type="password" name="password" placeholder="Password" className={hasErrMessage(error, 'password') ? 'isInvalid' : ''} />
        {hasErrMessage(error, 'password') && <p className="isInvalidText">{error.data?.validationErrors?.password.join('\n')}</p>}
      </div>
      <div>
        <input type="password" name="password_confirmation" placeholder="Password confirm" className={hasErrMessage(error, 'password_confirmation') ? 'isInvalid' : ''} />
        {hasErrMessage(error, 'password_confirmation') && <p className="isInvalidText">{error.data?.validationErrors?.password_confirmation.join('\n')}</p>}
      </div>
      <div  className="mt-4">
        <button className="button--fluid button--blue" type="submit" disabled={clicked}>Save</button>
      </div>
    </form>
  );
};

export default SettingsForm;