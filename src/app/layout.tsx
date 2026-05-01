import type { Metadata } from 'next';
import { Noto_Sans_Arabic, Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import BottomNavigation from "@/components/BottomNavigation";
import FloatingCallButton from "@/components/FloatingCallButton";
import { ThemeProvider } from "@/components/theme-provider";

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  display: 'swap',
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.deyarsu.com'),
  title: {
    default: "ديار جدة العالمية | أفضل مظلات وبرجولات جدة",
    template: "%s | ديار جدة العالمية"
  },
  description: "الشركة الرائدة في جدة لتركيب المظلات والبرجولات والسواتر. خبرة 15 عاماً، ضمان 10 سنوات.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" data-scroll-behavior="smooth" className={`${notoSansArabic.variable} ${inter.variable}`} suppressHydrationWarning={true}>
      <head>
        <meta name="theme-color" content="#059669" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <style dangerouslySetInnerHTML={{__html: `
          :root{--background:40 25% 98%;--foreground:39 39% 21%;--primary:39 39% 21%;--accent:134 61% 41%;--border:40 35% 85%;--card:40 25% 98%;--card-foreground:39 39% 21%;--radius:0.5rem;}
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;border:0 solid hsl(var(--border));}
          html{height:100%;-webkit-text-size-adjust:100%;}
          body{height:100%;background:hsl(var(--background));color:hsl(var(--foreground));line-height:1.7;overflow-x:hidden;}
          img,video,svg{max-width:100%;height:auto;display:block;-webkit-user-select:none;user-select:none;}
          button,input,textarea,select{font:inherit;color:inherit;}
          a{color:inherit;text-decoration:none;}
          html[lang="en"]{direction:ltr;}
          html[lang="en"] body{direction:ltr;text-align:left;}
        `}} />
      </head>
      <body className="antialiased font-arabic pb-16 lg:pb-0" suppressHydrationWarning={true}>
        <ThemeProvider defaultTheme="light" storageKey="aldeyar-theme">
          <ClientBody>{children}</ClientBody>
        </ThemeProvider>
      </body>
    </html>
  );
}
