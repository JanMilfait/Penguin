import { useToggleModal } from 'app/hooks/useToggleModal';
import React from 'react';

type ToggleModalProps = {toggle: React.ReactNode, modal?: React.ReactNode, clickClose?: boolean, disabled?: boolean, hidden?: boolean};

const ToggleModal = ({toggle, modal, clickClose, disabled, hidden = true}: ToggleModalProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const toggleRef = React.useRef<HTMLDivElement>(null);

  const {isOpenModal} = useToggleModal(containerRef, toggleRef, clickClose, disabled);

  return (
    <div className="position-relative">
      <div ref={containerRef} className={isOpenModal ? 'toggleModal-open' : ''}>
        <div ref={toggleRef}>{toggle}</div>
        {hidden
          ? <div className={isOpenModal ? '' : 'd-none'}>{modal}</div>
          : isOpenModal && <div>{modal}</div>
        }
      </div>
    </div>
  );
};

export default ToggleModal;
