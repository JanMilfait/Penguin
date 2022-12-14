import ProfileProgress from 'features/auth/ProfileProgress';
import React, { useEffect } from 'react';
import Banner from './Banner';

const Sidebar = () => {
  const sidebarRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sidebarRef.current) return;
    sidebarRef.current.style.top = (sidebarRef.current.parentElement?.offsetTop ?? 104) + 'px';
  }, []);

  return (
    <div ref={sidebarRef} className="position-sticky">
      <ProfileProgress />
      <Banner />
    </div>
  );
};

export default Sidebar;