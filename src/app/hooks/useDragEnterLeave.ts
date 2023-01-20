import { RefObject, useCallback, useEffect, useRef } from 'react';

/**
 * Fix dragenter/dragleave events on children elements
 *
 * @param element
 * @param onDragEnter
 * @param onDragLeave
 */
export const useDragEnterLeave = (element: RefObject<HTMLElement>, onDragEnter: () => void, onDragLeave: () => void) => {
  const dragCounter = useRef(0);

  useEffect(() => {
    const container = element.current;
    if (!container) return;

    const handleDragEnter = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current++;
      if (dragCounter.current === 1) onDragEnter();
    };
    const handleDragLeave = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter.current--;
      if (dragCounter.current === 0) onDragLeave();
    };

    container.addEventListener('dragenter', handleDragEnter);
    container.addEventListener('dragleave', handleDragLeave);
    return () => {
      container.removeEventListener('dragenter', handleDragEnter);
      container.removeEventListener('dragleave', handleDragLeave);
    };
  }, [dragCounter.current]);

  const clear = useCallback(() => {
    dragCounter.current = 0;
  }, []);

  return [clear];
};
