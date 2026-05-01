'use client';

import { Share2 } from 'lucide-react';

interface ShareButtonProps {
  title: string;
  text: string;
}

export default function ShareButton({ title, text }: ShareButtonProps) {
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url
        });
      } catch (error) {
        await navigator.clipboard.writeText(url);
        alert('تم نسخ الرابط!');
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('تم نسخ الرابط!');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      aria-label="مشاركة"
    >
      <Share2 className="w-4 h-4" />
    </button>
  );
}
