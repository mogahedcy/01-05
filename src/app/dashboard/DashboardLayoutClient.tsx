'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import HeaderClient from './HeaderClient';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutClientProps {
  admin: { id: string; username: string };
  children: React.ReactNode;
}

export default function DashboardLayoutClient({ admin, children }: DashboardLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const navLinks = [
    {
      href: '/dashboard',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      label: 'نظرة عامة',
      hoverColor: 'hover:bg-blue-50 hover:text-blue-700',
      activeColor: 'bg-blue-50 text-blue-700'
    },
    {
      href: '/dashboard/projects',
      icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4',
      label: 'المشاريع',
      hoverColor: 'hover:bg-green-50 hover:text-green-700',
      activeColor: 'bg-green-50 text-green-700'
    },
    {
      href: '/dashboard/projects/add',
      icon: 'M12 4v16m8-8H4',
      label: 'إضافة مشروع',
      hoverColor: 'hover:bg-purple-50 hover:text-purple-700',
      activeColor: 'bg-purple-50 text-purple-700'
    },
    {
      href: '/dashboard/projects/analyze',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      label: 'تحليل المنافسين',
      hoverColor: 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700',
      activeColor: 'bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700',
      badge: 'AI',
      badgeColor: 'bg-gradient-to-r from-blue-500 to-cyan-500'
    },
    {
      href: '/dashboard/projects/analysis',
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      label: 'عرض التحليلات',
      hoverColor: 'hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-700',
      activeColor: 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700',
      badge: '📊',
      badgeColor: 'bg-gradient-to-r from-indigo-500 to-purple-500'
    },
    {
      href: '/dashboard/articles',
      icon: 'M6 2h9a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z M9 7h6M9 11h6M9 15h4',
      label: 'المقالات',
      hoverColor: 'hover:bg-indigo-50 hover:text-indigo-700',
      activeColor: 'bg-indigo-50 text-indigo-700'
    },
    {
      href: '/dashboard/articles/add',
      icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
      label: 'إضافة مقال',
      hoverColor: 'hover:bg-pink-50 hover:text-pink-700',
      activeColor: 'bg-pink-50 text-pink-700'
    },
    {
      href: '/dashboard/ai-agent',
      icon: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47-2.47a.75.75 0 00-1.06 0L12 15.5l-1.72-1.72a.75.75 0 00-1.06 0L5 14.5m14 0v4.25a2.25 2.25 0 01-2.25 2.25H7.25A2.25 2.25 0 015 18.75V14.5',
      label: 'توليد مقالات AI',
      hoverColor: 'hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700',
      activeColor: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700',
      badge: 'Groq',
      badgeColor: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    },
    {
      href: '/dashboard/faqs',
      icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      label: 'الأسئلة الشائعة',
      hoverColor: 'hover:bg-teal-50 hover:text-teal-700',
      activeColor: 'bg-teal-50 text-teal-700'
    },
    {
      href: '/dashboard/ai-faq',
      icon: 'M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z',
      label: 'توليد أسئلة AI',
      hoverColor: 'hover:bg-gradient-to-r hover:from-violet-50 hover:to-purple-50 hover:text-violet-700',
      activeColor: 'bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700',
      badge: 'Groq',
      badgeColor: 'bg-gradient-to-r from-violet-500 to-purple-500'
    },
    {
      href: '/dashboard/comments',
      icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
      label: 'التعليقات',
      hoverColor: 'hover:bg-amber-50 hover:text-amber-700',
      activeColor: 'bg-amber-50 text-amber-700'
    },
    {
      href: '/dashboard/seo-agent',
      icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      label: 'وكيل SEO الذكي',
      hoverColor: 'hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-purple-700',
      activeColor: 'bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700',
      badge: 'AI',
      badgeColor: 'bg-gradient-to-r from-purple-500 to-pink-500'
    },
    {
      href: '/dashboard/seo-health',
      icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      label: 'صحة SEO',
      hoverColor: 'hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700',
      activeColor: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700',
      badge: 'جديد',
      badgeColor: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    },
    {
      href: '/dashboard/automation',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z',
      label: 'الأتمتة الذكية',
      hoverColor: 'hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 hover:text-red-700',
      activeColor: 'bg-gradient-to-r from-red-50 to-rose-50 text-red-700',
      badge: 'تلقائي',
      badgeColor: 'bg-gradient-to-r from-red-500 to-rose-500'
    },
    {
      href: '/dashboard/indexing-status',
      icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9',
      label: 'حالة الأرشفة',
      hoverColor: 'hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 hover:text-cyan-700',
      activeColor: 'bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700',
      badge: 'NEW',
      badgeColor: 'bg-gradient-to-r from-cyan-500 to-blue-500'
    },
  ];

  const bottomLinks = [
    {
      href: '/portfolio',
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      label: 'معاينة الموقع',
      hoverColor: 'hover:bg-orange-50 hover:text-orange-700',
      target: '_blank',
      external: true
    },
    {
      href: '/dashboard/settings',
      icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
      label: 'الإعدادات',
      hoverColor: 'hover:bg-gray-50 hover:text-gray-900'
    }
  ];

  const NavLink = ({ link, onClick }: { link: any; onClick?: () => void }) => {
    const active = isActive(link.href);
    
    return (
      <Link
        href={link.href}
        target={link.target}
        onClick={onClick}
        className={`group flex items-center gap-3 rounded-xl px-3 md:px-4 py-2.5 md:py-3 text-sm md:text-base text-gray-700 transition-all duration-200 ${
          active ? link.activeColor || 'bg-blue-50 text-blue-700' : link.hoverColor
        }`}
      >
        <svg className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={link.icon} />
        </svg>
        <span className="font-medium truncate">{link.label}</span>
        {link.badge && (
          <span className={`mr-auto text-[10px] md:text-xs ${link.badgeColor} text-white px-1.5 md:px-2 py-0.5 md:py-1 rounded-full flex-shrink-0`}>
            {link.badge}
          </span>
        )}
        {link.external && (
          <svg className="w-3 h-3 md:w-4 md:h-4 opacity-50 group-hover:opacity-100 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        )}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100" dir="rtl">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static top-0 right-0 h-full w-[280px] sm:w-[320px] lg:w-64 xl:w-72 bg-white/95 backdrop-blur-sm shadow-lg z-50 transform transition-transform duration-300 overflow-y-auto ${
            isSidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 md:p-6 space-y-4 md:space-y-6 h-full flex flex-col">
            {/* Logo Section */}
            <div className="flex items-center gap-3 md:gap-4">
              <div className="relative">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <img src="/favicon.svg" alt="logo" className="w-5 h-5 md:w-6 md:h-6" />
                </div>
              </div>
              <div>
                <div className="font-bold text-lg md:text-xl text-gray-900">الديار العالمية</div>
                <div className="text-xs md:text-sm text-gray-500">مرحباً، {admin.username}</div>
              </div>
              {/* Close button for mobile */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="mr-auto p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
                aria-label="إغلاق القائمة"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 flex-1 overflow-y-auto">
              {navLinks.map((link) => (
                <NavLink key={link.href} link={link} onClick={() => setIsSidebarOpen(false)} />
              ))}

              <hr className="my-3 md:my-4 border-gray-200" />

              {bottomLinks.map((link) => (
                <NavLink key={link.href} link={link} onClick={() => setIsSidebarOpen(false)} />
              ))}
            </nav>

            {/* Footer */}
            <div className="pt-3 md:pt-4 border-t border-gray-200">
              <div className="text-[10px] md:text-xs text-gray-500 text-center">
                <div className="mb-1">© {new Date().getFullYear()} جميع الحقوق محفوظة</div>
                <div className="text-blue-600 font-medium">ديار جدة العالمية</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header with Hamburger - Always visible on mobile */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
            <div className="px-3 md:px-4 lg:px-6 py-3 md:py-4">
              <div className="flex items-center justify-between gap-3">
                {/* Hamburger Button - Mobile only */}
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="قائمة التنقل"
                >
                  <Menu className="w-5 h-5 md:w-6 md:h-6 text-gray-700" />
                </button>

                {/* Title */}
                <h1 className="text-base md:text-lg lg:text-xl font-bold text-gray-900 truncate flex-1 lg:flex-none">
                  لوحة التحكم المتقدمة
                </h1>

                {/* Logout Button */}
                <div suppressHydrationWarning>
                  <HeaderClient />
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-3 md:p-4 lg:p-6 overflow-auto">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
