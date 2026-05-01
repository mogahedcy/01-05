'use client';

import { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertCircle, Upload, X } from 'lucide-react';

interface UploadProgressProps {
  files: File[];
  onUploadComplete: (results: Array<Record<string, unknown>>) => void;
  onCancel: () => void;
}

export function UploadProgress({ files, onUploadComplete, onCancel }: UploadProgressProps) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'pending' | 'uploading' | 'success' | 'error'>>({});
  const [uploadResults, setUploadResults] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (files.length > 0 && !isUploading) {
      startUpload();
    }
  }, [files]);

  const startUpload = async () => {
    setIsUploading(true);
    const results: any[] = [];

    // تهيئة حالة الملفات
    const initialStatus: Record<string, 'pending'> = {};
    const initialProgress: Record<string, number> = {};

    files.forEach(file => {
      initialStatus[file.name] = 'pending';
      initialProgress[file.name] = 0;
    });

    setUploadStatus(initialStatus);
    setUploadProgress(initialProgress);

    // رفع الملفات واحد تلو الآخر
    for (const file of files) {
      try {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'uploading' }));

        const formData = new FormData();
        formData.append('file', file);

        // محاكاة تقدم الرفع
        const interval: NodeJS.Timeout = setInterval(() => {
          setUploadProgress(prev => {
            const current = prev[file.name] || 0;
            if (current < 90) {
              return { ...prev, [file.name]: current + 10 };
            }
            return prev;
          });
        }, 200);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        clearInterval(interval);
        setUploadProgress(prev => ({ ...prev, [file.name]: 100 }));

        const result = await response.json();

        if (response.ok) {
          setUploadStatus(prev => ({ ...prev, [file.name]: 'success' }));
          results.push(result.files?.[0] || result);
        } else {
          setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
          results.push({ error: result.error, originalName: file.name });
        }

      } catch (error) {
        setUploadStatus(prev => ({ ...prev, [file.name]: 'error' }));
        results.push({ error: 'فشل في الرفع', originalName: file.name });
      }
    }

    setUploadResults(results);
    setIsUploading(false);
    onUploadComplete(results);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Upload className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'في الانتظار...';
      case 'uploading':
        return 'جاري الرفع...';
      case 'success':
        return 'تم الرفع بنجاح';
      case 'error':
        return 'فشل في الرفع';
      default:
        return '';
    }
  };

  const overallProgress = files.length > 0 
    ? Math.round(Object.values(uploadProgress).reduce((sum, progress) => sum + progress, 0) / files.length)
    : 0;

  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">رفع الملفات ({files.length})</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-600"
          disabled={isUploading}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* شريط التقدم العام */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <span>التقدم العام</span>
          <span>{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>

      {/* قائمة الملفات */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {files.map((file) => (
          <div key={file.name} className="flex items-center space-x-3 space-x-reverse">
            {getStatusIcon(uploadStatus[file.name] || 'pending')}

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <span className="text-xs text-gray-500">
                  {((file.size || 0) / 1024 / 1024).toFixed(1)} MB
                </span>
              </div>

              <div className="flex items-center space-x-2 space-x-reverse mt-1">
                <Progress 
                  value={uploadProgress[file.name] || 0} 
                  className="h-1 flex-1" 
                />
                <span className="text-xs text-gray-500 min-w-fit">
                  {getStatusText(uploadStatus[file.name] || 'pending')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* إحصائيات الرفع */}
      {uploadResults.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-600">
              نجح: {uploadResults.filter(r => !r.error).length}
            </span>
            <span className="text-red-600">
              فشل: {uploadResults.filter(r => r.error).length}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}