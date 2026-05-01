'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { Button } from './ui/button';
import { useTranslations } from 'next-intl';

interface ContentRefreshNotificationProps {
  lastUpdate: string; // ISO date string
  contentType: 'projects' | 'articles' | 'faqs' | 'reviews';
}

export default function ContentRefreshNotification({ 
  lastUpdate, 
  contentType 
}: ContentRefreshNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const t = useTranslations('contentRefresh');

  useEffect(() => {
    // Check localStorage for last seen update
    const storageKey = `last-seen-${contentType}`;
    const lastSeenUpdate = localStorage.getItem(storageKey);

    // First-time visitor: Store current timestamp but don't show notification
    if (!lastSeenUpdate) {
      localStorage.setItem(storageKey, new Date().toISOString());
      return;
    }

    // Returning visitor: Check if there's new content since their last visit
    if (new Date(lastSeenUpdate) < new Date(lastUpdate)) {
      // Wait 2 seconds before showing to avoid jarring experience
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [lastUpdate, contentType]);

  const handleRefresh = () => {
    // Update localStorage
    const storageKey = `last-seen-${contentType}`;
    localStorage.setItem(storageKey, new Date().toISOString());
    
    // Reload the page to show fresh content
    window.location.reload();
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowNotification(false);
    
    // Mark as seen
    const storageKey = `last-seen-${contentType}`;
    localStorage.setItem(storageKey, new Date().toISOString());
  };

  if (!showNotification || dismissed) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-primary to-accent text-white rounded-2xl shadow-2xl p-4 sm:p-6 max-w-md mx-4 border border-white/20">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">
              {t('title')}
            </h3>
            <p className="text-sm text-white/90 mb-4">
              {t(`message.${contentType}`)}
            </p>
            
            <div className="flex gap-2">
              <Button
                onClick={handleRefresh}
                size="sm"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90 font-semibold"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {t('refreshButton')}
              </Button>
              
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-white/10"
              >
                {t('dismissButton')}
              </Button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
            aria-label="Close notification"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
