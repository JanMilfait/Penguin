import {RefObject, useEffect, useState } from 'react';

/**
 * Hook to handle hover modal state and events
 */
export const useHoverModal = (containerRef: RefObject<HTMLDivElement>, hoverRef: RefObject<HTMLDivElement>) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  useEffect(() => {
    const hover = hoverRef.current;
    if (!hover) return;

    hover.classList.add('modal__hover');
    return () => {
      hover.classList.remove('modal__hover');
    };
  }, [hoverRef]);


  useEffect(() => {
    const handleHoverOutside = (event: MouseEvent|TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        isOpenModal && setIsOpenModal(false);
      }
    };
    document.addEventListener('mouseover', handleHoverOutside);
    document.addEventListener('touchstart', handleHoverOutside);
    return () => {
      document.removeEventListener('mouseover', handleHoverOutside);
      document.removeEventListener('touchstart', handleHoverOutside);
    };
  }, [containerRef, isOpenModal]);


  useEffect(() => {
    const hover = hoverRef.current;
    if (!hover) return;

    const handleHoverClick = () => {
      !isOpenModal && setIsOpenModal(true);
    };
    hover.addEventListener('mouseover', handleHoverClick);
    hover.addEventListener('touchstart', handleHoverClick);
    return () => {
      hover.removeEventListener('mouseover', handleHoverClick);
      hover.removeEventListener('touchstart', handleHoverClick);
    };
  }, [hoverRef, isOpenModal]);


  const toggleModal = () => setIsOpenModal(!isOpenModal);
  const closeModal = () => setIsOpenModal(false);

  return { isOpenModal, toggleModal, closeModal };
};
