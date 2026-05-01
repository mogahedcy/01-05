'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageCircle, X } from 'lucide-react';

export default function StickyWhatsApp() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* WhatsApp Button */}
      <div className="fixed bottom-20 right-4 z-[60] flex items-end gap-3">
        {/* Expanded Message */}
        {isExpanded && (
          <div className="bg-white rounded-2xl shadow-2xl p-4 max-w-xs animate-slide-in-left border-2 border-green-500">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-900">ديار جدة العالمية</p>
                  <p className="text-xs text-green-600">متصل الآن</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              مرحباً! كيف يمكننا مساعدتك اليوم؟
            </p>
            <Link
              href="https://wa.me/+966553719009"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-green-500 to-green-600 text-white text-center py-2.5 rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ابدأ المحادثة
            </Link>
          </div>
        )}

        {/* Main Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="group relative bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full p-4 shadow-2xl hover:shadow-green-500/50 hover:scale-110 transition-all duration-300 animate-bounce-slow"
          aria-label="تواصل عبر واتساب"
        >
          {/* Pulse Effect */}
          <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></span>
          
          {/* Icon */}
          <MessageCircle className="w-7 h-7 relative z-10" />
          
          {/* Notification Badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            1
          </span>
        </button>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s infinite;
        }
      `}</style>
    </>
  );
}
