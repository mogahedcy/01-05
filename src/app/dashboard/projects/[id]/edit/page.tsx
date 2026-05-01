'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  Video,
  Save,
  Eye,
  Trash2,
  Plus,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO';
  src: string;
  title?: string;
  description?: string;
  order: number;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  completionDate: string;
  client?: string;
  featured: boolean;
  projectDuration?: string;
  projectCost?: string;
  views: number;
  likes: number;
  rating: number;
  createdAt: string;
  mediaItems: MediaItem[];
  tags: { id: string; name: string; }[];
  materials: { id: string; name: string; }[];
}

interface NewMediaFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  title: string;
}

export default function EditProjectPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [newFiles, setNewFiles] = useState<NewMediaFile[]>([]);
  const [deletedMedia, setDeletedMedia] = useState<string[]>([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  // بيانات النموذج
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'مظلات',
    location: '',
    client: '',
    projectDuration: '',
    projectCost: '',
    completionDate: '',
    featured: false
  });

  const [tags, setTags] = useState<string[]>([]);
  const [materials, setMaterials] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [newMaterial, setNewMaterial] = useState('');

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

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || 'مظلات',
        location: project.location || '',
        client: project.client || '',
        projectDuration: project.projectDuration || '',
        projectCost: project.projectCost || '',
        completionDate: project.completionDate ? project.completionDate.split('T')[0] : '',
        featured: project.featured || false
      });

      setTags(project.tags?.map(tag => tag.name) || []);
      setMaterials(project.materials?.map(material => material.name) || []);
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
        setError('فشل في تحميل المشروع');
        setTimeout(() => router.push('/dashboard/projects'), 2000);
      }
    } catch (error) {
      console.error('Error loading project:', error);
      setError('حدث خطأ في تحميل المشرو��');
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
      const mediaFile: NewMediaFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        type: mediaType,
        title: file.name.split('.')[0]
      };

      setNewFiles(prev => [...prev, mediaFile]);
    });
  };

  const removeNewFile = (id: string) => {
    setNewFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  const removeExistingMedia = (mediaId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الملف؟')) return;

    setDeletedMedia(prev => [...prev, mediaId]);
    setProject(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        mediaItems: prev.mediaItems.filter(m => m.id !== mediaId)
      };
    });
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const addMaterial = () => {
    if (newMaterial.trim() && !materials.includes(newMaterial.trim())) {
      setMaterials(prev => [...prev, newMaterial.trim()]);
      setNewMaterial('');
    }
  };

  const removeMaterial = (materialToRemove: string) => {
    setMaterials(prev => prev.filter(material => material !== materialToRemove));
  };

  const uploadNewFiles = async (): Promise<MediaItem[]> => {
    const uploadedMedia: MediaItem[] = [];

    for (const mediaFile of newFiles) {
      try {
        const formData = new FormData();
        formData.append('file', mediaFile.file);

        console.log('🔄 رفع ملف جديد:', mediaFile.file.name);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ تم رفع الملف:', data);
          
          const uploadedFile = data.files?.[0];
          
          if (!uploadedFile) {
            throw new Error('لم يتم الحصول على بيانات الملف المرفوع');
          }
          
          const fileUrl = uploadedFile.src || uploadedFile.url;
          
          if (!fileUrl) {
            throw new Error('لم يتم الحصول على رابط الملف');
          }
          
          uploadedMedia.push({
            id: Math.random().toString(36).substr(2, 9),
            type: mediaFile.type.toUpperCase() as 'IMAGE' | 'VIDEO',
            src: fileUrl,
            title: mediaFile.title,
            description: '',
            order: uploadedMedia.length
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'فشل في رفع الملف');
        }
      } catch (error) {
        console.error('❌ خطأ في رفع الملف:', error);
        alert(`خطأ في رفع الملف ${mediaFile.file.name}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }

    return uploadedMedia;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    try {
      // التحقق من البيانات
      if (!formData.title || !formData.description || !formData.category) {
        setError('يرجى ملء جميع الحقول المطلوبة');
        return;
      }

      // رفع الملفات الجديدة
      const newMedia = await uploadNewFiles();

      // دمج الوسائط الموجودة مع الجديدة
      const existingMedia = project?.mediaItems.filter(item => !deletedMedia.includes(item.id)) || [];
      const allMedia = [...existingMedia, ...newMedia];

      // إعداد بيانات المشروع
      const projectData = {
        ...formData,
        mediaItems: allMedia,
        tags: tags,
        materials: materials,
        completionDate: new Date(formData.completionDate).toISOString()
      };

      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.ok) {
        setSuccess('تم حفظ التغييرات بنجاح!');
        setTimeout(() => {
          router.push('/dashboard/projects');
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'حدث خطأ في حفظ المشروع');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      setError('حدث خطأ في حفظ المشروع');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProject = async () => {
    const confirmText = `هل أنت متأكد من حذف المشروع "${project?.title}" نهائياً؟`;
    if (!confirm(confirmText)) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('تم حذف المشروع بنجاح');
        setTimeout(() => {
          router.push('/dashboard/projects');
        }, 1500);
      } else {
        setError('حدث خطأ في حذف المشروع');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('حدث خطأ في حذف المشروع');
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
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
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
              <div>
                <h1 className="text-xl font-bold text-gray-900">تعديل المشروع</h1>
                <p className="text-sm text-gray-500">{project.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/portfolio/${(project as any)?.slug || projectId}`)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                ��عاينة
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={deleteProject}
                className="flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                حذف المشروع
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      {(success || error) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-6">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">{success}</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 mb-6">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{error}</span>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>المعلومات الأساسية</CardTitle>
              <CardDescription>
                تم إنشاء هذا المشروع في {new Date(project.createdAt).toLocaleDateString('ar-SA')} •
                {project.views} مشاهدة
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">عنوان المشروع *</label>
                  <Input
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="عنوان المشروع"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الفئة *</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">الموقع *</label>
                  <Input
                    required
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="الموقع"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">العميل</label>
                  <Input
                    value={formData.client}
                    onChange={(e) => handleInputChange('client', e.target.value)}
                    placeholder="اسم العميل"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">تاريخ الإنجاز *</label>
                  <Input
                    type="date"
                    required
                    value={formData.completionDate}
                    onChange={(e) => handleInputChange('completionDate', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">مدة التنفيذ</label>
                  <Input
                    value={formData.projectDuration}
                    onChange={(e) => handleInputChange('projectDuration', e.target.value)}
                    placeholder="مثال: 5 أيام"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">التكلفة</label>
                  <Input
                    value={formData.projectCost}
                    onChange={(e) => handleInputChange('projectCost', e.target.value)}
                    placeholder="مثال: 15,000 ريال"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">وصف المشروع *</label>
                  <Textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="وصف المشروع"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => handleInputChange('featured', e.target.checked)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium">مشروع مميز</span>
                  </label>
                </div>
              </div>

              {/* قسم AI المطور */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="bg-gradient-to-r from-purple-50 via-blue-50 to-purple-50 border-2 border-purple-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Plus className="h-5 w-5 text-purple-600 animate-pulse" />
                      <h3 className="font-semibold text-purple-900">تطوير المحتوى بواسطة AI Expert</h3>
                    </div>
                    <Badge className="bg-purple-600">💎 تحديث استراتيجي</Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-4">
                    هل تريد تحويل هذا المشروع إلى "مغناطيس للعملاء"؟ دع الخبير الاستراتيجي يحلل المحتوى الحالي ويقترح تحسينات تتوافق مع السوق السعودي.
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-100 flex items-center justify-center gap-2"
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/ai-suggestions', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            title: formData.title,
                            description: formData.description,
                            category: formData.category,
                            location: formData.location
                          })
                        });
                        const data = await res.json();
                        if (data.suggestions) {
                          alert('✅ تم الحصول على اقتراحات احترافية! يمكنك الآن رؤية الكلمات المفتاحية المقترحة والعناوين في console المتصفح.');
                          console.log('🤖 اقتراحات الخبير الاستراتيجي:', data.suggestions);
                        }
                      } catch (e) {
                        alert('❌ فشل في الاتصال بالخبير.');
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    تحليل وتحسين المحتوى الحالي
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Media */}
          {project.mediaItems && project.mediaItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>الوسائط الحالية</CardTitle>
                <CardDescription>الصور والفيديوهات المرفقة بالمشروع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {project.mediaItems.map((media) => (
                    <div key={media.id} className="relative group">
                      <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        {media.type === 'IMAGE' ? (
                          <img
                            src={media.src}
                            alt={media.title || 'صورة المشروع'}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
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
                          {media.type === 'IMAGE' ? (
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

          {/* Add New Media */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                إضافة ملفات جديدة
              </CardTitle>
              <CardDescription>ارفع صور وفيديوهات إضافية للمشروع</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">رفع ملفات جديدة</h3>
                  <p className="mt-1 text-sm text-gray-600">اختر صور أو فيديوهات لإضافتها</p>
                  
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  
                  <label
                    htmlFor="file-upload"
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    اختيار ملفات
                  </label>
                </div>

                {/* New Files Preview */}
                {newFiles.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-4">ملفات جديدة ({newFiles.length})</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {newFiles.map((media) => (
                        <div key={media.id} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            {media.type === 'image' ? (
                              <img
                                src={media.preview}
                                alt={media.title}
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
                            onClick={() => removeNewFile(media.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tags and Materials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>العلامات</CardTitle>
                <CardDescription>كلمات مفتاحية للمشروع</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="أضف علامة جديدة"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} variant="outline">
                      إضافة
                    </Button>
                  </div>

                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="hover:text-blue-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Materials */}
            <Card>
              <CardHeader>
                <CardTitle>المواد المستخدمة</CardTitle>
                <CardDescription>قائمة بالمواد المستخدمة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      placeholder="أضف مادة جديدة"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMaterial())}
                    />
                    <Button type="button" onClick={addMaterial} variant="outline">
                      إضافة
                    </Button>
                  </div>

                  {materials.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {materials.map((material) => (
                        <span
                          key={material}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full"
                        >
                          {material}
                          <button
                            type="button"
                            onClick={() => removeMaterial(material)}
                            className="hover:text-green-600"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end pt-6 border-t">
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
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
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
        </div>
      </form>
    </div>
  );
}
