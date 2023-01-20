import { useHoverModal } from 'app/hooks/useHoverModal';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import {AppState} from '../app/store';

type HoverModalProps = {hover: React.ReactNode, modal: React.ReactNode, onHoverClick?: () => void, attachToCursor?: boolean};

const HoverModal = ({hover, modal, onHoverClick, attachToCursor = false}: HoverModalProps) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const hoverRef = React.useRef<HTMLDivElement>(null);
  const modalRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useSelector((state: AppState) => state.root.isMobile);

  const {isOpenModal} = useHoverModal(containerRef, hoverRef);

  /**
   * Attach modal to cursor, if attachToCursor is true
   */
  useEffect(() => {
    if (!attachToCursor) return;
    const container = containerRef.current;
    const modal = modalRef.current;
    if (!container || !modal) return;

    modal.style.position = 'fixed';
    modal.style.zIndex = '11';

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        modal.style.left = `${e.clientX + 10}px`;
        modal.style.top = `${e.clientY - 10}px`;
      } else {
        modal.style.left = '12px';
        modal.style.width = 'calc(100% - 24px)';
        modal.style.top = `${e.clientY - 50}px`;
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [attachToCursor, isMobile]);


  /**
   * Scroll all paragraphs and h3s in the modal, if attachToCursor is true
   */
  useEffect(() => {
    if (!attachToCursor) return;
    const modal = modalRef.current;
    const hover = hoverRef.current;
    if (!hover || !modal) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const p = modal.querySelectorAll('p');
      const h3 = modal.querySelectorAll('h3');

      if (p.length > 0) {
        p.forEach((p) => {
          p.scrollTop += e.deltaY;
        });
      }
      if (h3.length > 0) {
        h3.forEach((h3) => {
          h3.scrollTop += e.deltaY;
        });
      }
    };
    hover.addEventListener('wheel', handleWheel);
    return () => {
      hover.removeEventListener('wheel', handleWheel);
    };
  }, [attachToCursor]);


  return (
    <div className="position-relative">
      <div ref={containerRef}>
        <div ref={hoverRef} className="position-relative cp" style={{zIndex: 1}} onClick={onHoverClick}>{hover}</div>
        <div className={isOpenModal ? '' : 'd-none'}><div ref={modalRef}>{modal}</div></div>
      </div>
    </div>
  );
};

export default HoverModal;
