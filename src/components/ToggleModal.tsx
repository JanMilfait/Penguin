import { useToggleModal } from 'app/hooks/useToggleModal';
import React, { ReactNode, useRef } from 'react';

type ToggleModalProps = {toggle: ReactNode, modal?: ReactNode, clickClose?: boolean, disabled?: boolean, hidden?: boolean};

const ToggleModal = ({toggle, modal, clickClose, disabled, hidden = true}: ToggleModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLDivElement>(null);

  const {isOpenModal} = useToggleModal(containerRef, toggleRef, clickClose, disabled);

  return (
    <div className="position-relative">
      <div ref={containerRef} className={isOpenModal ? 'toggleModal-open' : ''}>
        <div ref={toggleRef} style={{userSelect: 'none'}}>{toggle}</div>
        {hidden
          ? <div className={isOpenModal ? '' : 'd-none'}>{modal}</div>
          : isOpenModal && <div>{modal}</div>
        }
      </div>
    </div>
  );
};

export default ToggleModal;
