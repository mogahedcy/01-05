'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Save,
  Eye,
  Trash2
} from 'lucide-react';

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video';
  caption?: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget: number;
  status: string;
  featured: boolean;
  details: string;
  clientName: string;
  projectDate: string;
  duration: string;
  area: string;
  materials: string;
  challenges: string;
  solutions: string;
  media: MediaFile[];
  views: number;
  createdAt: string;
}

export default function EditProjectPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  // بيانات النموذج
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    budget: '',
    status: 'مكتمل',
    featured: false,
    details: '',
    clientName: '',
    projectDate: '',
    duration: '',
    area: '',
    materials: '',
    challenges: '',
    solutions: ''
  });

  const categories = ['مظلات سيارات', 'سواتر', 'خيم ملكية', 'بيوت شعر ملكي', 'برجولات', 'تنسيق حدائق', 'هناجر', 'شبوك', 'قراميد', 'ساندوتش بانل'];
  const statuses = ['مكتمل', 'قيد التنفيذ', 'متوقف', 'ملغي'];

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        location: project.location || '',
        budget: project.budget?.toString() || '',
        status: project.status || 'مكتمل',
        featured: project.featured || false,
        details: project.details || '',
        clientName: project.clientName || '',
        projectDate: project.projectDate ? project.projectDate.split('T')[0] : '',
        duration: project.duration || '',
        area: project.area || '',
        materials: project.materials || '',
        challenges: project.challenges || '',
        solutions: project.solutions || ''
      });
    }
  }, [project]);

  const checkAuthentication = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (response.ok) {
        setIsAuthenticated(true);
        await loadProject();
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const loadProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const projectData = await response.json();
        setProject(projectData);
      } else {
        router.push('/dashboard/projects');
      }
    } catch (error) {
      console.error('Error loading project:', error);
      router.push('/dashboard/projects');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });

    setNewFiles(prev => [...prev, ...validFiles]);
  };

  const removeNewFile = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingMedia = async (mediaId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) {
      return;
    }

    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        media: prev.media.filter(m => m.id !== mediaId)
      };
    });
  };

  const uploadNewFiles = async (): Promise<MediaFile[]> => {
    const uploadedMedia: MediaFile[] = [];

    for (const file of newFiles) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          uploadedMedia.push({
            id: Math.random().toString(36).substr(2, 9),
            url: data.url,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            caption: `ملف ${uploadedMedia.length + 1}`
          });
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }

    return uploadedMedia;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category) {
      alert('يرجى ملء الحقول المطلوبة');
      return;
    }

    setIsSaving(true);

    try {
      // رفع الملفات الجديدة
      const newMedia = await uploadNewFiles();

      // دمج الوسائط الموجودة مع الجديدة
      const allMedia = [...(project?.media || []), ...newMedia];

      // إنشاء بيانات المشروع المحدثة
      const projectData = {
        ...formData,
        budget: Number.parseFloat(formData.budget) || 0,
        media: allMedia,
      };

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        router.push('/dashboard/projects');
      } else {
        alert('حدث خطأ في حفظ المشروع');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      alert('حدث خطأ في حفظ المشروع');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProject = async () => {
    if (!confirm('هل أنت متأكد من حذف هذا المشروع نهائياً؟ لا يمكن التراجع عن هذا الإجراء.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/dashboard/projects');
      } else {
        alert('حدث خطأ في حذف المشروع');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('حدث خطأ في حذف المشروع');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !project) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard/projects')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                العودة للمشاريع
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">
                تعديل المشروع
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/portfolio/${(project as any)?.slug || projectId}`)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                معاينة
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteProject}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                حذف
              </Button>
            </div>
          </div>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* معلومات المشروع */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>معلومات المشروع</CardTitle>
            <CardDescription>
              تم إنشاء هذا المشروع في {new Date(project.createdAt).toLocaleDateString('ar-SA')} •
              {project.views} مشاهدة
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">عنوان المشروع *</label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="عنوان المشروع"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الفئة *</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                >
                  <option value="">اختر الفئة</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الموقع</label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  placeholder="الموقع"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">الميزانية (ريال)</label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  placeholder="الميزانية"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">حالة المشروع</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">تاريخ المشروع</label>
                <Input
                  type="date"
                  value={formData.projectDate}
                  onChange={(e) => handleInputChange('projectDate', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">وصف المشروع *</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="وصف المشروع"
                rows={4}
                required
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => handleInputChange('featured', e.target.checked)}
                className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                مشروع مميز
              </label>
            </div>
          </CardContent>
        </Card>

        {/* الوسائط الموجودة */}
        {project.media && project.media.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>الوسائط الحالية</CardTitle>
              <CardDescription>الصور والفيديوهات المرفقة بالمشروع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {project.media.map((media) => (
                  <div key={media.id} className="relative group">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          alt="صورة المشروع"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeExistingMedia(media.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="secondary" className="text-xs">
                        {media.type === 'image' ? (
                          <ImageIcon className="h-3 w-3 mr-1" />
                        ) : (
                          <Video className="h-3 w-3 mr-1" />
                        )}
                        {media.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* إضافة ملفات جديدة */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              إضافة ملفات جديدة
            </CardTitle>
            <CardDescription>ارفع صور وفيديوهات إضافية للمشروع</CardDescription>
          </CardHeader>
          <CardContent>
            {/* منطقة السحب والإفلات */}
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-300 hover:border-green-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="font-medium mb-2">اسحب وأفلت الملفات هنا</p>
              <p className="text-gray-600 mb-4">أو</p>
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                اختر ملفات
              </Button>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {/* معاينة الملفات الجديدة */}
            {newFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">ملفات جديدة ({newFiles.length})</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {newFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt="معاينة"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Video className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeNewFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* أزرار الحفظ */}
        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/projects')}
            disabled={isSaving}
          >
            إلغاء
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                جاري الحفظ...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                حفظ التغييرات
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
