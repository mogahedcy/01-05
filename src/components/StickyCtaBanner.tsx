'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, X } from 'lucide-react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';

export default function StickyCtaBanner() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const locale = useLocale();
  const isRTL = locale === 'ar';

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      if (scrolled > 0.35 && !dismissed) {
        setVisible(true);
      } else if (scrolled <= 0.35) {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-3 sm:p-4"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <div className="max-w-3xl mx-auto bg-gray-900 rounded-2xl shadow-[0_-4px_30px_rgba(0,0,0,0.3)] border border-amber-500/30 overflow-hidden">
            {/* Glow line at top */}
            <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent" />

            <div className="flex items-center justify-between gap-3 px-4 py-3 sm:py-4">
              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm sm:text-base truncate">
                  {isRTL ? '🔥 استشارة مجانية + معاينة بدون تكلفة' : '🔥 Free consultation + free on-site visit'}
                </p>
                <p className="text-amber-400 text-xs font-semibold">
                  {isRTL ? 'اتصل الآن وابدأ مشروعك اليوم' : 'Call now and start your project today'}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Glowing WhatsApp button */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-400 rounded-xl blur opacity-60 group-hover:opacity-100 transition animate-pulse" />
                  <Link
                    href="https://wa.me/+966553719009"
                    className="relative flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 flex-shrink-0" />
                    <span className="hidden sm:inline">{isRTL ? 'واتساب' : 'WhatsApp'}</span>
                  </Link>
                </div>

                {/* Phone button */}
                <Link
                  href="tel:+966553719009"
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black px-4 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-lg shadow-amber-500/30"
                >
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{isRTL ? 'اتصل' : 'Call'}</span>
                </Link>

                {/* Dismiss button */}
                <button
                  onClick={() => setDismissed(true)}
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
