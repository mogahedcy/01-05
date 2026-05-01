'use client';

import { type ReactNode, useEffect } from 'react';

interface ProtectedMediaProps {
  children: ReactNode;
  className?: string;
}

export default function ProtectedMedia({ children, className = '' }: ProtectedMediaProps) {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    const handleSelectStart = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'IMG' || target.tagName === 'VIDEO') {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('selectstart', handleSelectStart);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('selectstart', handleSelectStart);
    };
  }, []);

  return (
    <div 
      className={`${className} select-none`}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
      onDragStart={(e) => {
        e.preventDefault();
        return false;
      }}
    >
      {children}
    </div>
  );
}
