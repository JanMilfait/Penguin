import { AppDispatch } from 'app/store';
import dynamic from 'next/dynamic';
import React from 'react';
import { useDispatch } from 'react-redux';
import DotLoaderSpin from './DotLoaderSpin';
import {setProfile} from '../features/auth/authSlice';

const Quill = ({defaultValue}: {defaultValue: string}) => {
  const dispatch = useDispatch<AppDispatch>();

  const ReactQuill = dynamic(() => import('react-quill'), {
    ssr: false,
    loading: () => <div className="position-absolute top-50 start-50 translate-middle d-flex align-items-center"><DotLoaderSpin /></div>
  });

  const modules = {
    toolbar: [
      [{ header: '1' }, { header: '2' }, { header: '3' }],
      [{ size: [] }, { align: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link']
    ]
  };

  return (
    <>
      <ReactQuill
        theme="snow"
        modules={modules}
        placeholder="Write something about yourself..."
        defaultValue={defaultValue}
        onChange={(e) => dispatch(setProfile({quill: e}))}
      />
    </>
  );
};

export default React.memo(Quill);