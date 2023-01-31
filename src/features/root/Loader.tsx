import ClipLoaderCircle from 'components/ClipLoaderCircle';
import React from 'react';
import s from 'styles/6_components/Loader.module.scss';


const Loader = () => {
  return (
    <div className={s.loader}>
      <ClipLoaderCircle />
    </div>
  );
};

export default Loader;