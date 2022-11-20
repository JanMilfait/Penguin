import { useModal } from 'app/hooks/useModal';
import React from 'react';

const Modal = ({toggle, modal}: {toggle: React.ReactNode, modal: React.ReactNode}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLDivElement>(null);

  const {isOpenModal} = useModal(containerRef, toggleRef);

  return (
    <div className="position-relative">
      <div ref={containerRef}>
        <div ref={toggleRef}>{toggle}</div>
        <div className={isOpenModal ? '' : 'd-none'}>{modal}</div>
      </div>
    </div>
  );
};

export default Modal;
