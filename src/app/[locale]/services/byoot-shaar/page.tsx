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
  Star,
  Phone,
  MessageCircle,
  ArrowLeft,
  ArrowRight,
  Clock,
  Users,
  Award,
  Shield,
  Crown,
  Home,
  Building,
  TreePine,
  Check,
  Mail
} from 'lucide-react';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'byootShaar' });
  
  const isArabic = locale === 'ar';
  const baseUrl = 'https://www.deyarsu.com';
  const pageUrl = '/services/byoot-shaar';
  const canonicalPath = isArabic ? pageUrl : `/en${pageUrl}`;
  const pageImage = 'https://ext.same-assets.com/3073684241/1858852453.jpeg';
  
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
          alt: isArabic ? 'بيوت شعر جدة - ديار جدة العالمية' : 'Hair Tents Jeddah - Deyar Jeddah',
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

const byootShaarTypes = [
  {
    id: 'royal',
    image: 'https://ext.same-assets.com/3073684241/3661796902.jpeg',
    icon: Crown
  },
  {
    id: 'arabic',
    image: 'https://ext.same-assets.com/3073684241/566618696.jpeg',
    icon: Home
  },
  {
    id: 'majalis',
    image: 'https://ext.same-assets.com/3073684241/95813410.jpeg',
    icon: Building
  },
  {
    id: 'gardens',
    image: 'https://ext.same-assets.com/3073684241/1685504834.jpeg',
    icon: TreePine
  }
];

const galleryImages = [
  {
    id: 1,
    src: 'https://ext.same-assets.com/3073684241/1206832505.jpeg',
    titleAr: 'بيت شعر ملكي فاخر',
    titleEn: 'Luxurious Royal Hair Tent',
    categoryAr: 'بيوت شعر ملكية',
    categoryEn: 'Royal Hair Tents',
    descriptionAr: 'بيت شعر ملكي بتصميم فاخر ومواصفات عالية',
    descriptionEn: 'Royal hair tent with luxurious design and high specifications'
  },
  {
    id: 2,
    src: 'https://ext.same-assets.com/3073684241/642393919.jpeg',
    titleAr: 'بيت شعر عربي تقليدي',
    titleEn: 'Traditional Arabic Hair Tent',
    categoryAr: 'بيوت شعر عربية',
    categoryEn: 'Arabic Hair Tents',
    descriptionAr: 'بيت شعر بطراز عربي أصيل يحافظ على التراث',
    descriptionEn: 'Hair tent with authentic Arabic style preserving heritage'
  },
  {
    id: 3,
    src: 'https://ext.same-assets.com/3073684241/3714868902.jpeg',
    titleAr: 'بيت شعر للمجالس',
    titleEn: 'Majlis Hair Tent',
    categoryAr: 'بيوت شعر مجالس',
    categoryEn: 'Majlis Hair Tents',
    descriptionAr: 'بيت شعر واسع مصمم خصيصاً للمجالس',
    descriptionEn: 'Spacious hair tent specially designed for majlis'
  },
  {
    id: 4,
    src: 'https://ext.same-assets.com/3073684241/3316960675.jpeg',
    titleAr: 'بيت شعر للحدائق',
    titleEn: 'Garden Hair Tent',
    categoryAr: 'بيوت شعر حدائق',
    categoryEn: 'Garden Hair Tents',
    descriptionAr: 'بيت شعر مناسب للحدائق المنزلية',
    descriptionEn: 'Hair tent suitable for home gardens'
  },
  {
    id: 5,
    src: 'https://ext.same-assets.com/3073684241/1467360701.jpeg',
    titleAr: 'بيت شعر بتصميم عصري',
    titleEn: 'Modern Design Hair Tent',
    categoryAr: 'تصاميم عصرية',
    categoryEn: 'Modern Designs',
    descriptionAr: 'بيت شعر بتصميم عصري وأنيق',
    descriptionEn: 'Hair tent with modern and elegant design'
  },
  {
    id: 6,
    src: 'https://ext.same-assets.com/3073684241/2122556860.jpeg',
    titleAr: 'بيت شعر مع ديكورات فاخرة',
    titleEn: 'Hair Tent with Luxurious Decor',
    categoryAr: 'ديكورات داخلية',
    categoryEn: 'Interior Decorations',
    descriptionAr: 'بيت شعر مع ديكورات داخلية فاخرة',
    descriptionEn: 'Hair tent with luxurious interior decorations'
  },
  {
    id: 7,
    src: 'https://ext.same-assets.com/3073684241/2063912984.jpeg',
    titleAr: 'بيت شعر مع إضاءة مميزة',
    titleEn: 'Hair Tent with Distinctive Lighting',
    categoryAr: 'إضاءة مميزة',
    categoryEn: 'Distinctive Lighting',
    descriptionAr: 'بيت شعر مزود بإضاءة عصرية',
    descriptionEn: 'Hair tent with modern lighting'
  },
  {
    id: 8,
    src: 'https://ext.same-assets.com/3073684241/901478804.jpeg',
    titleAr: 'بيت شعر بتطريزات يدوية',
    titleEn: 'Hair Tent with Handmade Embroidery',
    categoryAr: 'تطريزات يدوية',
    categoryEn: 'Handmade Embroidery',
    descriptionAr: 'بيت شعر مزين بتطريزات يدوية أصيلة',
    descriptionEn: 'Hair tent decorated with authentic handmade embroidery'
  }
];

const testimonials = [
  {
    id: 1,
    nameAr: 'أحمد محمد الغامدي',
    nameEn: 'Ahmed Mohammed Al-Ghamdi',
    roleAr: 'صاحب مزرعة - حي الصفا',
    roleEn: 'Farm Owner - Al Safa District',
    contentAr: 'بيت شعر رائع وتنفيذ ممتاز. الجودة عالية جداً والفريق محترف. أنصح بشدة بالتعامل مع ديار جدة العالمية.',
    contentEn: 'Wonderful hair tent with excellent execution. Very high quality and professional team. I highly recommend dealing with Deyar Jeddah.',
    rating: 5
  },
  {
    id: 2,
    nameAr: 'فهد العتيبي',
    nameEn: 'Fahad Al-Otaibi',
    roleAr: 'مهندس - حي النزهة',
    roleEn: 'Engineer - Al Nuzha District',
    contentAr: 'أفضل شركة بيوت شعر في جدة. التصميم راقي والخدمة ممتازة. التزموا بالموعد والجودة فاقت التوقعات.',
    contentEn: 'Best hair tent company in Jeddah. Elegant design and excellent service. They met the deadline and quality exceeded expectations.',
    rating: 5
  },
  {
    id: 3,
    nameAr: 'محمد الأحمدي',
    nameEn: 'Mohammed Al-Ahmadi',
    roleAr: 'رجل أعمال - حي الروضة',
    roleEn: 'Businessman - Al Rawdah District',
    contentAr: 'تعامل راقي ومهني. بيت الشعر جاء بمواصفات عالية جداً وتسليم في الوقت المحدد. شكراً لكم.',
    contentEn: 'Elegant and professional dealings. The hair tent came with very high specifications and on-time delivery. Thank you.',
    rating: 5
  }
];

const faqs = [
  {
    questionAr: 'ما هي أنواع الأقمشة المستخدمة في بيوت الشعر؟',
    questionEn: 'What types of fabrics are used in hair tents?',
    answerAr: 'نستخدم أجود أنواع الأقمشة المخصصة لبيوت الشعر مثل القماش الكوري عالي الجودة، والقماش الكتاني المعالج، وأقمشة البولي إيثيلين المقاومة للماء والحرارة، والأقمشة المطرزة المصنوعة خصيصاً لبيوت الشعر الملكية.',
    answerEn: 'We use the finest fabrics designated for hair tents such as high-quality Korean fabric, treated linen fabric, polyethylene fabrics resistant to water and heat, and embroidered fabrics specially made for royal hair tents.'
  },
  {
    questionAr: 'كم تستغرق مدة تنفيذ بيت الشعر؟',
    questionEn: 'How long does it take to complete a hair tent?',
    answerAr: 'تختلف مدة التنفيذ حسب حجم المشروع وتفاصيل التصميم، ولكن بشكل عام تتراوح بين 10-20 يوم للمشاريع المتوسطة، وقد تصل إلى 30 يوم للمشاريع الكبيرة والملكية.',
    answerEn: 'Execution time varies depending on project size and design details, but generally ranges from 10-20 days for medium projects, and may reach 30 days for large and royal projects.'
  },
  {
    questionAr: 'هل يمكن تجهيز بيت الشعر بأنظمة تكييف وإضاءة؟',
    questionEn: 'Can the hair tent be equipped with air conditioning and lighting systems?',
    answerAr: 'نعم، نقدم خدمة تجهيز بيوت الشعر بأحدث أنظمة التكييف المركزي أو المنفصل، وأنظمة الإضاءة الداخلية والخارجية، وكافة التمديدات الكهربائية اللازمة.',
    answerEn: 'Yes, we offer service to equip hair tents with the latest central or split air conditioning systems, indoor and outdoor lighting systems, and all necessary electrical extensions.'
  },
  {
    questionAr: 'هل تقدمون خدمة الصيانة لبيوت الشعر؟',
    questionEn: 'Do you provide maintenance service for hair tents?',
    answerAr: 'نعم، نقدم خدمة صيانة دورية شاملة تشمل فحص الهيكل المعدني، وتنظيف وصيانة الأقمشة، واستبدال أي أجزاء تالفة، وصيانة أنظمة الإضاءة والتكييف.',
    answerEn: 'Yes, we provide comprehensive periodic maintenance service including inspection of the metal structure, cleaning and maintaining fabrics, replacing any damaged parts, and maintaining lighting and air conditioning systems.'
  },
  {
    questionAr: 'ما هي أحجام بيوت الشعر المتوفرة؟',
    questionEn: 'What sizes of hair tents are available?',
    answerAr: 'نوفر أحجام متنوعة تبدأ من 4×6 متر للحدائق المنزلية وتصل إلى 12×15 متر للمشاريع الكبيرة والملكية، مع إمكانية التصميم حسب المساحة المطلوبة.',
    answerEn: 'We provide various sizes starting from 4×6 meters for home gardens up to 12×15 meters for large and royal projects, with the ability to design according to required space.'
  },
  {
    questionAr: 'هل تقدمون ضمان على بيوت الشعر؟',
    questionEn: 'Do you provide warranty on hair tents?',
    answerAr: 'نعم، نقدم ضمان شامل لمدة 10 سنوات على الهيكل المعدني وضمان 5 سنوات على الأقمشة، مع خدمة صيانة مجانية للسنة الأولى.',
    answerEn: 'Yes, we provide a comprehensive 10-year warranty on the metal structure and a 5-year warranty on fabrics, with free maintenance service for the first year.'
  }
];

const relatedServices = [
  {
    titleAr: 'مظلات سيارات',
    titleEn: 'Car Shades',
    descriptionAr: 'تصميم وتنفيذ مظلات السيارات بأعلى معايير الجودة والمتانة',
    descriptionEn: 'Design and execution of car shades with highest quality and durability standards',
    image: 'https://ext.same-assets.com/3073684241/2205790480.jpeg',
    href: '/services/mazallat',
    featuresAr: ['مظلات PVC', 'مظلات حديدية', 'ضمان شامل'],
    featuresEn: ['PVC Shades', 'Iron Shades', 'Comprehensive Warranty']
  },
  {
    titleAr: 'خيام ملكية',
    titleEn: 'Royal Tents',
    descriptionAr: 'خيام ملكية فاخرة بتصاميم عصرية وأنيقة لجميع المناسبات',
    descriptionEn: 'Luxurious royal tents with modern and elegant designs for all occasions',
    image: 'https://ext.same-assets.com/3073684241/1914607147.jpeg',
    href: '/services/khayyam',
    featuresAr: ['خيام أفراح', 'خيام استراحات', 'خيام مناسبات'],
    featuresEn: ['Wedding Tents', 'Rest House Tents', 'Event Tents']
  },
  {
    titleAr: 'السواتر',
    titleEn: 'Fences',
    descriptionAr: 'سواتر عالية الجودة لحماية الخصوصية والأمان',
    descriptionEn: 'High-quality fences for privacy and security protection',
    image: 'https://ext.same-assets.com/3073684241/531069762.jpeg',
    href: '/services/sawater',
    featuresAr: ['سواتر حديدية', 'سواتر قماش', 'سواتر خشبية'],
    featuresEn: ['Iron Fences', 'Fabric Fences', 'Wooden Fences']
  }
];

export default async function ByootShaarPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations({ locale, namespace: 'byootShaar' });
  const isArabic = locale === 'ar';
  const isRTL = locale === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;
  const localePath = locale === 'ar' ? '' : '/en';
  const baseUrl = 'https://www.deyarsu.com';
  const pageImage = 'https://ext.same-assets.com/3073684241/1858852453.jpeg';
  
  const breadcrumbItems = [
    { label: t('breadcrumb.services'), href: `${localePath}/#services` },
    { label: t('breadcrumb.byootShaar'), href: `${localePath}/services/byoot-shaar`, current: true }
  ];

  const whatsappMessage = isArabic 
    ? "السلام عليكم، أريد الاستفسار عن خدمة بيوت الشعر وطلب عرض سعر."
    : "Hello, I would like to inquire about hair tent service and request a quote.";
  const whatsappURL = `https://wa.me/966553719009?text=${encodeURIComponent(whatsappMessage)}`;

  const heroFeatures = [
    { icon: Shield, text: t('hero.features.warranty') },
    { icon: Award, text: t('hero.features.quality') },
    { icon: Users, text: t('hero.features.team') },
    { icon: Clock, text: t('hero.features.delivery') }
  ];

  const stats = [
    { number: '500+', label: t('stats.projects') },
    { number: '15+', label: t('stats.experience') },
    { number: '100%', label: t('stats.satisfaction') },
    { number: '24/7', label: t('stats.support') }
  ];

  const serviceSchema = generateServiceSchema({
    name: t('schema.serviceName'),
    description: t('schema.serviceDescription'),
    areaServed: isArabic ? 'جدة' : 'Jeddah',
    priceRange: '5000-8000',
    image: pageImage,
    url: `${localePath}/services/byoot-shaar`,
    aggregateRating: { ratingValue: 4.9, reviewCount: 167 }
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
      ? `بيوت شعر, ${image.categoryAr}, جدة, ديار جدة العالمية`
      : `hair tents, ${image.categoryEn}, Jeddah, Deyar Jeddah`,
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

      <Navbar />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-20 left-20 w-32 h-32 bg-blue-600 rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-amber-600 rounded-full blur-3xl" />
            <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gray-600 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 text-center max-w-6xl mx-auto">
            {/* Breadcrumb */}
            <div className="mb-8 flex justify-center">
              <Breadcrumb items={breadcrumbItems} />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('hero.title')}{' '}
              <span className="text-amber-600">{t('hero.titleHighlight')}</span>
              <br />
              {t('hero.subtitle')}
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
              {t('hero.description')}
            </p>

            {/* Key Features */}
            <div className="flex flex-wrap justify-center items-center gap-6 mb-10 text-sm text-gray-600">
              {heroFeatures.map((feature) => (
                <div key={feature.text} className="flex items-center space-x-2 space-x-reverse">
                  <feature.icon className="w-4 h-4 text-amber-600" />
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link href="tel:+966553719009">
                <Button size="lg" className="text-lg px-8 py-4">
                  <Phone className="w-5 h-5 mr-2" />
                  {t('hero.callCta')}
                </Button>
              </Link>
              <Link href={whatsappURL} target="_blank">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-2">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('hero.whatsappCta')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 left-8 w-16 h-16 bg-amber-600/10 rounded-full blur-xl" />
          <div className="absolute bottom-1/4 right-8 w-20 h-20 bg-blue-600/10 rounded-full blur-xl" />
        </section>

        {/* Byoot Shaar Types Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('byootTypes.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('byootTypes.subtitle')}
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {byootShaarTypes.map((type) => {
                const TypeIcon = type.icon;
                return (
                  <div key={type.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <div className="md:flex">
                      <div className="md:w-1/2 relative h-64 md:h-auto">
                        <Image
                          src={type.image}
                          alt={t(`byootTypes.${type.id}.title`)}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <span className="bg-white/90 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                            {t(`byootTypes.${type.id}.category`)}
                          </span>
                        </div>
                      </div>
                      <div className="md:w-1/2 p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <TypeIcon className="w-6 h-6 text-amber-600" />
                            <h3 className="text-xl font-bold text-gray-900">{t(`byootTypes.${type.id}.title`)}</h3>
                          </div>
                          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                            {t(`byootTypes.${type.id}.description`)}
                          </p>
                          <div className="space-y-2 mb-4">
                            {(t.raw(`byootTypes.${type.id}.features`) as string[]).map((feature: string) => (
                              <div key={feature} className="flex items-center gap-2 text-sm">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-gray-600">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="border-t pt-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm text-gray-500">{isArabic ? 'الحجم:' : 'Size:'} {t(`byootTypes.${type.id}.size`)}</span>
                            <span className="font-bold text-lg text-blue-600">{t(`byootTypes.${type.id}.price`)}</span>
                          </div>
                          <Link href={whatsappURL} target="_blank">
                            <Button className="w-full">
                              {isArabic ? 'طلب عرض سعر' : 'Request Quote'}
                              <ArrowIcon className="w-4 h-4 mr-2" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {isArabic ? 'إنجازاتنا في أرقام' : 'Our Achievements in Numbers'}
              </h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto">
                {isArabic 
                  ? 'أرقام تتحدث عن خبرتنا وجودة خدماتنا في مجال بيوت الشعر'
                  : 'Numbers that speak about our expertise and service quality in hair tents'}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2 text-amber-400">
                    {stat.number}
                  </div>
                  <div className="text-lg opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('gallery.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('gallery.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {galleryImages.map((image) => (
                <div key={image.id} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  <div className="aspect-square relative">
                    <Image
                      src={image.src}
                      alt={isArabic ? image.titleAr : image.titleEn}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-4 text-white">
                        <h3 className="font-semibold text-sm mb-1">{isArabic ? image.titleAr : image.titleEn}</h3>
                        <p className="text-xs opacity-80">{isArabic ? image.descriptionAr : image.descriptionEn}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('testimonials.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('testimonials.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={`star-${testimonial.id}-${i}`} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-600 mb-6 leading-relaxed italic">
                    "{isArabic ? testimonial.contentAr : testimonial.contentEn}"
                  </blockquote>
                  <div>
                    <div className="font-semibold text-gray-900">{isArabic ? testimonial.nameAr : testimonial.nameEn}</div>
                    <div className="text-sm text-gray-500">{isArabic ? testimonial.roleAr : testimonial.roleEn}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('faq.title')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('faq.subtitle')}
              </p>
            </div>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={`faq-${index}`} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <details className="group">
                    <summary className="p-6 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition-colors">
                      <h3 className="font-semibold text-gray-900 pr-4">{isArabic ? faq.questionAr : faq.questionEn}</h3>
                      <ArrowIcon className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                    </summary>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-gray-600 leading-relaxed">{isArabic ? faq.answerAr : faq.answerEn}</p>
                    </div>
                  </details>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-amber-600 to-amber-700 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {t('cta.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={whatsappURL} target="_blank">
                <Button size="lg" className="text-lg px-8 py-4 bg-green-600 hover:bg-green-700">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {t('cta.whatsappButton')}
                </Button>
              </Link>
              <Link href="tel:+966553719009">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Phone className="w-5 h-5 mr-2" />
                  {t('cta.callButton')}
                </Button>
              </Link>
              <Link href="mailto:info@deyarsu.com">
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-white/10 border-white/30 text-white hover:bg-white/20">
                  <Mail className="w-5 h-5 mr-2" />
                  {t('cta.emailButton')}
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Related Services Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('relatedServices.title')}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {t('relatedServices.subtitle')}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedServices.map((service, index) => (
                <div key={`service-${index}`} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  <div className="relative h-48">
                    <Image
                      src={service.image}
                      alt={isArabic ? service.titleAr : service.titleEn}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{isArabic ? service.titleAr : service.titleEn}</h3>
                    <p className="text-gray-600 mb-4">{isArabic ? service.descriptionAr : service.descriptionEn}</p>
                    <div className="space-y-2 mb-4">
                      {(isArabic ? service.featuresAr : service.featuresEn).map((feature, idx) => (
                        <div key={`feature-${idx}`} className="flex items-center gap-2 text-sm">
                          <Check className="w-4 h-4 text-green-600" />
                          <span className="text-gray-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={`${localePath}${service.href}`}>
                      <Button variant="outline" className="w-full">
                        {isArabic ? 'اعرف المزيد' : 'Learn More'}
                        <ArrowIcon className="w-4 h-4 mr-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
