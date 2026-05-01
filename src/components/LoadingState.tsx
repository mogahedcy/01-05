'use client';

import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingState({
  message = 'جاري التحميل...',
  size = 'md',
  fullScreen = false,
  className = ''
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50'
    : 'w-full';

  return (
    <div
      className={`${containerClasses} flex items-center justify-center p-8 ${className}`}
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 
          className={`${sizeClasses[size]} text-primary animate-spin`}
          aria-hidden="true"
        />
        <p className={`${textSizeClasses[size]} text-muted-foreground font-medium`}>
          {message}
        </p>
      </div>
    </div>
  );
}

export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div 
      className={`loading-skeleton rounded-lg ${className}`}
      role="status"
      aria-label="جاري التحميل"
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
      <LoadingSkeleton className="h-64 w-full" />
      <div className="p-6 space-y-4">
        <LoadingSkeleton className="h-6 w-3/4" />
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-4 w-5/6" />
        <div className="flex gap-2">
          <LoadingSkeleton className="h-6 w-20" />
          <LoadingSkeleton className="h-6 w-20" />
        </div>
      </div>
    </div>
  );
}
