'use client';

import { useEffect, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';

interface CacheClearNotificationProps {
  locale: string;
}

// قمنا بتغيير النظام من "مسح إجباري للكاش" إلى "نظام إصدارات" احترافي
// غيّر هذا الرقم كلما قمت بتحديث كبير في الموقع
const CURRENT_APP_VERSION = '1.1.0';

export default function CacheClearNotification({ locale }: CacheClearNotificationProps) {
  const [showNotification, setShowNotification] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // التحقق من رقم الإصدار المحفوظ لدى المستخدم
    const storedVersion = localStorage.getItem('aldeyar_app_version');
    
    if (!storedVersion || storedVersion !== CURRENT_APP_VERSION) {
      // إذا كان زائر جديد، فقط احفظ الإصدار ولا تزعجه
      if (!storedVersion) {
        localStorage.setItem('aldeyar_app_version', CURRENT_APP_VERSION);
      } else {
        // إذا كان زائر عائد وهناك تحديث جديد، أظهر الإشعار بعد ثانيتين
        setTimeout(() => {
          setShowNotification(true);
        }, 2000);
      }
    }
  }, []);

  const handleUpdate = async () => {
    setIsUpdating(true);
    
    try {
      // 1. تحديث رقم الإصدار في متصفح العميل
      localStorage.setItem('aldeyar_app_version', CURRENT_APP_VERSION);

      // 2. تحديث الـ Service Worker بلطف (بدون حذفه)
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.update();
        }
      }

      // 3. إعادة تحميل الصفحة لجلب الملفات الجديدة
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
    } catch (error) {
      console.error('Error updating app:', error);
      window.location.reload();
    }
  };

  const handleDismiss = () => {
    // إخفاء الإشعار مؤقتاً بدون حفظ الإصدار الجديد (سيظهر له مجدداً في الزيارة القادمة)
    setShowNotification(false);
  };

  if (!showNotification) return null;

  const messages = {
    ar: {
      title: 'تحديثات جديدة متاحة! 🎉',
      description: 'لقد قمنا بإضافة ميزات وتحسينات جديدة للموقع. انقر للتحديث الآن.',
      clearButton: 'تحديث الآن',
      laterButton: 'لاحقاً',
    },
    en: {
      title: 'New Updates Available! 🎉',
      description: 'We have added new features and improvements. Click to update now.',
      clearButton: 'Update Now',
      laterButton: 'Later',
    },
  };

  const msg = messages[locale as keyof typeof messages] || messages.ar;

  return (
    <div className="fixed bottom-20 left-4 right-4 lg:left-auto lg:right-6 lg:bottom-6 z-[9999] animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-2xl p-5 max-w-sm mx-auto lg:mx-0 border border-white/10">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="flex-shrink-0 mt-1">
            <div className="relative bg-white/20 p-2 rounded-full">
              <RotateCcw className={`w-6 h-6 ${isUpdating ? 'animate-spin' : ''}`} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg mb-1">
              {msg.title}
            </h3>
            <p className="text-sm text-blue-100 leading-relaxed mb-4">
              {msg.description}
            </p>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="flex-1 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <RotateCcw className="w-4 h-4 animate-spin" />
                    <span>{locale === 'ar' ? 'جاري التحديث...' : 'Updating...'}</span>
                  </>
                ) : (
                  msg.clearButton
                )}
              </button>
              <button
                onClick={handleDismiss}
                disabled={isUpdating}
                className="px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 hover:bg-white/10 active:scale-95 disabled:opacity-50"
              >
                {msg.laterButton}
              </button>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            disabled={isUpdating}
            className="flex-shrink-0 text-blue-200 hover:text-white transition-colors disabled:opacity-50 absolute top-3 right-3 lg:static"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
