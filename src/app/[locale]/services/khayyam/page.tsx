import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import BreadcrumbSchema from '@/components/BreadcrumbSchema';
import ReviewSchema from '@/components/ReviewSchema';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  generateServiceSchema, 
  generateFAQSchema,
} from '@/lib/seo-utils';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

import {
  Crown,
  Shield,
  Star,
  Users,
  CheckCircle,
  Phone,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Plus,
  Eye,
  Award,
  Clock,
  MapPin,
  Zap,
  Heart,
  Gift,
  Sparkles
} from 'lucide-react';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'khayyam' });
  
  const isArabic = locale === 'ar';
  const baseUrl = 'https://www.deyarsu.com';
  const pageUrl = '/services/khayyam';
  const canonicalPath = isArabic ? pageUrl : `/en${pageUrl}`;
  const pageImage = 'https://ext.same-assets.com/200922472/870035748.jpeg';
  
  return {
    title: t('pageTitle'),
    description: t('pageDescription'),
    keywords: t('keywords'),
    authors: [{ name: isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah' }],
    robots: 'index, follow',
    alternates: {
      canonical: `${baseUrl}${canonicalPath}`,
      languages: {
        'ar': `${baseUrl}${pageUrl}`,
        'en': `${baseUrl}/en${pageUrl}`,
        'x-default': `${baseUrl}${pageUrl}`,
      },
    },
    openGraph: {
      title: t('pageTitle'),
      description: t('pageDescription'),
      url: `${baseUrl}${canonicalPath}`,
      siteName: isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah',
      type: 'website',
      locale: isArabic ? 'ar_SA' : 'en_US',
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: isArabic ? 'خيام ملكية جدة - ديار جدة العالمية' : 'Royal Tents Jeddah - Deyar Jeddah',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('pageTitle'),
      description: t('pageDescription'),
      images: [pageImage],
    },
  };
}

const tentTypes = [
  {
    id: 'royalLuxury',
    image: 'https://ext.same-assets.com/200922472/870035748.jpeg',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    id: 'weddingEvents',
    image: 'https://ext.same-assets.com/200922472/3473190553.jpeg',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600'
  },
  {
    id: 'mourning',
    image: 'https://ext.same-assets.com/200922472/1836008776.jpeg',
    bgColor: 'bg-gray-50',
    iconColor: 'text-gray-600'
  },
  {
    id: 'vip',
    image: 'https://ext.same-assets.com/200922472/1549714147.jpeg',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600'
  }
];

const whyChooseUsFeatures = [
  {
    id: 'royalDesigns',
    icon: Crown,
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600'
  },
  {
    id: 'importedMaterials',
    icon: Sparkles,
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-600'
  },
  {
    id: 'team',
    icon: Users,
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600'
  },
  {
    id: 'fastExecution',
    icon: Zap,
    bgColor: 'bg-yellow-50',
    iconColor: 'text-yellow-600'
  },
  {
    id: 'customerService',
    icon: Heart,
    bgColor: 'bg-red-50',
    iconColor: 'text-red-600'
  },
  {
    id: 'packages',
    icon: Gift,
    bgColor: 'bg-green-50',
    iconColor: 'text-green-600'
  }
];

const galleryImages = [
  {
    id: 1,
    src: 'https://ext.same-assets.com/200922472/1754028587.jpeg',
    titleAr: 'خيمة ملكية فاخرة',
    titleEn: 'Luxury Royal Tent',
    categoryAr: 'خيام ملكية',
    categoryEn: 'Royal Tents',
    descriptionAr: 'خيمة ملكية بتصميم فاخر وديكورات داخلية مميزة',
    descriptionEn: 'Royal tent with luxurious design and distinctive interior decorations'
  },
  {
    id: 2,
    src: 'https://ext.same-assets.com/200922472/3473190553.jpeg',
    titleAr: 'خيمة أفراح أنيقة',
    titleEn: 'Elegant Wedding Tent',
    categoryAr: 'خيام أفراح',
    categoryEn: 'Wedding Tents',
    descriptionAr: 'خيمة زفاف بتصميم رومانسي وإضاءة ساحرة',
    descriptionEn: 'Wedding tent with romantic design and charming lighting'
  },
  {
    id: 3,
    src: 'https://ext.same-assets.com/200922472/1836008776.jpeg',
    titleAr: 'خيمة مناسبات',
    titleEn: 'Event Tent',
    categoryAr: 'خيام مناسبات',
    categoryEn: 'Event Tents',
    descriptionAr: 'خيمة مناسبات بمساحة واسعة وتجهيزات كاملة',
    descriptionEn: 'Event tent with spacious area and complete equipment'
  },
  {
    id: 4,
    src: 'https://ext.same-assets.com/200922472/1549714147.jpeg',
    titleAr: 'خيمة VIP حصرية',
    titleEn: 'Exclusive VIP Tent',
    categoryAr: 'خيام VIP',
    categoryEn: 'VIP Tents',
    descriptionAr: 'خيمة VIP بمواصفات استثنائية وتجهيزات فاخرة',
    descriptionEn: 'VIP tent with exceptional specifications and luxurious equipment'
  },
  {
    id: 5,
    src: 'https://ext.same-assets.com/200922472/1202963034.jpeg',
    titleAr: 'خيمة بتصميم عصري',
    titleEn: 'Modern Design Tent',
    categoryAr: 'خيام عصرية',
    categoryEn: 'Modern Tents',
    descriptionAr: 'خيمة بتصميم عصري يجمع بين الأصالة والحداثة',
    descriptionEn: 'Tent with modern design combining authenticity and modernity'
  },
  {
    id: 6,
    src: 'https://ext.same-assets.com/200922472/1656897895.jpeg',
    titleAr: 'خيمة بديكورات فاخرة',
    titleEn: 'Tent with Luxurious Decorations',
    categoryAr: 'خيام فاخرة',
    categoryEn: 'Luxury Tents',
    descriptionAr: 'خيمة بديكورات داخلية فاخرة وإضاءة مميزة',
    descriptionEn: 'Tent with luxurious interior decorations and distinctive lighting'
  },
  {
    id: 7,
    src: 'https://ext.same-assets.com/200922472/2436778414.jpeg',
    titleAr: 'خيمة بإضاءة مبتكرة',
    titleEn: 'Tent with Innovative Lighting',
    categoryAr: 'خيام مضيئة',
    categoryEn: 'Illuminated Tents',
    descriptionAr: 'خيمة بنظام إضاءة مبتكر ومميز',
    descriptionEn: 'Tent with innovative and distinctive lighting system'
  },
  {
    id: 8,
    src: 'https://ext.same-assets.com/200922472/1287770187.jpeg',
    titleAr: 'خيمة بتصميم فريد',
    titleEn: 'Tent with Unique Design',
    categoryAr: 'خيام مميزة',
    categoryEn: 'Distinguished Tents',
    descriptionAr: 'خيمة بتصميم فريد ومبتكر للمناسبات الخاصة',
    descriptionEn: 'Tent with unique and innovative design for special occasions'
  }
];

const testimonials = [
  {
    id: 1,
    nameAr: 'عبدالله السعودي',
    nameEn: 'Abdullah Al-Saudi',
    roleAr: 'منظم مناسبات - حي الروضة',
    roleEn: 'Event Organizer - Al Rawdah District',
    contentAr: 'خيام ملكية بجودة استثنائية وخدمة احترافية. تم تنفيذ حفل زفاف ابنتي بشكل مثالي والضيوف كانوا معجبين جداً بالتصميم والتنظيم.',
    contentEn: 'Royal tents with exceptional quality and professional service. My daughter\'s wedding was executed perfectly and guests were very impressed with the design and organization.',
    rating: 5
  },
  {
    id: 2,
    nameAr: 'فاطمة المحمدي',
    nameEn: 'Fatima Al-Mohammadi',
    roleAr: 'صاحبة قاعة أفراح - حي النعيم',
    roleEn: 'Wedding Hall Owner - Al Naeem District',
    contentAr: 'تعاملت مع ديار جدة العالمية في عدة مناسبات. دائماً ما يقدمون خيام فاخرة بتصاميم مميزة وخدمة عملاء ممتازة. أنصح بهم بقوة.',
    contentEn: 'I have dealt with Deyar Jeddah on several occasions. They always provide luxurious tents with distinctive designs and excellent customer service. I highly recommend them.',
    rating: 5
  },
  {
    id: 3,
    nameAr: 'خالد الغامدي',
    nameEn: 'Khalid Al-Ghamdi',
    roleAr: 'رجل أعمال - شمال جدة',
    roleEn: 'Businessman - North Jeddah',
    contentAr: 'استأجرت خيمة VIP لمؤتمر شركتي. الخيمة كانت فاخرة جداً والتجهيزات التقنية متطورة. خدمة احترافية من البداية للنهاية.',
    contentEn: 'I rented a VIP tent for my company conference. The tent was very luxurious and the technical equipment was advanced. Professional service from start to finish.',
    rating: 5
  }
];

const faqs = [
  {
    questionAr: 'ما هي أنواع المناسبات المناسبة للخيام الملكية؟',
    questionEn: 'What types of events are suitable for royal tents?',
    answerAr: 'الخيام الملكية مناسبة لجميع المناسبات: حفلات الزفاف والخطوبة، الاحتفالات العائلية، المؤتمرات والندوات، المعارض التجارية، المناسبات الرسمية والحكومية، مجالس العزاء، الفعاليات الثقافية والرياضية، وحفلات التخرج.',
    answerEn: 'Royal tents are suitable for all occasions: weddings and engagements, family celebrations, conferences and seminars, trade exhibitions, official and government events, mourning gatherings, cultural and sports events, and graduation ceremonies.'
  },
  {
    questionAr: 'ما هي المساحات والسعات المتوفرة للخيام الملكية؟',
    questionEn: 'What sizes and capacities are available for royal tents?',
    answerAr: 'نوفر خيام بمساحات متنوعة تبدأ من 50 متر مربع (تتسع 30-50 شخص) وتصل إلى 2000 متر مربع أو أكثر (تتسع أكثر من 1000 شخص). يمكن تصميم الخيام حسب المساحة المتاحة والعدد المتوقع.',
    answerEn: 'We provide tents in various sizes starting from 50 square meters (capacity 30-50 people) up to 2000 square meters or more (capacity over 1000 people). Tents can be designed according to available space and expected number.'
  },
  {
    questionAr: 'ما هي التجهيزات والخدمات المشمولة مع الخيمة؟',
    questionEn: 'What equipment and services are included with the tent?',
    answerAr: 'نقدم خدمة شاملة تتضمن: التصميم والتركيب المحترف، الديكورات الداخلية الفاخرة، أنظمة الإضاءة المتطورة، أنظمة التكييف والتهوية، الأثاث الفاخر، السجاد والمفروشات، أنظمة الصوت والفيديو.',
    answerEn: 'We offer a comprehensive service including: professional design and installation, luxurious interior decorations, advanced lighting systems, air conditioning and ventilation systems, luxurious furniture, carpets and furnishings, sound and video systems.'
  },
  {
    questionAr: 'كم تبلغ مدة تركيب وفك الخيمة الملكية؟',
    questionEn: 'How long does it take to install and dismantle a royal tent?',
    answerAr: 'مدة التركيب تختلف حسب حجم الخيمة: الخيام الصغيرة (50-100 شخص): 4-6 ساعات، الخيام المتوسطة (100-300 شخص): 8-12 ساعة، الخيام الكبيرة (300+ شخص): 1-2 يوم.',
    answerEn: 'Installation time varies according to tent size: small tents (50-100 people): 4-6 hours, medium tents (100-300 people): 8-12 hours, large tents (300+ people): 1-2 days.'
  },
  {
    questionAr: 'ما هي تكلفة استئجار الخيام الملكية؟',
    questionEn: 'What is the cost of renting royal tents?',
    answerAr: 'تبدأ أسعار الخيام من 8,000 ريال وتختلف حسب: نوع الخيمة والتصميم، المساحة وعدد الضيوف، مستوى التجهيزات والديكورات، مدة الاستئجار، الموقع والمسافة.',
    answerEn: 'Tent prices start from 8,000 SAR and vary according to: tent type and design, area and number of guests, level of equipment and decorations, rental duration, location and distance.'
  },
  {
    questionAr: 'هل تقدمون خدمات إضافية مع الخيام؟',
    questionEn: 'Do you offer additional services with tents?',
    answerAr: 'نعم، نقدم خدمات إضافية شاملة: تنسيق الورود والديكورات، خدمة الأمن والحراسة، خدمة الضيافة والطعام، التصوير والفيديو، الموسيقى والفرق الشعبية، تنظيم الفعاليات والأنشطة.',
    answerEn: 'Yes, we offer comprehensive additional services: flower and decoration coordination, security and guard service, hospitality and food service, photography and video, music and folk bands, event and activity organization.'
  }
];

const relatedServices = [
  {
    id: 'mazallat',
    titleAr: 'المظلات',
    titleEn: 'Shades',
    descriptionAr: 'تصميم وتنفيذ مختلف أنواع المظلات للسيارات والحدائق والمسابح.',
    descriptionEn: 'Design and execution of various types of shades for cars, gardens and pools.',
    image: 'https://ext.same-assets.com/200922472/2205790480.jpeg',
    href: '/services/mazallat',
    featuresAr: ['مظلات سيارات', 'مظلات حدائق', 'مظلات مسابح'],
    featuresEn: ['Car Shades', 'Garden Shades', 'Pool Shades']
  },
  {
    id: 'sawater',
    titleAr: 'السواتر',
    titleEn: 'Fences',
    descriptionAr: 'تركيب سواتر بمختلف الأنواع والخامات لتوفير الخصوصية والحماية.',
    descriptionEn: 'Installation of various types and materials of fences for privacy and protection.',
    image: 'https://ext.same-assets.com/200922472/531069762.jpeg',
    href: '/services/sawater',
    featuresAr: ['سواتر قماش', 'سواتر حديد', 'سواتر خشبية'],
    featuresEn: ['Fabric Fences', 'Iron Fences', 'Wooden Fences']
  },
  {
    id: 'byoot-shaar',
    titleAr: 'بيوت شعر',
    titleEn: 'Hair Tents',
    descriptionAr: 'تصميم وتنفيذ بيوت شعر تراثية بتصاميم أصيلة وحديثة.',
    descriptionEn: 'Design and execution of traditional hair tents with authentic and modern designs.',
    image: 'https://ext.same-assets.com/200922472/60439396.jpeg',
    href: '/services/byoot-shaar',
    featuresAr: ['بيوت شعر تراثية', 'تصاميم عصرية', 'خامات أصيلة'],
    featuresEn: ['Traditional Hair Tents', 'Modern Designs', 'Authentic Materials']
  }
];

export default async function KhayyamPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'khayyam' });
  const isArabic = locale === 'ar';
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const localePath = locale === 'ar' ? '' : '/en';
  const baseUrl = 'https://www.deyarsu.com';
  const pageImage = 'https://ext.same-assets.com/200922472/870035748.jpeg';
  
  const breadcrumbItems = [
    { label: t('breadcrumb.services'), href: `${localePath}/#services` },
    { label: t('breadcrumb.khayyam'), href: `${localePath}/services/khayyam`, current: true }
  ];

  const whatsappMessage = isArabic 
    ? "السلام عليكم، أريد الاستفسار عن خدمة الخيام الملكية وطلب عرض سعر."
    : "Hello, I would like to inquire about royal tent service and request a quote.";
  const whatsappURL = `https://wa.me/966553719009?text=${encodeURIComponent(whatsappMessage)}`;

  const heroFeatures = [
    { icon: MapPin, text: t('hero.features.allAreas') },
    { icon: Clock, text: t('hero.features.warranty') },
    { icon: Star, text: t('hero.features.projects') }
  ];

  const stats = [
    { number: '1000+', label: t('stats.projects') },
    { number: '15+', label: t('stats.experience') },
    { number: '98%', label: t('stats.satisfaction') },
    { number: '24/7', label: t('stats.support') }
  ];

  const serviceSchema = generateServiceSchema({
    name: t('schema.serviceName'),
    description: t('schema.serviceDescription'),
    areaServed: isArabic ? 'جدة' : 'Jeddah',
    priceRange: '8000-20000',
    image: pageImage,
    url: '/services/khayyam'
  });

  const faqSchemaData = faqs.map(faq => ({
    question: isArabic ? faq.questionAr : faq.questionEn,
    answer: isArabic ? faq.answerAr : faq.answerEn
  }));

  const faqSchema = generateFAQSchema(faqSchemaData);

  const reviewSchemaData = {
    serviceName: t('schema.serviceName'),
    aggregateRating: {
      ratingValue: 4.9,
      reviewCount: 167
    }
  };

  // Generate ImageObject Schema for each gallery image
  const gallerySchemas = galleryImages.map((image, index) => ({
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": image.src,
    "url": image.src,
    "name": isArabic ? image.titleAr : image.titleEn,
    "description": isArabic ? image.descriptionAr : image.descriptionEn,
    "caption": isArabic ? image.descriptionAr : image.descriptionEn,
    "author": {
      "@type": "Organization",
      "name": isArabic ? "ديار جدة العالمية" : "Deyar Jeddah"
    },
    "copyrightHolder": {
      "@type": "Organization",
      "name": isArabic ? "ديار جدة العالمية" : "Deyar Jeddah"
    },
    "license": `${baseUrl}/terms`,
    "acquireLicensePage": `${baseUrl}/contact`,
    "creditText": isArabic ? "ديار جدة العالمية" : "Deyar Jeddah",
    "copyrightNotice": `© ${new Date().getFullYear()} ${isArabic ? "ديار جدة العالمية" : "Deyar Jeddah"}`,
    "keywords": isArabic 
      ? `خيام ملكية, ${image.categoryAr}, جدة, ديار جدة العالمية`
      : `royal tents, ${image.categoryEn}, Jeddah, Deyar Jeddah`,
    "position": index + 1
  }));

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems} locale={locale} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ReviewSchema {...reviewSchemaData} />
      {/* Individual ImageObject Schemas for gallery images */}
      {gallerySchemas.map((schema, index) => (
        <script
          key={`gallery-schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="min-h-screen bg-background">
        <Navbar />

        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-20 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="mb-8 flex justify-center">
                <Breadcrumb items={breadcrumbItems} />
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6 leading-tight">
                {t('hero.title')}{' '}
                <span className="text-purple-600">{t('hero.titleHighlight')}</span>
                <br />
                {t('hero.subtitle')}
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-4xl mx-auto leading-relaxed">
                {t('hero.description')}
              </p>

              <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm text-muted-foreground">
                {heroFeatures.map((feature) => (
                  <div key={feature.text} className="flex items-center space-x-2 space-x-reverse">
                    <feature.icon className="w-4 h-4 text-purple-600" />
                    <span>{feature.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <Link href="tel:+966553719009">
                  <Button size="lg" className="text-lg px-8 py-4 bg-purple-600 hover:bg-purple-700">
                    <Phone className="w-5 h-5 mr-2" />
                    {t('hero.callCta')}
                  </Button>
                </Link>
                <Link href={whatsappURL} target="_blank">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2 border-purple-600 text-purple-600 hover:bg-purple-50">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    {t('hero.whatsappCta')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute top-1/4 left-8 w-16 h-16 bg-purple-100 rounded-full blur-xl" />
          <div className="absolute bottom-1/4 right-8 w-20 h-20 bg-pink-100 rounded-full blur-xl" />
        </section>

        {/* Tent Types Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {t('tentTypes.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('tentTypes.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tentTypes.map((tent) => (
                <div
                  key={tent.id}
                  className="group hover:shadow-xl transition-all duration-300 bg-white rounded-2xl border border-gray-100 overflow-hidden"
                >
                  <div className={`${tent.bgColor} p-6 text-center relative`}>
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${tent.iconColor} rounded-full bg-white/80 mb-4`}>
                      <Crown className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-primary mb-2">{t(`tentTypes.${tent.id}.title`)}</h3>
                    <p className="text-sm text-gray-600">{t(`tentTypes.${tent.id}.capacity`)}</p>
                  </div>

                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={tent.image}
                      alt={t(`tentTypes.${tent.id}.title`)}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  <div className="p-6">
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {t(`tentTypes.${tent.id}.description`)}
                    </p>

                    <ul className="space-y-2 mb-4">
                      {(t.raw(`tentTypes.${tent.id}.features`) as string[]).map((feature: string, index: number) => (
                        <li key={`tent-feature-${index}`} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <div className="text-lg font-bold text-purple-600 mb-4">
                      {t(`tentTypes.${tent.id}.price`)}
                    </div>

                    <Link href={`${whatsappURL}&text=${encodeURIComponent(isArabic ? `أرغب في الحصول على معلومات عن ${t(`tentTypes.${tent.id}.title`)}` : `I would like information about ${t(`tentTypes.${tent.id}.title`)}`)}`} target="_blank">
                      <Button className="w-full group-hover:bg-purple-600 transition-colors">
                        {isArabic ? 'مزيد من المعلومات' : 'More Information'}
                        <ArrowIcon className="w-4 h-4 mr-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {t('whyChooseUs.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('whyChooseUs.subtitle')}
              </p>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                  <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {whyChooseUsFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div key={feature.id} className="group hover:shadow-xl transition-all duration-300 bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className={`${feature.bgColor} p-6 text-center relative`}>
                      <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.iconColor} rounded-full bg-white/80 mb-4`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-primary">{t(`whyChooseUs.features.${feature.id}.title`)}</h3>
                    </div>

                    <div className="p-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {t(`whyChooseUs.features.${feature.id}.description`)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Portfolio Gallery Section */}
        <section className="py-20 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {t('gallery.title')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {t('gallery.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {galleryImages.map((image) => (
                <div key={image.id} className="group relative overflow-hidden rounded-2xl bg-gray-200 aspect-square hover:shadow-xl transition-all duration-300">
                  <Image
                    src={image.src}
                    alt={isArabic ? image.titleAr : image.titleEn}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-bold text-sm mb-1">{isArabic ? image.titleAr : image.titleEn}</h3>
                    <p className="text-xs opacity-90 mb-2">{isArabic ? image.categoryAr : image.categoryEn}</p>
                    <p className="text-xs opacity-80 line-clamp-2">{isArabic ? image.descriptionAr : image.descriptionEn}</p>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link href={`${localePath}/portfolio`}>
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  {t('gallery.viewMore')}
                  <ArrowIcon className="w-4 h-4 mr-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {t('testimonials.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('testimonials.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={`testimonial-star-${testimonial.id}-${i}`} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{isArabic ? testimonial.contentAr : testimonial.contentEn}"
                  </p>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-primary font-bold text-lg">
                        {(isArabic ? testimonial.nameAr : testimonial.nameEn).charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary">{isArabic ? testimonial.nameAr : testimonial.nameEn}</h4>
                      <p className="text-sm text-muted-foreground">{isArabic ? testimonial.roleAr : testimonial.roleEn}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {t('faq.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('faq.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={`faq-${index}`} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-primary mb-3 flex items-start">
                      <div className="bg-purple-100 text-purple-600 rounded-full p-1 mr-3 mt-1 flex-shrink-0">
                        <Plus className="w-4 h-4" />
                      </div>
                      {isArabic ? faq.questionAr : faq.questionEn}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed pr-10">
                      {isArabic ? faq.answerAr : faq.answerEn}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Related Services Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                {t('relatedServices.title')}
              </h2>
              <p className="text-lg text-muted-foreground">
                {t('relatedServices.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedServices.map((service) => (
                <div key={service.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48">
                    <Image
                      src={service.image}
                      alt={isArabic ? service.titleAr : service.titleEn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-primary mb-3">{isArabic ? service.titleAr : service.titleEn}</h3>
                    <p className="text-muted-foreground mb-4">{isArabic ? service.descriptionAr : service.descriptionEn}</p>

                    <ul className="space-y-1 mb-6">
                      {(isArabic ? service.featuresAr : service.featuresEn).map((feature, index) => (
                        <li key={`related-feature-${index}`} className="flex items-center text-sm text-muted-foreground">
                          <CheckCircle className="w-3 h-3 text-green-600 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link href={`${localePath}${service.href}`}>
                      <Button className="w-full group-hover:bg-purple-600 transition-colors">
                        {isArabic ? 'عرض التفاصيل' : 'View Details'}
                        <ArrowIcon className="w-4 h-4 mr-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="tel:+966553719009">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4">
                  <Phone className="w-5 h-5 mr-2" />
                  {t('cta.callButton')}
                </Button>
              </Link>
              <Link href={whatsappURL} target="_blank">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-4">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('cta.whatsappButton')}
                </Button>
              </Link>
              <Link href={`${whatsappURL}&text=${encodeURIComponent(isArabic ? 'أرغب في الحصول على عرض سعر للخيام الملكية' : 'I would like to get a quote for royal tents')}`} target="_blank">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 text-lg px-8 py-4">
                  {t('cta.quoteButton')}
                  <ArrowIcon className="w-5 h-5 mr-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
}
