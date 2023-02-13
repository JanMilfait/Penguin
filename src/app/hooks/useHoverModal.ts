import {RefObject, useEffect, useState } from 'react';

/**
 * Hook to handle hover modal state and events
 */
export const useHoverModal = (containerRef: RefObject<HTMLDivElement>, hoverRef: RefObject<HTMLDivElement>, disabled: boolean) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    const hover = hoverRef.current;
    if (!hover || disabled) return;

    hover.classList.add('modal__hover');
    return () => {
      hover.classList.remove('modal__hover');
    };
  }, [hoverRef]);


  useEffect(() => {
    const handleHoverOutside = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        isOpenModal && setIsOpenModal(false);
      }
    };
    document.addEventListener('pointerover', handleHoverOutside);
    return () => {
      document.removeEventListener('pointerover', handleHoverOutside);
    };
  }, [containerRef, isOpenModal]);


  useEffect(() => {
    const hover = hoverRef.current;
    if (!hover || disabled) return;

    const handleHoverClick = () => {
      !isOpenModal && setIsOpenModal(true);
    };
    hover.addEventListener('pointerenter', handleHoverClick);
    return () => {
      hover.removeEventListener('pointerenter', handleHoverClick);
    };
  }, [hoverRef, isOpenModal]);


  const toggleModal = () => setIsOpenModal(!isOpenModal);
  const closeModal = () => setIsOpenModal(false);

  return { isOpenModal, toggleModal, closeModal };
};
