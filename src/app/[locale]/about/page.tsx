import type { Metadata } from 'next'
import {
  Star,
  Users,
  Award,
  Clock,
  Shield,
  CheckCircle,
  Target,
  Heart,
  Phone,
  MessageCircle,
  Mail
} from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import StructuredDataScript from '@/components/StructuredDataScript'
import BreadcrumbSchema from '@/components/BreadcrumbSchema'
import { generateCanonicalUrl } from '@/lib/seo-utils'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isArabic = locale === 'ar';

  return {
    title: isArabic 
      ? 'عن ديار جدة العالمية | خبرة 15 عام'
      : 'About Aldeyar Professionals | 15 Years Experience',
    description: isArabic
      ? 'تعرف على ديار جدة العالمية، الرائدة في خدمات المظلات والسواتر في جدة منذ 15 عاماً. فريق محترف، جودة عالية، وخدمة متميزة.'
      : 'Learn about Aldeyar Global Professionals, leading in shades and fences services in Jeddah for 15 years. Professional team, high quality, and excellent service.',
    keywords: isArabic
      ? 'ديار جدة العالمية، عن الشركة، خبرة 15 عام، شركة مظلات جدة، تاريخ الشركة، قيم الشركة'
      : 'Aldeyar Professionals, About Company, 15 Years Experience, Jeddah Shades Company, Company History, Company Values',
    authors: [{ name: isArabic ? 'ديار جدة العالمية' : 'Aldeyar Global Professionals' }],
    robots: 'index, follow',
    alternates: {
      canonical: locale === 'ar' ? '/about' : '/en/about',
      languages: {
        'ar': '/about',
        'en': '/en/about',
        'x-default': '/about',
      },
    },
    openGraph: {
      title: isArabic 
        ? 'عن ديار جدة العالمية | ديار جدة العالمية'
        : 'About Aldeyar | Aldeyar Global Professionals',
      description: isArabic
        ? 'تعرف على ديار جدة العالمية، الرائدة في خدمات المظلات والسواتر في جدة منذ 15 عاماً.'
        : 'Learn about Aldeyar Global Professionals, leading in shades and fences services in Jeddah for 15 years.',
      url: `https://www.deyarsu.com${locale === 'en' ? '/en' : ''}/about`,
      siteName: isArabic ? 'ديار جدة العالمية' : 'Aldeyar Global Professionals',
      type: 'website',
      locale: isArabic ? 'ar_SA' : 'en_US',
      images: [
        {
          url: 'https://www.deyarsu.com/logo.png',
          width: 1200,
          height: 630,
          alt: isArabic ? 'عن ديار جدة العالمية' : 'About Aldeyar Global Professionals',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: isArabic 
        ? 'عن ديار جدة العالمية | ديار جدة العالمية'
        : 'About Aldeyar | Aldeyar Global Professionals',
      description: isArabic
        ? 'تعرف على ديار جدة العالمية، الرائدة في خدمات المظلات والسواتر في جدة منذ 15 عاماً.'
        : 'Learn about Aldeyar Global Professionals, leading in shades and fences services in Jeddah for 15 years.',
      images: ['https://www.deyarsu.com/logo.png'],
    },
  };
}

const getStats = (isArabic: boolean) => [
  { number: '5000+', label: isArabic ? 'مشروع مكتمل' : 'Completed Projects', icon: CheckCircle },
  { number: '15+', label: isArabic ? 'سنة خبرة' : 'Years Experience', icon: Clock },
  { number: '100%', label: isArabic ? 'رضا العملاء' : 'Customer Satisfaction', icon: Heart },
  { number: '24/7', label: isArabic ? 'خدمة العملاء' : 'Customer Service', icon: Shield }
];

const getValues = (isArabic: boolean) => [
  {
    title: isArabic ? 'الجودة' : 'Quality',
    description: isArabic 
      ? 'نلتزم بأعلى معايير الجودة في جميع مشاريعنا، باستخدام أفضل المواد والتقنيات المتطورة.'
      : 'We are committed to the highest quality standards in all our projects, using the best materials and advanced technologies.',
    icon: Award
  },
  {
    title: isArabic ? 'المصداقية' : 'Integrity',
    description: isArabic 
      ? 'نبني علاقات طويلة الأمد مع عملائنا من خلال الشفافية والصدق في جميع تعاملاتنا.'
      : 'We build long-term relationships with our clients through transparency and honesty in all our dealings.',
    icon: Shield
  },
  {
    title: isArabic ? 'الإبداع' : 'Innovation',
    description: isArabic 
      ? 'نقدم حلول مبتكرة وتصاميم عصرية تلبي احتياجات العملاء وتفوق توقعاتهم.'
      : 'We provide innovative solutions and modern designs that meet customer needs and exceed expectations.',
    icon: Star
  },
  {
    title: isArabic ? 'الخدمة المتميزة' : 'Excellent Service',
    description: isArabic 
      ? 'فريق محترف متاح على مدار الساعة لضمان حصولكم على أفضل خدمة وأسرع استجابة.'
      : 'A professional team available around the clock to ensure you get the best service and fastest response.',
    icon: Users
  }
];

const getMilestones = (isArabic: boolean) => [
  {
    year: '2009',
    title: isArabic ? 'تأسيس الشركة' : 'Company Founded',
    description: isArabic 
      ? 'بدأنا رحلتنا في جدة بفريق صغير وحلم كبير لتقديم أفضل الخدمات'
      : 'We started our journey in Jeddah with a small team and a big dream to provide the best services'
  },
  {
    year: '2012',
    title: isArabic ? 'التوسع الأول' : 'First Expansion',
    description: isArabic 
      ? 'توسعنا في الخدمات وأضفنا السواتر والبرجولات إلى خدماتنا'
      : 'We expanded our services and added fences and pergolas to our offerings'
  },
  {
    year: '2015',
    title: isArabic ? 'الريادة في السوق' : 'Market Leadership',
    description: isArabic 
      ? 'أصبحنا من الشركات الرائدة في مجال المظلات والسواتر في جدة'
      : 'We became one of the leading companies in shades and fences in Jeddah'
  },
  {
    year: '2018',
    title: isArabic ? 'التطوير التقني' : 'Technical Development',
    description: isArabic 
      ? 'استثمرنا في أحدث التقنيات والمعدات لضمان أعلى جودة'
      : 'We invested in the latest technologies and equipment to ensure the highest quality'
  },
  {
    year: '2021',
    title: isArabic ? 'خدمات شاملة' : 'Comprehensive Services',
    description: isArabic 
      ? 'أضفنا خدمات تنسيق الحدائق وساندوتش بانل وترميم الملحقات'
      : 'We added landscaping, sandwich panels, and annexe renovation services'
  },
  {
    year: '2024',
    title: isArabic ? 'التميز والإبداع' : 'Excellence & Creativity',
    description: isArabic 
      ? 'حققنا أكثر من 5000 مشروع ناجح ونواصل رحلة التميز'
      : 'We achieved over 5000 successful projects and continue our journey of excellence'
  }
];

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isArabic = locale === 'ar';
  
  const stats = getStats(isArabic);
  const values = getValues(isArabic);
  const milestones = getMilestones(isArabic);

  const whatsappMessage = isArabic 
    ? "السلام عليكم، أريد الاستفسار عن خدماتكم ومعرفة المزيد عن الشركة."
    : "Hello, I would like to inquire about your services and learn more about the company.";
  const whatsappURL = `https://wa.me/966553719009?text=${encodeURIComponent(whatsappMessage)}`;

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": isArabic ? "ديار جدة العالمية" : "Aldeyar Global Professionals",
    "description": isArabic 
      ? "شركة رائدة في خدمات المظلات والسواتر في جدة منذ 15 عاماً"
      : "A leading company in shades and fences services in Jeddah for 15 years",
    "url": "https://www.deyarsu.com",
    "logo": "https://www.deyarsu.com/logo.png",
    "image": "https://www.deyarsu.com/logo.png",
    "foundingDate": "2009",
    "telephone": "+966553719009",
    "priceRange": "$$",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": isArabic ? "حي العزيزية" : "Al Aziziyah District",
      "addressLocality": isArabic ? "جدة" : "Jeddah",
      "addressRegion": isArabic ? "منطقة مكة المكرمة" : "Makkah Region",
      "addressCountry": "SA",
      "postalCode": "22233"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "21.4735",
      "longitude": "39.2087"
    },
    "hasMap": "https://maps.google.com/?q=G5XV%2B4WH+%D8%A7%D9%84%D8%B9%D8%B2%D9%8A%D8%B2%D9%8A%D8%A9%D8%8C+%D8%AC%D8%AF%D8%A9",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"],
        "opens": "08:00",
        "closes": "22:00"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+966553719009",
      "contactType": "customer service",
      "availableLanguage": ["Arabic","English"]
    },
    "areaServed": isArabic ? "جدة، السعودية" : "Jeddah, Saudi Arabia",
    "knowsAbout": isArabic 
      ? ["مظلات", "سواتر", "برجولات", "خيام ملكية", "بيوت شعر", "ساندوتش بانل", "تنسيق حدائق", "ترميم ملحقات"]
      : ["Shades", "Fences", "Pergolas", "Royal Tents", "Traditional Houses", "Sandwich Panels", "Landscaping", "Annexe Renovation"]
  };

  const breadcrumbItems = [
    { label: isArabic ? 'عن ديار جدة العالمية' : 'About Aldeyar', href: `${locale === 'en' ? '/en' : ''}/about` }
  ];

  return (
    <>
      <StructuredDataScript data={organizationData} />
      <BreadcrumbSchema items={breadcrumbItems} />

      <Navbar />

      <div className="min-h-screen bg-white">
        <section className="relative py-20 px-4 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5">
          <div className="max-w-7xl mx-auto">
            <nav className="flex items-center space-x-2 space-x-reverse text-sm text-gray-600 mb-8">
              <Link href={locale === 'en' ? '/en' : '/'} className="hover:text-primary transition-colors">
                {isArabic ? 'الرئيسية' : 'Home'}
              </Link>
              <span>/</span>
              <span className="text-primary font-medium">
                {isArabic ? 'عن ديار جدة العالمية' : 'About Aldeyar'}
              </span>
            </nav>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {isArabic ? (
                    <>نحن <span className="text-primary">ديار جدة العالمية</span> - رائدون في التميز منذ 2009</>
                  ) : (
                    <>We are <span className="text-primary">Aldeyar Professionals</span> - Leaders in Excellence Since 2009</>
                  )}
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {isArabic 
                    ? 'ديار جدة العالمية، شريكك الموثوق في تحويل الأحلام إلى واقع. نقدم خدمات شاملة ومتكاملة في جدة منذ أكثر من 15 عاماً، بخبرة واسعة وفريق محترف يضمن لك أعلى معايير الجودة والإتقان.'
                    : 'Aldeyar Global Professionals, your trusted partner in turning dreams into reality. We provide comprehensive and integrated services in Jeddah for over 15 years, with extensive experience and a professional team that ensures you the highest standards of quality and excellence.'}
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href={whatsappURL} target="_blank">
                    <Button size="lg" className="bg-primary hover:bg-primary/90">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      {isArabic ? 'تواصل معنا' : 'Contact Us'}
                    </Button>
                  </Link>
                  <Link href={locale === 'en' ? '/en/contact' : '/contact'}>
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      <Phone className="w-5 h-5 mr-2" />
                      {isArabic ? 'اطلب استشارة' : 'Request Consultation'}
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl p-8">
                  <div className="w-full h-full bg-white rounded-2xl shadow-2xl flex items-center justify-center">
                    <div className="text-center">
                      <Award className="w-20 h-20 text-primary mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        {isArabic ? '15+ سنة من التميز' : '15+ Years of Excellence'}
                      </h3>
                      <p className="text-gray-600">
                        {isArabic ? 'نفخر بثقة أكثر من 5000 عميل' : 'Proud of the trust of over 5000 clients'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-primary text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-accent" />
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {isArabic ? 'قصة نجاحنا' : 'Our Success Story'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {isArabic 
                  ? 'رحلة 15 عاماً من العمل الدؤوب والإبداع في خدمة أهالي جدة'
                  : 'A journey of 15 years of hard work and creativity serving the people of Jeddah'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {isArabic ? 'رؤيتنا' : 'Our Vision'}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {isArabic 
                    ? 'أن نكون الشركة الرائدة والموثوقة في مجال تقديم الحلول المعمارية المتكاملة في المملكة العربية السعودية، ونساهم في تطوير البيئة العمرانية بحلول مبتكرة وعصرية تلبي احتياجات عملائنا وتفوق توقعاتهم.'
                    : 'To be the leading and trusted company in providing integrated architectural solutions in Saudi Arabia, and to contribute to the development of the urban environment with innovative and modern solutions that meet our customers\' needs and exceed their expectations.'}
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  {isArabic ? 'رسالتنا' : 'Our Mission'}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {isArabic 
                    ? 'نلتزم بتقديم خدمات عالية الجودة في مجال المظلات، السواتر، والحلول المعمارية المتنوعة، من خلال فريق محترف ومواد عالية الجودة، مع ضمان رضا العملاء والالتزام بالمواعيد والمعايير العالمية.'
                    : 'We are committed to providing high-quality services in shades, fences, and various architectural solutions, through a professional team and high-quality materials, while ensuring customer satisfaction and adherence to global standards and timelines.'}
                </p>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {isArabic ? 'قيمنا ومبادئنا' : 'Our Values & Principles'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {isArabic 
                  ? 'المبادئ التي نؤمن بها والتي تقود عملنا نحو التميز'
                  : 'The principles we believe in and that guide our work towards excellence'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value) => (
                <div key={value.title} className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center">
                  <value.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {isArabic ? 'رحلة التطور والنمو' : 'Journey of Growth & Development'}
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {isArabic 
                  ? 'محطات مهمة في تاريخ ديار جدة العالمية'
                  : 'Important milestones in the history of Aldeyar Global Professionals'}
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20" />
              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <div key={milestone.year} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-white rounded-lg p-6 shadow-lg">
                        <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{milestone.title}</h3>
                        <p className="text-gray-600">{milestone.description}</p>
                      </div>
                    </div>
                    <div className="w-4 h-4 bg-primary rounded-full relative z-10" />
                    <div className="w-1/2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-r from-primary to-accent text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              {isArabic ? 'اكتشف الفرق مع ديار جدة العالمية' : 'Discover the Difference with Aldeyar'}
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              {isArabic 
                ? 'انضم إلى آلاف العملاء الذين وثقوا بنا واختاروا التميز والجودة'
                : 'Join thousands of clients who trusted us and chose excellence and quality'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={whatsappURL} target="_blank">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  {isArabic ? 'تواصل معنا الآن' : 'Contact Us Now'}
                </Button>
              </Link>
              <Link href={locale === 'en' ? '/en/contact' : '/contact'}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                  <Mail className="w-5 h-5 mr-2" />
                  {isArabic ? 'مزيد من المعلومات' : 'More Information'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
        {/* ─── قسم الموقع والتواصل ─── */}
        <section className="py-20 bg-gray-50" dir={isArabic ? 'rtl' : 'ltr'}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-full mb-4">
                <span className="text-amber-600 font-bold text-sm">📍 {isArabic ? 'موقعنا في جدة' : 'Our Location in Jeddah'}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                {isArabic ? 'تجدنا في العزيزية، جدة' : 'Find Us in Al Aziziyah, Jeddah'}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                {isArabic
                  ? 'نخدم جميع أحياء جدة مع إمكانية الوصول إلى موقعنا في حي العزيزية'
                  : 'Serving all Jeddah neighborhoods with easy access to our office in Al Aziziyah district'}
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Map */}
              <div className="lg:col-span-2 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3712.4!2d39.2087!3d21.4735!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zG5XV%2B4WH+%D8%A7%D9%84%D8%B9%D8%B2%D9%8A%D8%B2%D9%8A%D8%A9%D8%8C+%D8%AC%D8%AF%D8%A9+%D8%A7%D9%84%D8%B3%D8%B9%D9%88%D8%AF%D9%8A%D8%A9!5e0!3m2!1sar!2ssa!4v1700000000000!5m2!1sar!2ssa&q=G5XV%2B4WH+%D8%A7%D9%84%D8%B9%D8%B2%D9%8A%D8%B2%D9%8A%D8%A9%D8%8C+%D8%AC%D8%AF%D8%A9"
                  width="100%"
                  height="420"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={isArabic ? 'موقع ديار جدة العالمية على الخريطة' : 'Aldeyar Jeddah location on map'}
                  className="w-full"
                />
              </div>

              {/* Contact Cards */}
              <div className="space-y-4">
                {/* Address */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-amber-300 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📍</span>
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 mb-1">
                        {isArabic ? 'العنوان' : 'Address'}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {isArabic ? 'حي العزيزية، جدة، المملكة العربية السعودية' : 'Al Aziziyah, Jeddah, Saudi Arabia'}
                      </p>
                      <p className="text-amber-600 text-xs font-bold mt-1 font-mono">G5XV+4WH</p>
                    </div>
                  </div>
                </div>

                {/* Phone */}
                <a href="tel:+966553719009" className="block bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-green-300 hover:shadow-xl transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-50 group-hover:bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                      <Phone className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 mb-1">{isArabic ? 'الهاتف' : 'Phone'}</h3>
                      <p className="text-gray-600 text-sm font-mono" dir="ltr">+966 55 371 9009</p>
                    </div>
                  </div>
                </a>

                {/* WhatsApp */}
                <a href={whatsappURL} target="_blank" rel="noopener noreferrer" className="block bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-green-400 hover:shadow-xl transition-all group">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-50 group-hover:bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors">
                      <MessageCircle className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 mb-1">WhatsApp</h3>
                      <p className="text-gray-500 text-sm">{isArabic ? 'راسلنا الآن للحصول على استشارة مجانية' : 'Message us now for a free consultation'}</p>
                    </div>
                  </div>
                </a>

                {/* Hours */}
                <div className="bg-gray-900 rounded-2xl p-6 shadow-lg text-white">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-black text-white mb-2">{isArabic ? 'أوقات العمل' : 'Working Hours'}</h3>
                      <p className="text-gray-300 text-sm">{isArabic ? 'السبت – الخميس' : 'Sat – Thu'}</p>
                      <p className="text-amber-400 font-bold text-sm">8:00 ص – 10:00 م</p>
                      <p className="text-gray-400 text-xs mt-1">{isArabic ? 'الجمعة: بعد صلاة العصر' : 'Friday: After Asr prayer'}</p>
                    </div>
                  </div>
                </div>

                {/* Open in Maps button */}
                <a
                  href="https://maps.google.com/?q=G5XV%2B4WH+%D8%A7%D9%84%D8%B9%D8%B2%D9%8A%D8%B2%D9%8A%D8%A9%2C+%D8%AC%D8%AF%D8%A9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-400 text-black font-black py-4 rounded-2xl transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5"
                >
                  <span>🗺️</span>
                  <span>{isArabic ? 'افتح في خرائط Google' : 'Open in Google Maps'}</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
