'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Video, 
  Star,
  Tag,
  Save,
  Loader2,
  Plus,
  Play,
  FileText,
  User,
  ArrowRight
} from 'lucide-react';

interface MediaFile {
  id: string;
  file?: File;
  type: 'image' | 'video';
  preview: string;
  title: string;
  description: string;
  src?: string;
  existing?: boolean;
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

const SUGGESTED_TAGS = [
  'مظلات',
  'برجولات',
  'سواتر',
  'تنسيق حدائق',
  'جدة',
  'السعودية',
  'نصائح',
  'إرشادات',
  'تصميم',
  'جودة'
];

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('ديار جدة العالمية');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState(false);

  // Media and tags
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // Fetch article data
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${articleId}`);
        if (!response.ok) throw new Error('فشل في جلب بيانات المقال');
        
        const article = await response.json();
        
        setTitle(article.title || '');
        setContent(article.content || '');
        setExcerpt(article.excerpt || '');
        setAuthor(article.author || 'ديار جدة العالمية');
        setCategory(article.category || '');
        setFeatured(article.featured || false);
        
        // Load existing media
        if (article.mediaItems && article.mediaItems.length > 0) {
          const existingMedia = article.mediaItems.map((item: any, index: number) => ({
            id: item.id || `existing-${index}`,
            type: item.type === 'VIDEO' ? 'video' : 'image',
            preview: item.thumbnail || item.src,
            src: item.src,
            title: item.title || '',
            description: item.description || '',
            existing: true
          }));
          setMediaFiles(existingMedia);
        }
        
        // Load tags
        if (article.tags && article.tags.length > 0) {
          setTags(article.tags.map((t: any) => t.name || t));
        }
        
        setLoading(false);
      } catch (error) {
        console.error('خطأ في جلب المقال:', error);
        alert('فشل في تحميل بيانات المقال');
        router.push('/dashboard/articles');
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId, router]);

  // Handle file selection
  const handleFileSelect = useCallback((files: FileList) => {
    const newFiles: MediaFile[] = [];

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
        const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
        const preview = URL.createObjectURL(file);

        newFiles.push({
          id,
          file,
          type: file.type.startsWith('image/') ? 'image' : 'video',
          preview,
          title: file.name.split('.')[0],
          description: '',
          existing: false
        });
      }
    });

    setMediaFiles(prev => [...prev, ...newFiles]);
  }, []);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files?.length > 0) {
      handleFileSelect(files);
    }
  }, [handleFileSelect]);

  // Remove media file
  const removeMediaFile = (id: string) => {
    setMediaFiles(prev => {
      const file = prev.find(f => f.id === id);
      if (file?.preview && !file.existing) {
        URL.revokeObjectURL(file.preview);
      }
      return prev.filter(f => f.id !== id);
    });
  };

  // Update media file info
  const updateMediaFile = (id: string, field: 'title' | 'description', value: string) => {
    setMediaFiles(prev => prev.map(file => 
      file.id === id ? { ...file, [field]: value } : file
    ));
  };

  // Handle tag input
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const addSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  // Auto-generate excerpt from content
  const handleContentChange = (value: string) => {
    setContent(value);
  };

  // Upload new media files
  const uploadNewMediaFiles = async (): Promise<Array<{ type: string; src: string; thumbnail?: string; title: string; description: string }>> => {
    const uploadedMedia = [];
    const newFiles = mediaFiles.filter(f => !f.existing);

    for (const mediaFile of newFiles) {
      if (!mediaFile.file) continue;

      const formData = new FormData();
      formData.append('file', mediaFile.file);
      formData.append('folder', 'articles');

      try {
        console.log('🔄 رفع ملف جديد:', mediaFile.file.name);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          const result = await response.json();
          const fileUrl = result.files?.[0]?.src || result.files?.[0]?.url || result.secure_url || result.url;

          if (!fileUrl) {
            throw new Error('لم يتم الحصول على رابط الملف');
          }

          uploadedMedia.push({
            type: mediaFile.type.toUpperCase(),
            src: fileUrl,
            thumbnail: fileUrl,
            title: mediaFile.title,
            description: mediaFile.description
          });
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'فشل في رفع الملف');
        }
      } catch (error: any) {
        console.error('خطأ في رفع الملف:', error);
        throw new Error(`فشل في رفع الملف: ${mediaFile.file.name} - ${error.message}`);
      }
    }

    return uploadedMedia;
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !content || !category) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('🚀 بدء تحديث المقال...');

      // Upload new media files
      const newUploadedMedia = await uploadNewMediaFiles();

      // Combine existing media with newly uploaded media
      const existingMedia = mediaFiles
        .filter(f => f.existing && f.src)
        .map(f => ({
          type: f.type.toUpperCase(),
          src: f.src!,
          thumbnail: f.src!,
          title: f.title,
          description: f.description
        }));

      const allMedia = [...existingMedia, ...newUploadedMedia];

      // Update article
      const articleData = {
        title,
        content,
        excerpt: excerpt || content.substring(0, 200),
        author,
        category,
        featured,
        mediaItems: allMedia,
        tags
      };

      console.log('📊 بيانات التحديث:', articleData);

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(articleData),
      });

      const result = await response.json().catch(() => null);

      if (response.ok) {
        console.log('✅ تم تحديث المقال بنجاح');
        alert('تم تحديث المقال بنجاح!');
        router.push('/dashboard/articles');
      } else {
        console.error('❌ خطأ في تحديث المقال:', result);
        const message = (result && (result.error || result.message)) || 'فشل في تحديث المقال';
        alert(`خطأ: ${message}`);
      }
    } catch (error: any) {
      console.error('❌ خطأ في تحديث المقال:', error);
      alert(`خطأ في تحديث المقال: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-xl text-gray-600">جاري تحميل المقال...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard/articles')}
            >
              <ArrowRight className="w-4 h-4 ml-1" />
              العودة للمقالات
            </Button>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">تعديل المقال</h1>
          <p className="text-gray-600">قم بتعديل محتوى المقال وتحديثه</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                المعلومات الأساسية
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">عنوان المقال *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="عنوان جذاب ومفيد..."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">التصنيف *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">اختر التصنيف</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    الكاتب
                  </label>
                  <Input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="اسم الكاتب"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">محتوى المقال *</label>
                <Textarea
                  value={content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  placeholder="اكتب محتوى المقال هنا..."
                  rows={12}
                  required
                  className="font-normal"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {content.length} حرف - وقت القراءة المتوقع: {Math.ceil(content.length / 1000)} دقائق
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">المقتطف (Excerpt)</label>
                <Textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="ملخص قصير عن المقال..."
                  rows={3}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {excerpt ? excerpt.length : 0} / 200 حرف
                </p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center space-x-2 space-x-reverse">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm font-medium flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    مقال مميز
                  </span>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                الصور والفيديوهات
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
                  className="hidden"
                />

                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  اسحب الملفات هنا أو اختر ملفات
                </h3>
                <p className="text-gray-600 mb-4">
                  يدعم الصور والفيديوهات (JPG, PNG, MP4, MOV)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Plus className="w-4 h-4 ml-2" />
                  اختر ملفات
                </Button>
              </div>

              {/* Media Files */}
              {mediaFiles.length > 0 && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mediaFiles.map((mediaFile) => (
                    <div key={mediaFile.id} className="bg-white border rounded-lg p-4">
                      <div className="relative aspect-video mb-4 bg-gray-100 rounded-lg overflow-hidden">
                        {mediaFile.type === 'image' ? (
                          <Image
                            src={mediaFile.preview}
                            alt={mediaFile.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="relative w-full h-full">
                            <video
                              src={mediaFile.preview}
                              className="w-full h-full object-cover"
                              controls={false}
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Play className="w-12 h-12 text-white" />
                            </div>
                          </div>
                        )}

                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeMediaFile(mediaFile.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        
                        {mediaFile.existing && (
                          <Badge className="absolute bottom-2 right-2 bg-green-600">
                            ملف موجود
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Input
                          value={mediaFile.title}
                          onChange={(e) => updateMediaFile(mediaFile.id, 'title', e.target.value)}
                          placeholder="عنوان الملف"
                        />
                        <Textarea
                          value={mediaFile.description}
                          onChange={(e) => updateMediaFile(mediaFile.id, 'description', e.target.value)}
                          placeholder="وصف الملف"
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="w-5 h-5" />
                الكلمات المفتاحية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="أضف كلمة مفتاحية..."
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag}>
                    إضافة
                  </Button>
                </div>

                {/* Current tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Suggested tags */}
                <div>
                  <p className="text-sm font-medium mb-2">اقتراحات:</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED_TAGS.filter(tag => !tags.includes(tag)).map((tag) => (
                      <Button
                        key={tag}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addSuggestedTag(tag)}
                      >
                        #{tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 ml-2" />
                  حفظ التغييرات
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
