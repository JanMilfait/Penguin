import React, {ChangeEvent, useRef } from 'react';
import {setCreatingSkill, useAddSkillMutation} from './skillSlice';
import s from '../../styles/6_components/Profile.module.scss';
import {AppDispatch, AppState} from 'app/store';
import { useDispatch, useSelector } from 'react-redux';
import {hasErrMessage} from '../../app/helpers/errorHandling';
import TextareaAutosize from 'react-textarea-autosize';

const SkillCreator = () => {
  const user = useSelector((state: AppState) => state.auth.data);

  const dispatch = useDispatch<AppDispatch>();
  const tagRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLTextAreaElement|null>(null);
  const [addSkill, {error}] = useAddSkillMutation();

  const handleAdd = async () => {
    const formData = new FormData();
    formData.append('userId', `${user?.id}`);
    formData.append('tag', tagRef.current?.value.replace('#', '') ?? '');
    formData.append('name', nameRef.current?.value ?? '');
    formData.append('description', descRef.current?.value ?? '');

    const response = await addSkill({formData});

    if (!('error' in response)) {
      await dispatch(setCreatingSkill(false));
    }
  };

  const preserveHash = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value[0] !== '#') {
      e.target.value = '#' + e.target.value;
    }
  };

  return (
    <div className={s.profile__skillPreview}>
      <input
        ref={tagRef}
        type="text"
        className={'f--xx-small text-uppercase fw-bold mb-0 float-end w-auto' + (hasErrMessage(error, 'tag') ? ' isInvalid' : '')}
        placeholder="#TAG"
        onChange={preserveHash}
      />
      <div className="row align-items-center w-100">
        <div className="col-auto">
          <div style={{height: '80px'}}></div>
        </div>
        <div className="col">
          <input ref={nameRef} type="text" className={'f--medium fw-bold mb-0' + (hasErrMessage(error, 'name') ? ' isInvalid' : '')} placeholder="Name" />
        </div>
        <div className="col-auto">
          <button className="button--small" type="button" onClick={handleAdd}>Add</button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div>
            <TextareaAutosize
              className={s.profile__skillDescription + ' f--small p-0 p-md-2 mt-3 mb-3' + (hasErrMessage(error, 'description') ? ' isInvalid' : '')}
              minRows={5}
              placeholder="Write a description..."
              ref={(el) => descRef.current = el}
            >
            </TextareaAutosize>
          </div>
        </div>
      </div>
      <p className="position-absolute bottom-0 end-0 f--xx-small text-truncate mb-0 p-2">by {user?.name}</p>
    </div>
  );
};

export default SkillCreator;