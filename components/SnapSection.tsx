"use client";

import { ReactNode } from "react";

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
  return (
    <div className={`snap-y snap-proximity overflow-y-scroll h-screen ${className}`}>
      {children}
    </div>
  );
}
