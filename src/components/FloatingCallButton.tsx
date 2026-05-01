'use client';

import { Phone } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function FloatingCallButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <>
      {/* زر الاتصال العائم - للجوال فقط */}
      <Link
        href="tel:+966553719009"
        className={`fixed left-4 bottom-20 md:bottom-24 z-[60] bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full p-4 shadow-2xl hover:shadow-blue-500/50 transition-all duration-300 hover:scale-110 active:scale-95 lg:hidden ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'
        }`}
        aria-label="اتصل الآن"
      >
        <Phone className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
        </span>
      </Link>
    </>
  );
}
