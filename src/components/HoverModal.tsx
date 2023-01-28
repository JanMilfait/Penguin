import { useHoverModal } from 'app/hooks/useHoverModal';
import React, {ReactNode, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {AppState} from '../app/store';

type HoverModalProps = {hover: ReactNode, modal: ReactNode, onHoverClick?: () => void, attachToCursor?: boolean, autoOrientation?: boolean};

const HoverModal = ({hover, modal, onHoverClick, attachToCursor = false, autoOrientation = false}: HoverModalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const isMobile = useSelector((state: AppState) => state.root.isMobile);

  const {isOpenModal} = useHoverModal(containerRef, hoverRef);

  /**
   * Attach modal to cursor, if attachToCursor is true
   */
  useEffect(() => {
    if (!attachToCursor) return;
    const container = containerRef.current;
    const modalParent = modalRef.current;
    if (!container || !modalParent) return;

    modalParent.style.position = 'fixed';
    modalParent.style.zIndex = '11';

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMobile) {
        modalParent.style.left = `${e.clientX + 10}px`;
        modalParent.style.top = `${e.clientY - 10}px`;

        if (autoOrientation) {
          let height;
          let width;
          (e.clientY + 120) < window.innerHeight / 2 ? height = {top: '30px', bottom: 'auto'} : height = {top: 'auto', bottom: '5px'};
          (e.clientX - 120) < window.innerWidth / 2 ? width = {left: '5px', right: 'auto'} : width = {left: 'auto', right: '20px'};
          modalParent.children[0].setAttribute('style', `position: absolute; top: ${height.top}; bottom: ${height.bottom}; left: ${width.left}; right: ${width.right};`);
        }
      } else {
        modalParent.style.left = '12px';
        modalParent.style.width = 'calc(100% - 24px)';
        modalParent.style.top = `${e.clientY - 50}px`;
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
