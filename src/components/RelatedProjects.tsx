'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Sparkles, Eye, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface Project {
  id: string;
  title: string;
  slug?: string;
  category: string;
  location: string;
  views: number;
  likes: number;
  mediaItems: Array<{ type: string; src: string; alt?: string }>;
}

interface RelatedProjectsProps {
  category: string;
  tags?: Array<{ name: string }>;
  currentId: string;
}

export default function RelatedProjects({ category, tags = [], currentId }: RelatedProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProjects = async () => {
      try {
        setLoading(true);
        // جلب المشاريع من نفس التصنيف
        const url = `/api/projects?category=${encodeURIComponent(category)}&limit=4&sort=popular`;
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.projects) {
            // تصفية المشروع الحالي (لو كان مقالاً اسمه مشابه أو نريد فقط استبعاد مشاريع معينة)
            // في حالتنا، currentId هو ID المقال، لكن احتياطاً نستبعد أي مشروع يحمل نفس الـ ID
            const filtered = data.projects
              .filter((p: Project) => p.id !== currentId)
              .slice(0, 3); // نكتفي بـ 3 مشاريع
              
            setProjects(filtered);
          }
        }
      } catch (error) {
        console.error('Error fetching related projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProjects();
  }, [category, currentId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-8 mb-12 shadow-sm animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-gray-100 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (projects.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-8 mb-12 shadow-sm border border-indigo-100/50">
      <div className="flex items-center gap-2 mb-8">
        <Sparkles className="w-6 h-6 text-indigo-600" />
        <h3 className="text-2xl font-black text-gray-900">
          مشاريع ذات صلة بـ {category}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projects.map((project) => {
          const mainImage = project.mediaItems?.find(m => m.type === 'IMAGE');
          return (
            <Link key={project.id} href={`/portfolio/${project.slug || project.id}`}>
              <Card className="group cursor-pointer overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white h-full flex flex-col hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                  {mainImage ? (
                    <Image
                      src={mainImage.src}
                      alt={mainImage.alt || project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400">لا توجد صورة</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <Badge className="bg-white/90 text-indigo-700 hover:bg-white backdrop-blur-sm border-0 font-bold">
                      {project.category}
                    </Badge>
                  </div>
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="bg-white text-indigo-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
                      عرض المشروع <ArrowLeft className="w-4 h-4" />
                    </span>
                  </div>
                </div>
                
                <CardContent className="p-5 flex-grow flex flex-col">
                  <h4 className="font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-sm text-gray-500 mb-4 flex items-center gap-1 mt-auto">
                    📍 {project.location || 'جدة'}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {project.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {project.likes}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
