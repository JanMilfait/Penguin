import PerfectScrollbar from 'perfect-scrollbar';
import {RefObject, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import {AppState} from '../store';

/**
 * Hook to initialize and update PerfectScrollbar on a ref
 */
const usePerfectScrollbar = (ref: RefObject<HTMLElement>, options?: PerfectScrollbar.Options, timeout = 0) => {
  const [ps, setPs] = useState<PerfectScrollbar | null>(null);
  const isMobile = useSelector((state: AppState) => state.root.isMobile);

  useEffect(() => {
    if (isMobile) return;

    if (ref.current) {
      timeout
        ? setTimeout(() => setPs(new PerfectScrollbar(ref.current as HTMLElement, {minScrollbarLength: 50, ...options})), timeout)
        : setPs(new PerfectScrollbar(ref.current, {minScrollbarLength: 50, ...options}));
    }

    return () => {
      if (ps) {
        ps.destroy();
        setPs(null);
      }
    };
  }, [isMobile, ref.current]);

  const updateScroll = (reset = false) => {
    if (ps) {
      ps.update();
      if (reset) {
        ref.current?.classList.remove('ps--active-y');
        ref.current?.classList.remove('ps--active-x');
      }
    }
  };

  const scrollTop = (amount = 0, hideThumb = false) => {
    if (ref.current) {

      if (!hideThumb) {
        ref.current.scrollTop = amount;
        return;
      }
      // Don't show scrollbar thumb after scroll
      const handleHideThumb = () => {
        ref.current?.classList.remove('ps--active-y');
        ref.current?.classList.remove('ps--scrolling-y');
      };
      ref.current.addEventListener('ps-scroll-y', handleHideThumb);
      ref.current.scrollTop = amount;
      setTimeout(() => { // setTimeout motivation: need to register event at least once before removing handler
        ref.current?.removeEventListener('ps-scroll-y', handleHideThumb);
      }, 0);
    }
  };

  return {
    ps,
    updateScroll,
    scrollTop
  };
};

export default usePerfectScrollbar;