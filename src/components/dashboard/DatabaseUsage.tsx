'use client';

import { useEffect, useState } from 'react';
import { Database, HardDrive, Table, FileText } from 'lucide-react';

interface DatabaseStats {
  database: {
    name: string;
    size: string;
    sizeBytes: number;
    limit: string;
    limitBytes: number;
    available: string;
    availableBytes: number;
    usagePercentage: number;
  };
  records: {
    total: number;
    projects: number;
    articles: number;
    comments: number;
    articleComments: number;
    admins: number;
    mediaItems: number;
    articleMedia: number;
  };
  tables: Array<{
    name: string;
    size: string;
    sizeBytes: number;
  }>;
}

export default function DatabaseUsage() {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/database/stats', { 
        cache: 'no-store',
        credentials: 'same-origin'
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data);
        setError(null);
      } else {
        setError(data.error || 'حدث خطأ في جلب البيانات');
      }
    } catch (err) {
      setError('فشل الاتصال بالخادم');
      console.error('Error fetching database stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-600 text-center">{error || 'خطأ في تحميل البيانات'}</p>
        <button
          onClick={fetchStats}
          className="mt-4 mx-auto block px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          إعادة المحاولة
        </button>
      </div>
    );
  }

  const { database, records, tables } = stats;
  const isHighUsage = database.usagePercentage > 80;
  const isWarning = database.usagePercentage > 60;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
        <div className="flex items-center gap-3">
          <Database className="w-8 h-8" />
          <div>
            <h2 className="text-2xl font-bold">استهلاك قاعدة البيانات</h2>
            <p className="text-blue-100 text-sm">Neon PostgreSQL Database</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <HardDrive className="w-5 h-5" />
              <span className="font-semibold">الحجم المستخدم</span>
            </div>
            <p className="text-2xl font-bold text-blue-900">{database.size}</p>
            <p className="text-sm text-blue-600 mt-1">{database.usagePercentage}% من الحد الأقصى</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 text-green-700 mb-2">
              <Database className="w-5 h-5" />
              <span className="font-semibold">المساحة المتوفرة</span>
            </div>
            <p className="text-2xl font-bold text-green-900">{database.available}</p>
            <p className="text-sm text-green-600 mt-1">من أصل {database.limit}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
            <div className="flex items-center gap-2 text-purple-700 mb-2">
              <FileText className="w-5 h-5" />
              <span className="font-semibold">إجمالي السجلات</span>
            </div>
            <p className="text-2xl font-bold text-purple-900">{records.total.toLocaleString('ar-SA')}</p>
            <p className="text-sm text-purple-600 mt-1">سجل في قاعدة البيانات</p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">نسبة الاستخدام</span>
            <span className={`text-sm font-bold ${
              isHighUsage ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {database.usagePercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isHighUsage 
                  ? 'bg-gradient-to-r from-red-500 to-red-600' 
                  : isWarning 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' 
                  : 'bg-gradient-to-r from-green-500 to-green-600'
              }`}
              style={{ width: `${Math.min(database.usagePercentage, 100)}%` }}
            />
          </div>
          {isHighUsage && (
            <p className="text-red-600 text-sm mt-2">⚠️ تحذير: قاعدة البيانات قريبة من الحد الأقصى</p>
          )}
        </div>

        <div className="border-t pt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Table className="w-5 h-5" />
            توزيع السجلات حسب النوع
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-600 mb-1">المشاريع</p>
              <p className="text-xl font-bold text-gray-900">{records.projects}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-600 mb-1">المقالات</p>
              <p className="text-xl font-bold text-gray-900">{records.articles}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-600 mb-1">تعليقات المشاريع</p>
              <p className="text-xl font-bold text-gray-900">{records.comments}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-600 mb-1">تعليقات المقالات</p>
              <p className="text-xl font-bold text-gray-900">{records.articleComments}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-600 mb-1">وسائط المشاريع</p>
              <p className="text-xl font-bold text-gray-900">{records.mediaItems}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-600 mb-1">وسائط المقالات</p>
              <p className="text-xl font-bold text-gray-900">{records.articleMedia}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-xs text-gray-600 mb-1">المسؤولين</p>
              <p className="text-xl font-bold text-gray-900">{records.admins}</p>
            </div>
          </div>
        </div>

        {tables.length > 0 && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">أكبر الجداول</h3>
            <div className="space-y-2">
              {tables.slice(0, 5).map((table) => (
                <div key={table.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-700">{table.name}</span>
                  <span className="text-sm font-semibold text-gray-900">{table.size}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <p className="text-xs text-gray-500">
            آخر تحديث: {new Date().toLocaleString('ar-SA')}
          </p>
          <button
            onClick={fetchStats}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            تحديث البيانات
          </button>
        </div>
      </div>
    </div>
  );
}
