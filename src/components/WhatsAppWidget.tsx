'use client';

import { MessageCircle, X } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  
  const whatsappNumber = '+966553719009';
  const defaultMessage = 'السلام عليكم، أرغب في الاستفسار عن خدماتكم';
  const whatsappURL = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(defaultMessage)}`;

  const quickMessages = [
    { id: 1, text: 'طلب عرض سعر', message: 'السلام عليكم، أريد طلب عرض سعر مفصل' },
    { id: 2, text: 'استفسار عن المظلات', message: 'السلام عليكم، أريد الاستفسار عن مظلات السيارات' },
    { id: 3, text: 'استفسار عن البرجولات', message: 'السلام عليكم، أريد الاستفسار عن البرجولات' },
    { id: 4, text: 'حجز موعد معاينة', message: 'السلام عليكم، أريد حجز موعد لمعاينة الموقع' },
  ];

  const handleQuickMessage = (message: string) => {
    const url = `https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const dismissTooltip = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-50 flex flex-col items-end gap-4">
        {isOpen && (
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">ديار جدة العالمية</h3>
                  <p className="text-sm text-gray-600">متصل الآن</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
                aria-label="إغلاق"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-700 mb-4">
              مرحباً! كيف يمكننا مساعدتك اليوم؟
            </p>
            
            <div className="space-y-2 mb-4">
              {quickMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleQuickMessage(msg.message)}
                  className="w-full text-right p-3 rounded-lg bg-gray-50 hover:bg-green-50 hover:border-green-200 border border-gray-200 text-sm text-gray-700 hover:text-green-700 transition-all"
                >
                  {msg.text}
                </button>
              ))}
            </div>
            
            <Link
              href={whatsappURL}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-center py-3 rounded-lg font-medium transition-all"
            >
              فتح محادثة واتساب
            </Link>
          </div>
        )}

        <div className="relative">
          {showTooltip && !isOpen && (
            <div className="absolute bottom-full left-0 mb-3 bg-gray-900 text-white text-sm py-2 px-4 rounded-lg shadow-lg whitespace-nowrap animate-bounce">
              هل تحتاج مساعدة؟ تواصل معنا!
              <button
                onClick={dismissTooltip}
                className="mr-2 text-gray-300 hover:text-white"
                aria-label="إخفاء"
              >
                ×
              </button>
              <div className="absolute top-full left-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
            </div>
          )}
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="فتح واتساب"
          >
            {isOpen ? (
              <X className="w-8 h-8 text-white" />
            ) : (
              <MessageCircle className="w-8 h-8 text-white" />
            )}
          </button>
        </div>
      </div>
    </>
  );
}
