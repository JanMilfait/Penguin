import React, { useRef, useState } from 'react';
import s from 'styles/6_components/PostAdd.module.scss';
import Avatar from '../../components/Avatar';
import { AppState} from '../../app/store';
import { useSelector } from 'react-redux';
import {GeoAlt, Image as Img, CameraVideo, ThreeDots, SendFill} from 'react-bootstrap-icons';
import {useAddPostMutation} from './postSlice';
import {hasErrMessage} from '../../app/helpers/errorHandling';
import Link from 'next/link';

const PostAdd = () => {
  const user = useSelector((state: AppState) => state.auth.data!);
  const category = useSelector((state: AppState) => state.post.filter.category);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [hasFile, setHasFile] = useState('');
  const [clicked, setClicked] = useState(false);
  const [addPost, { error}] = useAddPostMutation();


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setClicked(true);

    const formData = new FormData();
    formData.append('body', e.currentTarget.body.value);
    e.currentTarget.image.files.length > 0 && formData.append('image', e.currentTarget.image.files[0]);
    e.currentTarget.video.files.length > 0 && formData.append('video', e.currentTarget.video.files[0]);

    addPost({formData, category})
      .then((res: any) => {
        if (!res.error) {
          setHasFile('');
          textareaRef.current!.value = '';
          imageInputRef.current!.value = '';
          videoInputRef.current!.value = '';
        }
        setClicked(false);
      });
  };

  const saveImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      videoInputRef.current!.value = '';
      setHasFile('image');
    } else {
      setHasFile('');
    }
  };

  const saveVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      imageInputRef.current!.value = '';
      setHasFile('video');
    } else {
      setHasFile('');
    }
  };

  return (
    <form className={s.postAdd} onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-auto">
          <Link href={'/profile/' + user?.id}><Avatar {...user} size={50} /></Link>
        </div>
        <div className="col">
          <textarea ref={textareaRef} className={s.textarea + (hasErrMessage(error) ? ' isInvalidTextarea' : '')} rows={4} name='body' placeholder="What's on your mind?"></textarea>
          {hasErrMessage(error, 'body') && <p className="isInvalidText">{error.data?.validationErrors?.body.join('\n')}</p>}
          {hasErrMessage(error, 'image') && <p className="isInvalidText">{error.data?.validationErrors?.image.join('\n')}</p>}
          {hasErrMessage(error, 'video') && <p className="isInvalidText">{error.data?.validationErrors?.video.join('\n')}</p>}
        </div>
      </div>
      <div className="row align-items-center pt-3">
        <div className="col">
          <ul className={s.postAdd__icons + ' justify-content-center justify-content-md-start'}>
            <li><GeoAlt /><p className="f--small">Location</p></li>
            <li className={hasFile === 'image' ? s.active : ''} onClick={() => imageInputRef.current?.click()}><Img /><p className="f--small">Photo</p></li>
            <li className={hasFile === 'video' ? s.active : ''} onClick={() => videoInputRef.current?.click()}><CameraVideo /><p className="f--small">Video</p></li>
            <li><ThreeDots /><p className="f--small">More</p></li>
          </ul>
        </div>
        <div className="col-12 col-md-auto mt-4 mt-md-0 d-flex justify-content-end">
          <button className="button--small button--blue" disabled={clicked}><span><SendFill /></span>Publish</button>
        </div>
      </div>
      <input ref={imageInputRef} className="d-none" type="file" name="image" accept="image/*" onChange={saveImage} />
      <input ref={videoInputRef} className="d-none" type="file" name="video" accept="video/*" onChange={saveVideo} />
    </form>
  );
};

export default PostAdd;