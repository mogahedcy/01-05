'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface PerformanceOptimizerProps {
  children?: React.ReactNode;
}

// Image cache management
class ImageCache {
  private cache = new Map<string, HTMLImageElement>();
  private loadingSet = new Set<string>();

  async preloadImage(src: string): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return this.cache.get(src)!;
    }

    if (this.loadingSet.has(src)) {
      return new Promise((resolve) => {
        const checkLoaded = () => {
          if (this.cache.has(src)) {
            resolve(this.cache.get(src)!);
          } else {
            setTimeout(checkLoaded, 50);
          }
        };
        checkLoaded();
      });
    }

    this.loadingSet.add(src);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.cache.set(src, img);
        this.loadingSet.delete(src);
        resolve(img);
      };
      img.onerror = () => {
        this.loadingSet.delete(src);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  }

  preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
    return Promise.all(urls.map(url => this.preloadImage(url)));
  }

  clearCache(): void {
    this.cache.clear();
    this.loadingSet.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

// Global image cache instance
export const imageCache = new ImageCache();

// Performance monitoring
class PerformanceMonitor {
  private metrics = {
    navigationStart: 0,
    loadComplete: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0
  };

  constructor() {
    this.initializeMetrics();
  }

  private initializeMetrics() {
    if (typeof window === 'undefined') return;

    this.metrics.navigationStart = performance.timeOrigin;

    // Load complete
    window.addEventListener('load', () => {
      this.metrics.loadComplete = performance.now();
    });
  }

  getMetrics() {
    return { ...this.metrics };
  }

  logMetrics() {
    // Metrics logging disabled in production - only log in development if needed
    if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && (window as Window & { DEBUG_PERFORMANCE?: boolean }).DEBUG_PERFORMANCE) {
      // eslint-disable-next-line no-console
      console.group('🚀 Performance Metrics');
      // eslint-disable-next-line no-console
      console.log('Load Complete:', this.metrics.loadComplete.toFixed(2), 'ms');
      // eslint-disable-next-line no-console
      console.log('Image Cache Size:', imageCache.getCacheSize());
      // eslint-disable-next-line no-console
      console.groupEnd();
    }
  }
}

// Memory management
class MemoryManager {
  private cleanup: (() => void)[] = [];

  addCleanup(fn: () => void) {
    this.cleanup.push(fn);
  }

  performCleanup() {
    this.cleanup.forEach(fn => fn());
    this.cleanup = [];
  }

  monitorMemory() {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
      if (!memory) return;
      
      const used = memory.usedJSHeapSize / 1048576; // MB
      const total = memory.totalJSHeapSize / 1048576; // MB
      const limit = memory.jsHeapSizeLimit / 1048576; // MB

      // Memory logging disabled - only log in development with DEBUG flag
      if (process.env.NODE_ENV === 'development' && (window as Window & { DEBUG_PERFORMANCE?: boolean }).DEBUG_PERFORMANCE) {
        // eslint-disable-next-line no-console
        console.log(`Memory: ${used.toFixed(2)}MB / ${total.toFixed(2)}MB (Limit: ${limit.toFixed(2)}MB)`);
      }

      // Auto cleanup if memory usage is high
      if (used / limit > 0.8) {
        this.performCleanup();
        imageCache.clearCache();
      }
    }
  }
}

// Global instances
export const performanceMonitor = new PerformanceMonitor();
export const memoryManager = new MemoryManager();

// Resource preloader
export const preloadCriticalResources = (resources: string[]) => {
  if (typeof window === 'undefined') return;

  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    let hasValidAsValue = false;

    if (resource.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i)) {
      link.as = 'image';
      hasValidAsValue = true;
      if (!resource.match(/\.svg$/i)) {
        imageCache.preloadImage(resource);
      }
    } else if (resource.match(/\.(woff|woff2|ttf|otf)$/i)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
      hasValidAsValue = true;
    } else if (resource.match(/\.css$/i)) {
      link.as = 'style';
      hasValidAsValue = true;
    } else if (resource.match(/\.js$/i)) {
      link.as = 'script';
      hasValidAsValue = true;
    }

    if (hasValidAsValue) {
      document.head.appendChild(link);
    }
  });
};

// Virtualization helper for large lists
export const useVirtualization = <T,>(items: T[], containerHeight: number, itemHeight: number) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);

  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleCount + 1, items.length);
  const visibleItems = items.slice(startIndex, endIndex);

  const totalHeight = items.length * itemHeight;
  const offsetY = startIndex * itemHeight;

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  return {
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    setContainerRef
  };
};

interface PerformanceMetrics {
  fcp: number;
  lcp: number;
  cls: number;
  inp: number;
  ttfb: number;
  loadComplete: number;
}

export default function PerformanceOptimizer({ children }: PerformanceOptimizerProps) {
  const router = useRouter();
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fcp: 0,
    lcp: 0,
    cls: 0,
    inp: 0,
    ttfb: 0,
    loadComplete: 0
  });
  const [isClient, setIsClient] = useState(false);
  const loadStartTimeRef = useRef(0);

  useEffect(() => {
    setIsClient(true);
    loadStartTimeRef.current = performance.now();
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const handleLoad = () => {
      const loadTime = performance.now() - loadStartTimeRef.current;
      setMetrics(prev => ({ ...prev, loadComplete: loadTime }));
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, [isClient]);

  useEffect(() => {
    if (!isClient) return;

    // Performance logging disabled in production - controlled by DEBUG flag
    const logPerformance = () => {
      if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && (window as Window & { DEBUG_PERFORMANCE?: boolean }).DEBUG_PERFORMANCE) {
        // eslint-disable-next-line no-console
        console.group('🚀 Performance Metrics');
        // eslint-disable-next-line no-console
        console.log('Load Complete:', metrics.loadComplete.toFixed(2), 'ms');
        // eslint-disable-next-line no-console
        console.log('Image Cache Size:', imageCache.getCacheSize());
        // eslint-disable-next-line no-console
        console.groupEnd();
      }
    };

    if (metrics.loadComplete > 0) {
      logPerformance();
    }
  }, [metrics, isClient]);

  useEffect(() => {
    if (!isClient) return;

    // Monitor memory usage
    const monitorMemory = () => {
      if ('memory' in performance) {
        const memory = (performance as { memory?: { usedJSHeapSize: number; totalJSHeapSize: number; jsHeapSizeLimit: number } }).memory;
        if (!memory) return;
        
        const used = (memory.usedJSHeapSize / 1024 / 1024).toFixed(2);
        const total = (memory.totalJSHeapSize / 1024 / 1024).toFixed(2);
        const limit = (memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2);

        // Memory logging disabled - controlled by DEBUG flag
        if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && (window as Window & { DEBUG_PERFORMANCE?: boolean }).DEBUG_PERFORMANCE) {
          // eslint-disable-next-line no-console
          console.log(`Memory: ${used}MB / ${total}MB (Limit: ${limit}MB)`);
        }

        // Auto cleanup if memory usage is high
        if (Number.parseFloat(used) / Number.parseFloat(limit) > 0.8) {
          memoryManager.performCleanup();
          imageCache.clearCache();
        }
      }
    };

    const memoryInterval = setInterval(monitorMemory, 30000);

    return () => clearInterval(memoryInterval);
  }, [isClient]);

  // Initialize performance monitoring on client-side
  useEffect(() => {
    if (!isClient) return;

    // Preload critical resources
    const criticalImages = [
      '/favicon.svg',
      '/favicon-16x16.png'
    ];
    preloadCriticalResources(criticalImages);

    // Log performance metrics after page load
    const timeout = setTimeout(() => {
      performanceMonitor.logMetrics();
    }, 3000);

    const handleScroll = () => {
      requestAnimationFrame(() => {
        // Additional scroll logic if needed
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      clearTimeout(timeout);
      window.removeEventListener('scroll', handleScroll);
      // Cleanup on unmount
      memoryManager.performCleanup();
    };
  }, [isClient]);

  return <>{children || null}</>;
}