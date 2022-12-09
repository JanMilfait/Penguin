import { useToggleModal } from 'app/hooks/useToggleModal';
import React from 'react';

const ToggleModal = ({toggle, modal}: {toggle: React.ReactNode, modal: React.ReactNode}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLDivElement>(null);

  const {isOpenModal} = useToggleModal(containerRef, toggleRef);

  return (
    <div className="position-relative">
      <div ref={containerRef}>
        <div ref={toggleRef}>{toggle}</div>
        <div className={isOpenModal ? '' : 'd-none'}>{modal}</div>
      </div>
    </div>
  );
};

export default ToggleModal;
