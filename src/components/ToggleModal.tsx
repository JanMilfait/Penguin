import { useToggleModal } from 'app/hooks/useToggleModal';
import React from 'react';

const ToggleModal = ({toggle, modal, anchorClickClose}: {toggle: React.ReactNode, modal: React.ReactNode, anchorClickClose?: boolean}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLDivElement>(null);

  const {isOpenModal} = useToggleModal(containerRef, toggleRef, anchorClickClose);

  return (
    <div className="position-relative">
      <div ref={containerRef} className={isOpenModal ? 'toggleModal-open' : ''}>
        <div ref={toggleRef}>{toggle}</div>
        <div className={isOpenModal ? '' : 'd-none'}>{modal}</div>
      </div>
    </div>
  );
};

export default ToggleModal;
