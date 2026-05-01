import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import StructuredDataScript from "@/components/StructuredDataScript";
import { WebVitals } from "../web-vitals";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import LocalBusinessSchema from "@/components/LocalBusinessSchema";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import BottomNavigation from "@/components/BottomNavigation";
import FloatingCallButton from "@/components/FloatingCallButton";
import CacheClearNotification from "@/components/CacheClearNotification";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  
  const isArabic = locale === 'ar';
  
  return {
    metadataBase: new URL('https://www.deyarsu.com'),
    title: {
      default: isArabic 
        ? "ديار جدة العالمية | أفضل مظلات وبرجولات جدة - خبرة 15 عام"
        : "Deyar Jeddah | Best Shades & Pergolas in Jeddah - 15 Years Experience",
      template: isArabic ? "%s | ديار جدة العالمية" : "%s | Deyar Jeddah"
    },
    description: isArabic
      ? "الشركة الرائدة في جدة لتركيب المظلات والبرجولات والسواتر. خبرة 15 عاماً، ضمان 10 سنوات، تركيب احترافي، أسعار منافسة."
      : "The leading company in Jeddah for installing shades, pergolas, and fences. 15 years of experience, 10-year warranty, professional installation, competitive prices.",
    keywords: isArabic
      ? "مظلات سيارات جدة، تركيب مظلات وسواتر، أفضل شركة برجولات، سواتر شينكو، تنسيق حدائق مودرن، أسعار المظلات 2024، شركة ديار جدة، حداد مظلات جدة، مظلات لكسان، بيوت شعر ملكي"
      : "Jeddah car shades, shade and fence installation, best pergola company, modern landscaping, shade prices 2024, Deyar Jeddah company",
    authors: [{ name: isArabic ? "ديار جدة العالمية" : "Deyar Jeddah" }],
    robots: "index, follow",
    alternates: {
      canonical: locale === 'ar' ? '/' : '/en',
      languages: {
        "ar": "/",
        "en": "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      title: isArabic 
        ? "ديار جدة العالمية - خدمات شاملة في جدة"
        : "Deyar Jeddah - Comprehensive Services in Jeddah",
      description: isArabic
        ? "شركة متخصصة في المظلات، البرجولات، السواتر، وتنسيق الحدائق في جدة"
        : "Specialized company in shades, pergolas, fences, and landscaping in Jeddah",
      url: "https://www.deyarsu.com",
      siteName: isArabic ? "ديار جدة العالمية" : "Deyar Jeddah",
      locale: isArabic ? "ar_SA" : "en_US",
      type: "website",
      images: [
        {
          url: "https://www.deyarsu.com/images/slider1.webp",
          width: 1200,
          height: 630,
          alt: isArabic ? "ديار جدة العالمية - مظلات وبرجولات جدة" : "Deyar Jeddah - Shades and Pergolas Jeddah",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: isArabic ? "ديار جدة العالمية" : "Deyar Jeddah",
      description: isArabic 
        ? "خدمات شاملة في المظلات والبرجولات والسواتر في جدة"
        : "Comprehensive services in shades, pergolas, and fences in Jeddah",
      images: ["https://www.deyarsu.com/images/slider1.webp"],
    },
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      ],
      shortcut: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    manifest: "/manifest.json",
  };
}

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "ما هي الخدمات التي تقدمها شركة ديار جدة العالمية؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "نقدم 8 خدمات متخصصة شاملة: مظلات سيارات، برجولات حدائق، سواتر خصوصية، ساندوتش بانل، ترميم ملحقات، تنسيق حدائق، بيوت شعر تراثية، وخيام ملكية."
      }
    },
    {
      "@type": "Question",
      "name": "كم تبلغ مدة الضمان على مظلات السيارات؟",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "نقدم ضمان شامل لمدة 10 سنوات على جميع مظلات السيارات، يشمل الهيكل المعدني والقماش والتركيب."
      }
    }
  ]
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  const isEnglish = locale === 'en';

  return (
    <NextIntlClientProvider messages={messages}>
      {isEnglish && (
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.lang='en';document.documentElement.dir='ltr';document.body.style.direction='ltr';document.body.style.textAlign='left';`
          }}
        />
      )}
      <StructuredDataScript data={faqPageSchema} />
      <LocalBusinessSchema locale={locale} />
      <GoogleAnalytics />
      <ServiceWorkerRegister />
      <WebVitals />
      {children}
      <CacheClearNotification locale={locale} />
      <WhatsAppWidget />
      <FloatingCallButton />
      <BottomNavigation />
    </NextIntlClientProvider>
  );
}
