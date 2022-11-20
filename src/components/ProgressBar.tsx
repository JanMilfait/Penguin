import React from 'react';
import s from 'styles/6_components/ProgressBar.module.scss';

const ProgressBar = ({height, percent}: {height?: number, percent: number}) => {
  return (
    <>
      <div className={s.progressBar} style={{height: height}}>
        <div className={s.progressBar__fill} style={{width: `${percent}%`}} />
      </div>
    </>
  );
};

export default ProgressBar;