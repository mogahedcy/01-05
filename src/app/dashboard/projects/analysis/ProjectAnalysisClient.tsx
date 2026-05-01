'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Brain,
  TrendingUp,
  Target,
  Lightbulb,
  Calendar,
  Search,
  RefreshCw,
  Loader2,
  ChevronDown,
  ChevronUp,
  Star,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Tag,
  FileText,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectAnalysis {
  id: string;
  title: string;
  category: string;
  location: string;
  aiAnalysis: any;
  suggestedKeywords: string;
  lastAnalyzedAt: string;
  seo_score?: number;
}

export default function ProjectAnalysisClient() {
  const [projects, setProjects] = useState<ProjectAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'score'>('newest');

  useEffect(() => {
    fetchAnalyzedProjects();
  }, []);

  const fetchAnalyzedProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      
      const analyzedProjects = data
        .filter((p: any) => p.aiAnalysis)
        .map((p: any) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          location: p.location,
          aiAnalysis: p.aiAnalysis ? JSON.parse(p.aiAnalysis) : null,
          suggestedKeywords: p.suggestedKeywords || '',
          lastAnalyzedAt: p.lastAnalyzedAt,
          seo_score: p.aiAnalysis ? JSON.parse(p.aiAnalysis).seo_score : 0
        }));

      setProjects(analyzedProjects);
    } catch (error) {
      console.error('خطأ في جلب التحليلات:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects
    .filter(p => 
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.includes(searchTerm) ||
      p.location.includes(searchTerm)
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.lastAnalyzedAt).getTime() - new Date(a.lastAnalyzedAt).getTime();
      } else {
        return (b.seo_score || 0) - (a.seo_score || 0);
      }
    });

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'ممتاز';
    if (score >= 60) return 'جيد';
    return 'يحتاج تحسين';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل التحليلات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  تحليلات المشاريع بالذكاء الاصطناعي
                </h1>
              </div>
              <p className="text-gray-600">
                عرض وإدارة تحليلات الذكاء الاصطناعي لجميع المشاريع
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2">
                <Sparkles className="w-4 h-4 ml-2" />
                {projects.length} مشروع محلل
              </Badge>
              <Button
                onClick={fetchAnalyzedProjects}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="w-4 h-4 ml-2" />
                تحديث
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="البحث في المشاريع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 py-6 text-lg"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'score')}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="newest">الأحدث أولاً</option>
              <option value="score">الأعلى تقييماً</option>
            </select>
          </div>
        </motion.div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-lg p-12 text-center"
          >
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              لا توجد مشاريع محللة
            </h3>
            <p className="text-gray-600 mb-6">
              لم يتم العثور على مشاريع تحتوي على تحليل ذكاء اصطناعي
            </p>
            <Button
              onClick={() => window.location.href = '/dashboard/projects/analyze'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Brain className="w-4 h-4 ml-2" />
              بدء تحليل جديد
            </Button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
                  {/* Project Header */}
                  <div
                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-xl font-bold text-gray-900">{project.title}</h3>
                          <Badge className="bg-blue-100 text-blue-700">
                            {project.category}
                          </Badge>
                          <Badge variant="outline" className="text-gray-600">
                            📍 {project.location}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                          {/* SEO Score */}
                          {project.aiAnalysis?.seo_score && (
                            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${getScoreColor(project.aiAnalysis.seo_score)}`}>
                              <BarChart3 className="w-5 h-5" />
                              <span className="font-bold text-lg">{project.aiAnalysis.seo_score}</span>
                              <span className="text-sm">/ 100</span>
                              <span className="text-xs mr-2">{getScoreLabel(project.aiAnalysis.seo_score)}</span>
                            </div>
                          )}

                          {/* Last Analysis Date */}
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              آخر تحليل: {new Date(project.lastAnalyzedAt).toLocaleDateString('ar-SA')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {expandedProject === project.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedProject === project.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-white">
                          {/* Keywords */}
                          {project.suggestedKeywords && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Tag className="w-5 h-5 text-purple-600" />
                                <h4 className="font-semibold text-gray-900">الكلمات المفتاحية المقترحة</h4>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {project.suggestedKeywords.split(',').map((keyword, i) => (
                                  <Badge key={i} className="bg-purple-100 text-purple-700 px-3 py-1">
                                    {keyword.trim()}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Primary Keywords */}
                          {project.aiAnalysis?.primary_keywords && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Target className="w-5 h-5 text-green-600" />
                                <h4 className="font-semibold text-gray-900">الكلمات الأساسية</h4>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {project.aiAnalysis.primary_keywords.map((keyword: string, i: number) => (
                                  <Badge key={i} className="bg-green-100 text-green-700 px-3 py-1">
                                    <Star className="w-3 h-3 ml-1" />
                                    {keyword}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Suggestions */}
                          {project.aiAnalysis?.suggestions && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="w-5 h-5 text-yellow-600" />
                                <h4 className="font-semibold text-gray-900">اقتراحات التحسين</h4>
                              </div>
                              <ul className="space-y-2">
                                {project.aiAnalysis.suggestions.map((suggestion: string, i: number) => (
                                  <li key={i} className="flex items-start gap-2 text-gray-700">
                                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                    <span>{suggestion}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Meta Tags */}
                          {project.aiAnalysis?.meta_title && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <FileText className="w-5 h-5 text-blue-600" />
                                <h4 className="font-semibold text-gray-900">Meta Tags المقترحة</h4>
                              </div>
                              <div className="space-y-3 bg-white rounded-xl p-4 border border-gray-200">
                                <div>
                                  <label className="text-xs font-medium text-gray-500 block mb-1">العنوان (Title)</label>
                                  <p className="text-sm text-gray-900 font-medium">{project.aiAnalysis.meta_title}</p>
                                </div>
                                {project.aiAnalysis.meta_description && (
                                  <div>
                                    <label className="text-xs font-medium text-gray-500 block mb-1">الوصف (Description)</label>
                                    <p className="text-sm text-gray-700">{project.aiAnalysis.meta_description}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <Button
                              onClick={() => window.location.href = `/dashboard/projects/${project.id}`}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <ExternalLink className="w-4 h-4 ml-2" />
                              عرض المشروع
                            </Button>
                            <Button
                              onClick={() => window.location.href = `/dashboard/projects/${project.id}/edit`}
                              variant="outline"
                              className="flex-1"
                            >
                              تعديل المشروع
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
