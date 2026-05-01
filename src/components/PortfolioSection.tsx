'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Car, TreePine, Shield, Home, Wrench, Flower, MapPin, Calendar, Eye, Heart, Star, Loader2 } from 'lucide-react';
import SEOImage from '@/components/services/SEOImage';

// تعريف أنواع الخدمات مع الأيقونات المناسبة - 10 فئات رئيسية
const serviceCategories = [
  { id: 'مظلات سيارات', name: 'مظلات سيارات', icon: Car },
  { id: 'سواتر', name: 'سواتر', icon: Shield },
  { id: 'خيم ملكية', name: 'خيم ملكية', icon: Home },
  { id: 'بيوت شعر ملكي', name: 'بيوت شعر ملكي', icon: Home },
  { id: 'برجولات', name: 'برجولات', icon: TreePine },
  { id: 'تنسيق حدائق', name: 'تنسيق حدائق', icon: Flower },
  { id: 'هناجر', name: 'هناجر', icon: Home },
  { id: 'شبوك', name: 'شبوك', icon: Shield },
  { id: 'قراميد', name: 'قراميد', icon: Home },
  { id: 'ساندوتش بانل', name: 'ساندوتش بانل', icon: Home },
  { id: 'خيام', name: 'خيام', icon: Home },
  { id: 'بيوت شعر', name: 'بيوت شعر', icon: Home },
  { id: 'ترميم وتجديد', name: 'ترميم وتجديد', icon: Wrench }
];

interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  src: string;
  alt?: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  completionDate: string;
  createdAt: string;
  publishedAt?: string;
  mediaItems: MediaItem[];
  tags?: { name: string }[];
  featured: boolean;
  views: number;
  likes: number;
  rating: number;
}

export default function PortfolioSection({ initialProjects = [] }: { initialProjects?: Project[] }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [loading, setLoading] = useState(initialProjects.length === 0);
  const [selectedCategory, setSelectedCategory] = useState('الكل');
  const isFirstRender = React.useRef(true);

  // جلب أحدث مشروع لكل خدمة (فقط إذا لم يتم تمريرها من الخادم)
  useEffect(() => {
    if (isFirstRender.current && initialProjects.length > 0) {
      isFirstRender.current = false;
      setLoading(false);
      return;
    }
    isFirstRender.current = false;

    const fetchLatestProjects = async () => {
      try {
        setLoading(true);

        // جلب أحدث 50 مشروع أولاً
        const allProjectsResponse = await fetch(`/api/projects?limit=50&sort=newest`);
        const allProjectsData = await allProjectsResponse.json();

        if (allProjectsData.success && allProjectsData.projects) {
          // تجميع المشاريع حسب الفئة وأخذ أحدث مشروع لكل فئة
          const projectsByCategory = new Map();

          allProjectsData.projects.forEach((project: Project) => {
            if (!projectsByCategory.has(project.category)) {
              projectsByCategory.set(project.category, project);
            }
          });

          // تحويل إلى مصفوفة وترتيب حسب تاريخ الإنشاء
          const latestProjects = Array.from(projectsByCategory.values())
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 8); // أخذ أحدث 8 مشاريع فقط

          setProjects(latestProjects);
        } else {
          // الطريقة البديلة إذا فشلت الطريقة الأولى
          const projectPromises = serviceCategories.map(async (category) => {
            const response = await fetch(`/api/projects?category=${encodeURIComponent(category.id)}&limit=1&sort=newest`);
            const data = await response.json();
            return data.success && data.projects && data.projects.length > 0 ? data.projects[0] : null;
          });

          const latestProjects = await Promise.all(projectPromises);
          const validProjects = latestProjects.filter(project => project !== null);

          setProjects(validProjects);
        }
      } catch (error) {
        console.error('خطأ في جلب المشاريع:', error);
        if (projects.length === 0) {
            setProjects([]);
        }
      } finally {
        setLoading(false);
      }
    };

    if (projects.length === 0) {
        fetchLatestProjects();
    }
  }, [initialProjects, projects.length]);

  const filteredProjects = selectedCategory === 'الكل'
    ? projects
    : projects.filter(project => project.category === selectedCategory);

  const getProjectIcon = (category: string) => {
    const serviceCategory = serviceCategories.find(cat => cat.id === category);
    return serviceCategory ? serviceCategory.icon : Home;
  };

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-background to-secondary/20" aria-busy="true" aria-label="جاري تحميل المشاريع">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" aria-hidden="true" />
              <p className="text-lg text-muted-foreground font-medium" role="status">جاري تحميل أحدث المشاريع...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            أحدث أعمال ديار جدة العالمية في جدة
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto mb-12 leading-relaxed">
            استكشف أحدث مشاريعنا المتميزة في جدة والمناطق المحيطة. نعرض لك أحدث عمل في كل خدمة من خدماتنا المتخصصة
            في المظلات، برجولات، السواتر، الساندوتش بانل، تنسيق حدائق، الخيام الملكية، بيوت الشعر،
            والترميم بأعلى معايير الجودة والحرفية
          </p>

          {/* Enhanced Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-accent mb-2">+5000</div>
              <div className="text-sm text-muted-foreground font-medium">مشروع ناجح</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-accent mb-2">8</div>
              <div className="text-sm text-muted-foreground font-medium">خدمات متخصصة</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-accent mb-2">15</div>
              <div className="text-sm text-muted-foreground font-medium">عام خبرة</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg text-center">
              <div className="text-4xl font-bold text-accent mb-2">جدة</div>
              <div className="text-sm text-muted-foreground font-medium">والمناطق المحيطة</div>
            </div>
          </div>
        </div>

        {/* Enhanced Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          <Button
            variant={selectedCategory === 'الكل' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('الكل')}
            className={`transition-all duration-300 ${
              selectedCategory === 'الكل'
                ? 'bg-accent text-accent-foreground shadow-lg'
                : 'hover:bg-accent/10 hover:border-accent'
            }`}
          >
            الكل
          </Button>
          {serviceCategories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={`transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-accent text-accent-foreground shadow-lg'
                  : 'hover:bg-accent/10 hover:border-accent'
              }`}
            >
              {category.name}
            </Button>
          ))}
        </div>

        {/* Enhanced Projects Grid - محسّن للجوال */}
        {filteredProjects.length > 0 ? (
          <div className="gallery-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
            {filteredProjects.map((project) => {
              const IconComponent = getProjectIcon(project.category);
              const mainImage = project.mediaItems?.find(item => item.type === 'IMAGE');
              const mainVideo = project.mediaItems?.find(item => item.type === 'VIDEO');
              const mainMedia = mainImage || mainVideo;

              return (
                <div key={project.id} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3">
                  {/* Project Media */}
                  <div className="relative h-64 overflow-hidden">
                    {mainMedia ? (
                      <>
                        {mainMedia.type === 'IMAGE' ? (
                          <SEOImage
                            src={mainMedia.src}
                            alt={mainMedia.alt || `${project.title} - ${project.category} في ${project.location}`}
                            projectTitle={project.title}
                            projectCategory={project.category}
                            projectLocation={project.location}
                            width={800}
                            height={640}
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                            showWatermark={true}
                            watermarkPosition="bottom-right"
                            priority={false}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          />
                        ) : mainMedia.type === 'VIDEO' ? (
                          <div className="relative w-full h-full bg-gray-900">
                            {/* صورة مصغرة كخلفية */}
                            {mainMedia.thumbnail && (
                                <NextImage
                                src={mainMedia.thumbnail}
                                alt={`معاينة ${project.title}`}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover"
                                priority={false}
                              />
                            )}

                            {/* الفيديو */}
                            <video
                              key={`portfolio-video-${project.id}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              muted
                              loop
                              playsInline
                              autoPlay
                              preload="metadata"
                              poster={mainMedia.thumbnail || undefined}
                              onCanPlay={(e) => {
                                // التشغيل فور إمكانية التشغيل
                                const video = e.target as HTMLVideoElement;
                                video.play().catch(() => {
                                  // في حال فشل التشغيل التلقائي، محاولة أخرى بعد تأخير قصير
                                  setTimeout(() => {
                                    video.play().catch(() => {});
                                  }, 100);
                                });
                              }}
                              onLoadedMetadata={(e) => {
                                const video = e.target as HTMLVideoElement;
                                video.currentTime = 0.1; // تشغيل من نقطة قريبة ��لبداية
                                video.play().catch(() => {});
                              }}
                              onError={(e) => {
                                console.error('خطأ في تحميل الفيديو:', mainMedia.src);
                                const videoElement = e.target as HTMLVideoElement;
                                videoElement.style.display = 'none';
                              }}
                              onLoadedData={(e) => {
                                // Video loaded successfully
                                const video = e.target as HTMLVideoElement;
                                // تشغيل فوري متعدد المحاولات
                                const attemptPlay = () => {
                                  video.play().catch(() => {
                                    // إعادة المحاولة كل 50ms لمدة ثانية واحدة
                                    setTimeout(attemptPlay, 50);
                                  });
                                };
                                attemptPlay();
                              }}
                              onMouseEnter={(e) => {
                                // تأكيد التشغي�� عند المرور بالماوس
                                const video = e.target as HTMLVideoElement;
                                if (video.paused) {
                                  video.play().catch(() => {});
                                }
                              }}
                            >
                              <source src={mainMedia.src} type="video/mp4" />
                              <source src={mainMedia.src} type="video/webm" />
                              <source src={mainMedia.src} type="video/mov" />
                              متصفحك لا يدعم عرض الفيديو
                            </video>

                            {/* شارة الفيديو */}
                            <div className="absolute top-3 right-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg z-10">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                              </svg>
                              فيديو
                            </div>

                            {/* أيقونة تشغيل مع تأثير hover */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                              <div className="bg-black/40 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <div className="text-center text-gray-400">
                              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
                              </svg>
                              <span className="text-sm">لا توجد وسائط</span>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <IconComponent className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4 bg-accent text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                      {project.category}
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute bottom-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
                        مميز
                      </div>
                    )}

                    {/* View Details Overlay */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                      <Button size="lg" variant="secondary" className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                        <Eye className="w-5 h-5 ml-2" />
                        عرض التفاصيل
                      </Button>
                    </div>
                  </div>

                  {/* Enhanced Project Content */}
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3 space-x-reverse">
                        <div className="bg-accent/10 p-3 rounded-xl">
                          <IconComponent className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="font-bold text-primary text-lg leading-tight mb-1">
                            {project.title}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Project Meta */}
                    <div className="flex items-center space-x-6 space-x-reverse text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <MapPin className="w-4 h-4 text-accent" />
                        <span className="font-medium">{project.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Calendar className="w-4 h-4 text-accent" />
                        <span className="font-medium">{new Date(project.completionDate).getFullYear()}</span>
                      </div>
                    </div>

                    {/* Project Description */}
                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Project Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.tags.slice(0, 3).map((tag, index) => (
                          <span key={`${project.id}-tag-${index}`} className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-medium">
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Project Stats */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                      <div className="flex items-center space-x-4 space-x-reverse">
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Eye className="w-4 h-4" />
                          <span>{project.views || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Heart className="w-4 h-4" />
                          <span>{project.likes || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Star className="w-4 h-4" />
                          <span>{project.rating || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced Project CTA */}
                    <Button asChild variant="outline" className="w-full group-hover:bg-accent group-hover:text-accent-foreground group-hover:border-accent transition-all duration-500 py-3">
                      <Link href={`/portfolio/${project.id}`} className="flex items-center justify-center space-x-2 space-x-reverse font-medium">
                        <span>عرض تفاصيل المشروع</span>
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16" role="status" aria-live="polite">
            <div className="info-message max-w-md mx-auto">
              <p className="text-lg font-semibold mb-2">لا توجد مشاريع متاحة حالياً</p>
              <p className="text-sm opacity-80">نحن نعمل على إضافة المزيد من المشاريع قريباً</p>
            </div>
            <Button asChild variant="outline" className="mt-6 focus-visible-ring" size="lg">
              <Link href="/contact">تواصل معنا لبدء مشروعك</Link>
            </Button>
          </div>
        )}

        {/* Enhanced Bottom CTA */}
        <div className="bg-gradient-to-r from-accent/10 via-primary/5 to-accent/10 rounded-3xl p-8 md:p-12 text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            هل لديك مشروع مماثل؟
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            ديار جدة العالمية جاهزون لتنفيذ مشروعك بنفس مستوى الجودة والاحترافية.
            نقدم استشارة مجانية شاملة وعرض سعر مخصص يناسب احتياجاتك ومتطلبات مشروعك
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6 h-auto shadow-lg">
              <Link href="/portfolio" className="flex items-center space-x-3 space-x-reverse">
                <span>اضغط هنا لمشاهدة جميع الأعمال</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 h-auto shadow-lg">
              <Link href="/contact" className="flex items-center space-x-3 space-x-reverse">
                <span>تواصل معنا الآن</span>
                <ArrowLeft className="w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
