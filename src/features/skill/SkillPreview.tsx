import React, {ChangeEvent, useRef, useState } from 'react';
import s from '../../styles/6_components/Profile.module.scss';
import {Skill} from '../auth/authSlice.types';
import Image from 'next/image';
import { AppState } from 'app/store';
import { useSelector } from 'react-redux';
import ImgUploadHover from '../../components/ImgUploadHover';
import { useUpdateSkillMutation } from './skillSlice';
import dynamic from 'next/dynamic';
import {hasErrMessage} from '../../app/helpers/errorHandling';

const SkillPreview = ({id, tag, name, icon_url, created_by, description}: Skill) => {
  const auth = useSelector((state: AppState) => state.auth.data?.id);
  const isOwner = auth === created_by.id;

  const [edit, setEdit] = useState(false);
  const tagRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const [updateSkill, {error}] = useUpdateSkillMutation();

  const TextareaAutosize = dynamic(() => import('react-textarea-autosize'), {ssr: false});

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append('id', `${id}`);
    formData.append('userId', `${auth}`);
    formData.append('tag', tagRef.current?.value.replace('#', '') ?? '');
    formData.append('name', nameRef.current?.value ?? '');
    formData.append('description', descRef.current?.querySelector('textarea')?.value ?? '');

    const response = await updateSkill({id, formData});

    if (!('error' in response)) {
      setEdit(false);
    }
  };

  const preserveHash = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value[0] !== '#') {
      e.target.value = '#' + e.target.value;
    }
  };

  if (edit) {
    return (
      <div className={s.profile__skillPreview}>
        <input
          ref={tagRef}
          type="text"
          className={'f--xx-small text-uppercase fw-bold mb-0 float-end w-auto' + (hasErrMessage(error, 'tag') ? ' isInvalid' : '')}
          placeholder="#TAG"
          onChange={preserveHash}
          defaultValue={tag}
        />
        <div className="row align-items-center w-100">
          <div className="col-auto">
            <div className={s.profile__skillIcon}>
              <ImgUploadHover
                element={icon_url
                  ? <Image src={icon_url} alt={icon_url} width={80} height={80} />
                  : <div className={s.profile__skillNoImg}><h3 className="f--x-small fw-bold">{name}</h3></div>
                }
                mutation={useUpdateSkillMutation}
                args={{id}}
                name={'icon'}
              />
            </div>
          </div>
          <div className="col">
            <input
              ref={nameRef}
              type="text"
              className={'f--medium fw-bold mb-0' + (hasErrMessage(error, 'name') ? ' isInvalid' : '')}
              defaultValue={name}
              placeholder="Name"
            />
          </div>
          {isOwner &&
            <div className="col-auto">
              <button className="button--small" type="button" onClick={handleUpdate}>Save</button>
            </div>
          }
        </div>
        <div className="row">
          <div className="col">
            <div ref={descRef}>
              <TextareaAutosize
                className={s.profile__skillDescription + ' f--small p-0 p-md-2 mt-3 mb-3' + (hasErrMessage(error, 'description') ? ' isInvalid' : '')}
                defaultValue={description ?? ''}
                minRows={5}
                placeholder="Write a description..."
              >
              </TextareaAutosize>
            </div>
          </div>
        </div>
        <p className="position-absolute bottom-0 end-0 f--xx-small text-truncate mb-0 p-2">by {created_by.name}</p>
      </div>
    );
  }

  return (
    <div className={s.profile__skillPreview}>
      <p className="position-absolute top-0 end-0 f--xx-small text-uppercase text-truncate fw-bold mb-0 p-2">#{tag}</p>
      <div className="row align-items-center w-100">
        <div className="col-auto">
          <div className={s.profile__skillIcon}>
            {isOwner
              ? (
                <ImgUploadHover
                  element={
                    icon_url
                      ? <Image src={icon_url} alt={icon_url} width={80} height={80} />
                      : <div className={s.profile__skillNoImg}><h3 className="f--x-small fw-bold">{name}</h3></div>
                  }
                  mutation={useUpdateSkillMutation}
                  args={{id}}
                  name={'icon'}
                />
              ) : (
                icon_url
                  ? <Image src={icon_url} alt={icon_url} width={80} height={80} />
                  : <div className={s.profile__skillNoImg}><h3 className="f--x-small fw-bold">{name}</h3></div>
              )
            }
          </div>
        </div>
        <div className="col mw-0">
          <h3 className="f--medium fw-bold mb-0 text-truncate">{name}</h3>
        </div>
        {isOwner &&
          <div className="col-auto">
            <button className="button--small" type="button" onClick={() => setEdit(true)}>Edit</button>
          </div>
        }
      </div>
      <div className="row">
        <div className="col">
          <p className={s.profile__skillDescription + ' f--small p-0 p-md-2 mt-3'}>{description}</p>
        </div>
      </div>
      <p className="position-absolute bottom-0 end-0 f--xx-small text-truncate mb-0 p-2">by {created_by.name}</p>
    </div>
  );
};

export default SkillPreview;