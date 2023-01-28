import { useToggleModal } from 'app/hooks/useToggleModal';
import React, {ReactNode, useLayoutEffect, useRef, useState } from 'react';

type ToggleModalProps = {toggle: ReactNode, modal?: ReactNode, clickClose?: boolean, disabled?: boolean, hidden?: boolean};

const ToggleModalFixed = ({toggle, modal, clickClose, disabled, hidden = true}: ToggleModalProps) => {
  const [position, setPosition] = useState<{x: number, y: number}>({x: 0, y: 0});

  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);
  const {isOpenModal} = useToggleModal(containerRef, toggleRef, clickClose, disabled);

  useLayoutEffect(() => {
    if (!isOpenModal) return;

    const handleScroll = () => {
      if (toggleRef.current) {
        const {x, y, width, height} = toggleRef.current.getBoundingClientRect();
        setPosition({x: x + width, y: y + height});
      }
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpenModal]);

  return (
    <div className="position-relative">
      <div ref={containerRef} className={isOpenModal ? 'toggleModal-open' : ''}>
        <div ref={toggleRef}>{toggle}</div>
        {hidden
          ? (
            <div className={'position-fixed' + (isOpenModal ? '' : ' d-none')} style={{top: position.y, left: position.x, zIndex: 2}}>
              <div className="position-relative">
                {modal}
              </div>
            </div>
          ) : (
            isOpenModal &&
            <div className={'position-fixed'} style={{top: position.y, left: position.x, zIndex: 2}}>
              <div className="position-relative">
                {modal}
              </div>
            </div>
          )
        }
      </div>
    </div>
  );
};

export default ToggleModalFixed;
