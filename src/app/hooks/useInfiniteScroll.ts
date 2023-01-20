import { useState, useEffect, RefObject } from 'react';

/**
 * Infinite scroll hook for already loaded data
 *
 * @param data
 * @param dataDependency
 * @param container
 * @param itemSize - it's better to pass the size of the item without the margin
 * @param orientation
 */
export const useInfiniteScroll = (data: any, container: RefObject<HTMLElement>, itemSize: number, dataDependency = 0 as any, orientation = 'height') => {
  const numItems = Math.ceil((container.current ? (container.current[orientation === 'height' ? 'offsetHeight' : 'offsetWidth'] / itemSize) : 10));
  const [items, setItems] = useState(data?.slice(0, numItems) ?? []);

  useEffect(() => {
    if (!container.current) return;
    const el = container.current;

    function handleScroll() {
      const {
        scrollHeight,
        scrollTop,
        clientHeight,
        scrollWidth,
        scrollLeft,
        clientWidth
      } = el;

      // tolerance 5px
      if (orientation === 'height' && scrollHeight - scrollTop - clientHeight < 5) {
        setItems((prevItems: any) => [...prevItems, ...data.slice(prevItems.length, prevItems.length + numItems)]);
      }
      if (orientation === 'width' && scrollWidth - scrollLeft - clientWidth < 5) {
        setItems((prevItems: any) => [...prevItems, ...data.slice(prevItems.length, prevItems.length + numItems)]);
      }
    }

    el.addEventListener('scroll', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
    };
  }, [data, numItems]);

  useEffect(() => {
    setItems(data?.slice(0, numItems) ?? []);
  }, [data, dataDependency, numItems]);

  return [items];
};