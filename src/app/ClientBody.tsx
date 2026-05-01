'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

interface ClientBodyProps {
  children: React.ReactNode;
}

export default function ClientBody({ children }: ClientBodyProps) {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const PerformanceOptimizer = dynamic(() => import('@/components/PerformanceOptimizer'), {
    ssr: false,
    loading: () => null
  });

  const NewContentNotification = dynamic(() => import('@/components/NewContentNotification'), {
    ssr: false,
    loading: () => null
  });

  if (!isMounted) {
    return <div suppressHydrationWarning>{children}</div>;
  }

  return (
    <div suppressHydrationWarning>
      {children}
      <PerformanceOptimizer />
      {!isDashboard && <NewContentNotification />}
    </div>
  );
}
