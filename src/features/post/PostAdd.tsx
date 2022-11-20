import React from 'react';
import s from 'styles/6_components/PostAdd.module.scss';
import Avatar from '../../components/Avatar';
import {AppState} from '../../app/store';
import { useSelector } from 'react-redux';
import {GeoAlt, Image, CameraVideo, ThreeDots, SendFill} from 'react-bootstrap-icons';

const PostAdd = () => {
  const user = useSelector((state: AppState) => state.auth.data);

  return (
    <div className={s.postAdd}>
      <div className="row">
        <div className="col-auto">
          <Avatar user={user} size={50} />
        </div>
        <div className="col">
          <textarea className={s.textarea} rows={4} placeholder="What's on your mind?"></textarea>
        </div>
      </div>
      <div className="row align-items-center pt-3">
        <div className="col">
          <ul className={s.postAdd__icons + ' justify-content-center justify-content-md-start'}>
            <li><GeoAlt /><p className="p--small">Location</p></li>
            <li><Image /><p className="p--small">Photo</p></li>
            <li><CameraVideo /><p className="p--small">Video</p></li>
            <li><ThreeDots /><p className="p--small">More</p></li>
          </ul>
        </div>
        <div className="col-12 col-md-auto mt-4 mt-md-0 d-flex justify-content-end">
          <button className="button--small button--blue"><span><SendFill /></span>Publish</button>
        </div>
      </div>
    </div>
  );
};

export default PostAdd;