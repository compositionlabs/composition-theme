"use client";

import { ReactNode, useEffect, useState } from "react";

interface SnapSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function SnapSection({ children, className = "", id }: SnapSectionProps) {
  return (
    <section 
      id={id}
      className={`h-screen w-full snap-start snap-always ${className}`}
    >
      {children}
    </section>
  );
}

interface SnapContainerProps {
  children: ReactNode;
  className?: string;
}

export function SnapContainer({ children, className = "" }: SnapContainerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className={`${isMobile ? '' : 'snap-y snap-proximity'} overflow-y-scroll h-screen ${className}`}>
      {children}
    </div>
  );
}
