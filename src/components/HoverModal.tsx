import { useHoverModal } from 'app/hooks/useHoverModal';
import React from 'react';

const HoverModal = ({hover, modal, onHoverClick}: {hover: React.ReactNode, modal: React.ReactNode, onHoverClick?: () => void}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hoverRef = React.useRef<HTMLDivElement>(null);

  const {isOpenModal} = useHoverModal(containerRef, hoverRef);

  return (
    <div className="position-relative">
      <div ref={containerRef}>
        <div ref={hoverRef} className="position-relative cp" style={{zIndex: 1}} onClick={onHoverClick}>{hover}</div>
        <div className={isOpenModal ? '' : 'd-none'}>{modal}</div>
      </div>
    </div>
  );
};

export default HoverModal;
