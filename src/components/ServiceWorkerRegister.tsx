'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';

export default function ServiceWorkerRegister() {
  const [showUpdateNotification, setShowUpdateNotification] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const locale = useLocale();
  
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production'
    ) {
      const version = '2024-12-07-v1';
      
      navigator.serviceWorker
        .register(`/sw.js?v=${version}`)
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);
          
          // Check for updates immediately
          registration.update();
          
          // Check for updates every 30 minutes
          setInterval(() => {
            registration.update();
          }, 30 * 60 * 1000);
          
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New version available - show notification instead of auto-reload
                  console.log('🔄 New version available!');
                  setWaitingWorker(newWorker);
                  setShowUpdateNotification(true);
                }
              });
            }
          });
          
          // Check if there's already a waiting worker
          if (registration.waiting) {
            setWaitingWorker(registration.waiting);
            setShowUpdateNotification(true);
          }
        })
        .catch((error) => {
          console.log('❌ Service Worker registration failed:', error);
        });
    }
  }, []);

  const handleUpdate = () => {
    if (waitingWorker) {
      // Tell the waiting service worker to skip waiting
      waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleDismiss = () => {
    setShowUpdateNotification(false);
  };

  if (!showUpdateNotification) return null;

  const isArabic = locale === 'ar';

  return (
    <div
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-[9999] 
                 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg shadow-2xl 
                 p-4 animate-slide-up border-2 border-primary-400/30"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-yellow-300 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-1">
            {isArabic ? '🎉 تحديث جديد متوفر!' : '🎉 New Update Available!'}
          </h3>
          <p className="text-sm text-white/90 mb-3">
            {isArabic
              ? 'تم إضافة تحسينات ومحتوى جديد. قم بالتحديث الآن للحصول على أحدث إصدار.'
              : 'New improvements and content added. Update now to get the latest version.'}
          </p>
          
          <div className="flex gap-2">
            <button
              onClick={handleUpdate}
              className="flex-1 bg-white text-primary-600 font-semibold py-2 px-4 rounded-lg 
                         hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg
                         transform hover:scale-105"
            >
              {isArabic ? '🔄 تحديث الآن' : '🔄 Update Now'}
            </button>
            
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-white/90 hover:text-white border border-white/30 
                         rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              {isArabic ? 'لاحقاً' : 'Later'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
