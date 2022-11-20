import {RefObject, useEffect, useState } from 'react';

/**
 * Hook to handle modal state and events
 */
export const useModal = (containerRef: RefObject<HTMLDivElement>, toggleRef: RefObject<HTMLDivElement>) => {
  const [isOpenModal, setIsOpenModal] = useState(false);


  useEffect(() => {
    const toggle = toggleRef.current;
    if (!toggle) return;

    toggle.classList.add('modal__toggle');
    return () => {
      toggle.classList.remove('modal__toggle');
    };
  }, [toggleRef]);


  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpenModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpenModal(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [containerRef]);


  useEffect(() => {
    const toggle = toggleRef.current;
    if (!toggle) return;

    const handleToggleClick = () => {
      setIsOpenModal(!isOpenModal);
    };

    toggle.addEventListener('click', handleToggleClick);
    return () => {
      toggle.removeEventListener('click', handleToggleClick);
    };
  }, [toggleRef, isOpenModal]);


  const toggleModal = () => setIsOpenModal(!isOpenModal);
  const closeModal = () => setIsOpenModal(false);

  return { isOpenModal, toggleModal, closeModal };
};
