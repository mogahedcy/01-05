import type { Metadata } from 'next';
import { Noto_Sans_Arabic } from "next/font/google";
import "../globals.css";

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'تسجيل الدخول | ديار جدة العالمية',
  robots: { index: false, follow: false },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`min-h-screen ${notoSansArabic.variable} antialiased font-arabic`}>
      {children}
    </div>
  );
}
