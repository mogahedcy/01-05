'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Target,
  Lightbulb,
  Image as ImageIcon,
  FileText,
  Award,
  BarChart3,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  description: string;
}

interface AnalysisResult {
  topRankingFactors: string[];
  suggestedKeywords: string[];
  contentStructure: string[];
  titleSuggestions: string[];
  imageSuggestions: string[];
  descriptionImprovement: string;
  competitiveAdvantages: string[];
  marketInsights: string;
}

const categories = [
  'مظلات سيارات',
  'سواتر',
  'خيم ملكية',
  'بيوت شعر ملكي',
  'برجولات',
  'تنسيق حدائق',
  'هناجر',
  'شبوك',
  'قراميد',
  'ساندوتش بانل'
];

export default function ProjectAnalyzePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [manualData, setManualData] = useState({
    title: '',
    category: '',
    description: '',
    location: 'جدة'
  });
  const [useManualInput, setUseManualInput] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects/list');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (err) {
      console.error('خطأ في جلب المشاريع:', err);
    }
  };

  const handleAnalyze = async () => {
    setError('');
    setAnalysis(null);
    setAnalyzing(true);
    setProgress(0);

    try {
      let dataToAnalyze;

      if (useManualInput) {
        if (!manualData.title || !manualData.category) {
          setError('يرجى إدخال عنوان المشروع والفئة');
          setAnalyzing(false);
          return;
        }
        dataToAnalyze = manualData;
      } else {
        if (!selectedProjectId) {
          setError('يرجى اختيار مشروع للتحليل');
          setAnalyzing(false);
          return;
        }
        const selectedProject = projects.find(p => p.id === selectedProjectId);
        if (!selectedProject) {
          setError('لم يتم العثور على المشروع المحدد');
          setAnalyzing(false);
          return;
        }
        dataToAnalyze = {
          title: selectedProject.title,
          category: selectedProject.category,
          description: selectedProject.description,
          location: selectedProject.location
        };
      }

      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const response = await fetch('/api/ai/analyze-competitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          projectTitle: dataToAnalyze.title,
          category: dataToAnalyze.category,
          description: dataToAnalyze.description,
          location: dataToAnalyze.location
        })
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشل في التحليل');
      }

      const result = await response.json();

      if (result.success) {
        setAnalysis(result.analysis);
      } else {
        throw new Error(result.error || 'فشل في التحليل');
      }

    } catch (err) {
      console.error('خطأ في التحليل:', err);
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء التحليل');
    } finally {
      setAnalyzing(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const saveAnalysis = async () => {
    if (!analysis) {
      alert('لا يوجد تحليل لحفظه');
      return;
    }

    if (!selectedProjectId) {
      alert('⚠️ لا يمكن حفظ التحليل اليدوي. اختر مشروعاً موجوداً لحفظ التحليل.');
      return;
    }

    try {
      const response = await fetch(`/api/projects/${selectedProjectId}/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          aiAnalysis: analysis,
          suggestedKeywords: analysis.suggestedKeywords
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alert('✅ تم حفظ التحليل بنجاح!');
      } else {
        throw new Error(result.error || 'فشل في حفظ التحليل');
      }
    } catch (err) {
      console.error('خطأ في حفظ التحليل:', err);
      const errorMessage = err instanceof Error ? err.message : 'حدث خطأ في حفظ التحليل';
      alert(`❌ ${errorMessage}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              رجوع
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-blue-600" />
              تحليل المنافسين بالذكاء الاصطناعي
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  اختر المشروع للتحليل
                </CardTitle>
                <CardDescription>
                  اختر مشروعاً موجوداً أو أدخل بيانات يدوياً
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant={!useManualInput ? 'default' : 'outline'}
                    onClick={() => setUseManualInput(false)}
                    className="flex-1"
                  >
                    مشروع موجود
                  </Button>
                  <Button
                    variant={useManualInput ? 'default' : 'outline'}
                    onClick={() => setUseManualInput(true)}
                    className="flex-1"
                  >
                    إدخال يدوي
                  </Button>
                </div>

                {!useManualInput ? (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      المشروع
                    </label>
                    <select
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      <option value="">اختر مشروعاً</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.title} - {project.category}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        عنوان المشروع *
                      </label>
                      <Input
                        value={manualData.title}
                        onChange={(e) => setManualData({ ...manualData, title: e.target.value })}
                        placeholder="مثال: مظلات حديد جدة"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        الفئة *
                      </label>
                      <select
                        value={manualData.category}
                        onChange={(e) => setManualData({ ...manualData, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="">اختر الفئة</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        الموقع
                      </label>
                      <Input
                        value={manualData.location}
                        onChange={(e) => setManualData({ ...manualData, location: e.target.value })}
                        placeholder="جدة"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        الوصف (اختياري)
                      </label>
                      <Textarea
                        value={manualData.description}
                        onChange={(e) => setManualData({ ...manualData, description: e.target.value })}
                        placeholder="وصف مختصر للمشروع"
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing}
                  className="w-full flex items-center justify-center gap-2"
                  size="lg"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="h-5 w-5 animate-spin" />
                      جارِ التحليل...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      بدء التحليل بالذكاء الاصطناعي
                    </>
                  )}
                </Button>

                {analyzing && (
                  <div className="space-y-2">
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-center text-gray-600">
                      {progress < 50 ? 'تحليل السوق...' : progress < 80 ? 'تحليل المنافسين...' : 'إنهاء التحليل...'}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 text-red-800 rounded-md">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {analysis && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      عوامل الترتيب الأعلى
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.topRankingFactors.map((factor, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{factor}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      الكلمات المفتاحية المقترحة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {analysis.suggestedKeywords.map((keyword, index) => (
                        <Badge key={index} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      عناوين مقترحة
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.titleSuggestions.map((title, index) => (
                        <li key={index} className="p-3 bg-gray-50 rounded-md text-sm">
                          {title}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="h-5 w-5 text-orange-600" />
                      توصيات الصور
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.imageSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-orange-600 font-bold">{index + 1}.</span>
                          <span className="text-sm">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      المزايا التنافسية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.competitiveAdvantages.map((advantage, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <Award className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{advantage}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-indigo-600" />
                      رؤى السوق
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {analysis.marketInsights}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-amber-600" />
                      الوصف المحسّن
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-700 p-4 bg-amber-50 rounded-md">
                      {analysis.descriptionImprovement}
                    </p>
                  </CardContent>
                </Card>

                {!useManualInput && selectedProjectId && (
                  <Button
                    onClick={saveAnalysis}
                    className="w-full"
                    size="lg"
                  >
                    <CheckCircle className="h-5 w-5 ml-2" />
                    حفظ التحليل في المشروع
                  </Button>
                )}
              </>
            )}

            {!analysis && !analyzing && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    لا يوجد تحليل بعد
                  </h3>
                  <p className="text-sm text-gray-600 max-w-md">
                    اختر مشروعاً أو أدخل بيانات يدوياً ثم انقر على "بدء التحليل" للحصول على
                    رؤى شاملة من الذكاء الاصطناعي حول المنافسين والسوق
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
