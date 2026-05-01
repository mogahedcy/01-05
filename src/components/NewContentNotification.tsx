'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { RefreshCw, X } from 'lucide-react';

interface ContentVersion {
  projectsCount: number;
  articlesCount: number;
  faqsCount: number;
  lastChecked: number;
}

const STORAGE_KEY = 'aldeyar_content_version';
const CHECK_INTERVAL = 60000; // Check every minute

export default function NewContentNotification() {
  const [showNotification, setShowNotification] = useState(false);
  const isCheckingRef = useRef(false);
  const isMountedRef = useRef(true);

  const getStoredVersion = useCallback((): ContentVersion | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const saveVersion = useCallback((version: ContentVersion) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(version));
    } catch {
      // Ignore storage errors
    }
  }, []);

  const checkForUpdates = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    try {
      const response = await fetch('/api/content-version', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!response.ok) {
        isCheckingRef.current = false;
        return;
      }

      const currentVersion = await response.json();
      
      if (!isMountedRef.current) {
        isCheckingRef.current = false;
        return;
      }

      const storedVersion = getStoredVersion();

      if (!storedVersion) {
        saveVersion({
          ...currentVersion,
          lastChecked: Date.now()
        });
        isCheckingRef.current = false;
        return;
      }

      const hasNewContent = 
        currentVersion.projectsCount > storedVersion.projectsCount ||
        currentVersion.articlesCount > storedVersion.articlesCount ||
        currentVersion.faqsCount > storedVersion.faqsCount;

      if (hasNewContent && isMountedRef.current) {
        setShowNotification(true);
      }

    } catch (error) {
      console.error('Error checking for updates:', error);
    } finally {
      isCheckingRef.current = false;
    }
  }, [getStoredVersion, saveVersion]);

  const handleRefresh = useCallback(() => {
    fetch('/api/content-version', { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then(res => res.json())
      .then(version => {
        saveVersion({
          ...version,
          lastChecked: Date.now()
        });
      })
      .catch(() => {});
    
    setShowNotification(false);
    window.location.reload();
  }, [saveVersion]);

  const handleDismiss = useCallback(() => {
    fetch('/api/content-version', { 
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then(res => res.json())
      .then(version => {
        saveVersion({
          ...version,
          lastChecked: Date.now()
        });
      })
      .catch(() => {});
    
    setShowNotification(false);
  }, [saveVersion]);

  useEffect(() => {
    isMountedRef.current = true;

    // Initial check after 3 seconds
    const timer = setTimeout(() => {
      checkForUpdates();
    }, 3000);

    // Periodic check every minute
    const interval = setInterval(() => {
      checkForUpdates();
    }, CHECK_INTERVAL);

    // Check when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkForUpdates();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      isMountedRef.current = false;
      clearTimeout(timer);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkForUpdates]);

  if (!showNotification) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-primary to-accent text-white rounded-xl shadow-2xl p-4 border border-white/20">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm mb-1">محتوى جديد متوفر!</h4>
            <p className="text-xs text-white/90 leading-relaxed">
              تمت إضافة مشاريع أو مقالات جديدة. قم بتحديث الصفحة للحصول على آخر المحتويات.
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-1.5 bg-white text-primary px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-white/90 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                تحديث الآن
              </button>
              <button
                onClick={handleDismiss}
                className="text-white/80 hover:text-white text-xs px-2 py-1.5 transition-colors"
              >
                لاحقاً
              </button>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
