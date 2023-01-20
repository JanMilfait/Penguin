import React, {useEffect, useRef } from 'react';
import s from 'styles/6_components/RangeSlider.module.scss';

const RangeSlider = ({width, min, max, starting, onRelease}: {width: number, min: number, max: number, starting: number, onRelease: (val: number) => void}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current?.value) {
      inputRef.current.value = starting.toString();
    }
  }, []);

  return (
    <div className={s.rangeSlider}>
      <input ref={inputRef}
        type="range"
        min={min}
        max={max}
        onMouseUp={() => onRelease(Number(inputRef.current?.value))}
        onTouchEnd={() => onRelease(Number(inputRef.current?.value))}
        style={{width: width}}
      />
    </div>
  );
};

export default RangeSlider;