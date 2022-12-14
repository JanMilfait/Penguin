import { useState, useEffect, RefObject } from 'react';

/**
 * Infinite scroll hook for already loaded data
 *
 * @param data
 * @param dataDependency
 * @param container
 * @param itemHeight - it's better to pass the height of the item without the margin
 */
export const useInfiniteScroll = (data: any, container: RefObject<HTMLElement>, itemHeight: number, dataDependency = 0 as any) => {
  const numItems = Math.ceil((container.current ? (container.current.offsetHeight / itemHeight) : 10));
  const [items, setItems] = useState(data.slice(0, numItems));

  useEffect(() => {
    if (!container.current) return;
    const el = container.current;

    function handleScroll() {
      const { scrollHeight, scrollTop, clientHeight } = el;

      if (scrollHeight - scrollTop === clientHeight) {
        setItems((prevItems: any) => [...prevItems, ...data.slice(prevItems.length, prevItems.length + numItems)]);
      }
    }

    el.addEventListener('scroll', handleScroll);
    return () => {
      el.removeEventListener('scroll', handleScroll);
    };
  }, [data]);

  useEffect(() => {
    setItems(data.slice(0, numItems));
  }, [data, dataDependency]);

  return [items];
};