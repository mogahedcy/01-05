import type { Metadata } from 'next';
import { Noto_Sans_Arabic } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "../globals.css";
import ClientBody from "../ClientBody";
import StructuredDataScript from "@/components/StructuredDataScript";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import BottomNavigation from "@/components/BottomNavigation";
import FloatingCallButton from "@/components/FloatingCallButton";
import { WebVitals } from "../web-vitals";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import { ThemeProvider } from "@/components/theme-provider";

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.deyarsu.com'),
};

export default async function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const messages = await getMessages({ locale: 'ar' });

  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" className={notoSansArabic.variable}>
      <head>
        <meta name="theme-color" content="#059669" />
        <meta name="google-site-verification" content="Ne3Na-oIDWC4Bg9C4hlb9fNtyvJED1iLI5A9fHnVTnc" />
        
        <style dangerouslySetInnerHTML={{__html: `
          :root{--background:40 25% 98%;--foreground:39 39% 21%;--primary:39 39% 21%;--accent:134 61% 41%;--border:40 35% 85%;--card:40 25% 98%;--card-foreground:39 39% 21%;--radius:0.5rem;}
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;border:0 solid hsl(var(--border));}
          html{height:100%;-webkit-text-size-adjust:100%;}
          body{height:100%;background:hsl(var(--background));color:hsl(var(--foreground));line-height:1.7;overflow-x:hidden;}
          img,video,svg{max-width:100%;height:auto;display:block;-webkit-user-select:none;user-select:none;}
          button,input,textarea,select{font:inherit;color:inherit;}
          a{color:inherit;text-decoration:none;}
          .hero-section{min-height:600px;}
        `}} />
        
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com'} />
        <link rel="dns-prefetch" href={process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com'} />
        
        <LocalBusinessSchema />
      </head>
      <body className="antialiased font-arabic pb-16 lg:pb-0" suppressHydrationWarning={true}>
        <NextIntlClientProvider messages={messages} locale="ar">
          <ThemeProvider defaultTheme="light" storageKey="aldeyar-theme">
            <GoogleAnalytics />
            <ServiceWorkerRegister />
            <WebVitals />
            <ClientBody>{children}</ClientBody>
            <WhatsAppWidget />
            <FloatingCallButton />
            <BottomNavigation />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
