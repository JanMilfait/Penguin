import { UseMutation } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { AppDispatch } from 'app/store';
import React, { ChangeEvent, DragEvent, useRef, useState } from 'react';
import { PlusCircle } from 'react-bootstrap-icons';
import { useDispatch } from 'react-redux';
import s from 'styles/6_components/ImgUploadHover.module.scss';
import {useDragEnterLeave} from '../app/hooks/useDragEnterLeave';
import {setOpenModal} from '../features/root/rootSlice';

type ImgUploadHoverProps = {element: JSX.Element, name: string, mutation: UseMutation<any>, args?: Record<string, any>, className?: string, style?: React.CSSProperties};

const ImgUploadHover = ({element, name, mutation, args, className, style}: ImgUploadHoverProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const containerRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [hover, setHover] = useState(false);
  const [upload] = mutation();

  const [clear] = useDragEnterLeave(containerRef, () => setHover(true), () => setHover(false));

  const handleClickInput = (e: ChangeEvent<HTMLInputElement>) => {

    if (e.target.files && e.target.files.length > 0) {

      const formData = new FormData();
      args && Object.keys(args).forEach(key => formData.append(key, args[key]));
      formData.append(name, e.target.files[0]);

      upload({formData})
        .then((res: any) => {
          e.target.files = null;
          if (res.error) {
            console.log(res.error);

            if (res.error.data?.validationErrors?.[name]) {
              dispatch(setOpenModal({
                props: {
                  type: 'alert',
                  icon: 'error',
                  title: 'Upload error',
                  message: res.error.data?.validationErrors?.[name].join('\n'),
                  clickOutside: true
                }
              }));
            }
          }
        });
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setHover(false);
    clear();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {

      const formData = new FormData();
      args && Object.keys(args).forEach(key => formData.append(key, args[key]));
      formData.append(name, e.dataTransfer.files[0]);

      upload({formData})
        .then((res: any) => {
          if (res.error) {
            console.log(res.error);

            if (res.error.data?.validationErrors?.[name]) {
              dispatch(setOpenModal({
                props: {
                  type: 'alert',
                  icon: 'error',
                  title: 'Upload error',
                  message: res.error.data?.validationErrors?.[name].join('\n'),
                  clickOutside: true
                }
              }));
            }
          }
        });
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        style={style}
        onClick={() => imageInputRef.current?.click()}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onTouchStart={() => setHover(true)}
        onTouchEnd={() => setHover(false)}
        onDragOver={e => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={handleDrop}
      >
        {element}
        {hover && <div className={s.imgUploadHover__overlay}><PlusCircle /></div>}
      </div>
      <input ref={imageInputRef} className="d-none" type="file" name={name} accept="image/*" onChange={handleClickInput} />
    </>
  );
};

export default ImgUploadHover;