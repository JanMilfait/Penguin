import {AppDispatch, AppState } from 'app/store';
import React from 'react';
import {useDispatch, useSelector } from 'react-redux';

const ComponentShared = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <>
    </>
  );
};

export default ComponentShared;