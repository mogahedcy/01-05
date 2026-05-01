'use client';

import { useState } from 'react';
import { Share2, Copy, MessageCircle, Send, LinkIcon, X, Check, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialShareProps {
  projectTitle: string;
  projectDescription: string;
  projectUrl: string;
  projectImage?: string;
  className?: string;
}

interface ShareOption {
  name: string;
  icon: React.ReactNode;
  color: string;
  url: string;
  action?: () => void;
}

export default function SocialShare({
  projectTitle,
  projectDescription,
  projectUrl,
  projectImage,
  className = ''
}: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const shareText = `${projectTitle} - ${projectDescription}`;
  const fullUrl = typeof window !== 'undefined' ? window.location.origin + projectUrl : projectUrl;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('فشل في نسخ الرابط:', error);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: projectTitle,
          text: projectDescription,
          url: fullUrl,
        });
        setIsOpen(false);
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('فشل في المشاركة:', error);
        }
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const shareOptions: ShareOption[] = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-green-500 hover:bg-green-600',
      url: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n\n${fullUrl}`)}`
    },
    {
      name: 'Telegram',
      icon: <Send className="w-5 h-5" />,
      color: 'bg-blue-500 hover:bg-blue-600',
      url: `https://t.me/share/url?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(shareText)}`
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-sky-500 hover:bg-sky-600',
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(fullUrl)}`
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`
    },
    {
      name: 'البريد الإلكتروني',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-gray-600 hover:bg-gray-700',
      url: `mailto:?subject=${encodeURIComponent(projectTitle)}&body=${encodeURIComponent(`${shareText}\n\n${fullUrl}`)}`
    },
    {
      name: 'نسخ الرابط',
      icon: copySuccess ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />,
      color: copySuccess ? 'bg-green-500' : 'bg-gray-500 hover:bg-gray-600',
      url: '',
      action: handleCopyLink
    }
  ];

  const handleShareClick = (option: ShareOption) => {
    if (option.action) {
      option.action();
    } else if (option.url) {
      window.open(option.url, '_blank', 'width=600,height=400');
    }

    // إغلاق القائمة بعد المشاركة (ما عدا نسخ الرابط)
    if (option.name !== 'نسخ الرابط') {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Share Button */}
      <Button
        variant="outline"
        onClick={handleNativeShare}
        className="flex items-center gap-2 hover:bg-primary hover:text-white transition-colors"
      >
        <Share2 className="w-4 h-4" />
        مشاركة
      </Button>

      {/* Share Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setIsOpen(false)}
          />

          {/* Share Options */}
          <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-200 p-4 min-w-[280px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">مشاركة المشروع</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Project Preview */}
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <div className="flex items-start gap-3">
                {projectImage && (
                  <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                    <img
                      src={projectImage}
                      alt={projectTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm truncate">{projectTitle}</h4>
                  <p className="text-xs text-gray-600 line-clamp-2">{projectDescription}</p>
                </div>
              </div>
            </div>

            {/* Share Options Grid */}
            <div className="grid grid-cols-2 gap-2">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={() => handleShareClick(option)}
                  className={`${option.color} text-white rounded-lg p-3 flex items-center gap-2 transition-colors text-sm font-medium`}
                >
                  {option.icon}
                  <span className="truncate">{option.name}</span>
                </button>
              ))}
            </div>

            {/* Success Message */}
            {copySuccess && (
              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg text-center">
                <p className="text-sm text-green-700">تم نسخ الرابط بنجاح!</p>
              </div>
            )}

            {/* Direct Link */}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <label className="block text-xs font-medium text-gray-700 mb-1">رابط المشروع:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fullUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                  className="px-3"
                >
                  {copySuccess ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
