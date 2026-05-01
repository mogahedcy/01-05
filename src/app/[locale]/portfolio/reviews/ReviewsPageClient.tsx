'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Star,
  MessageCircle,
  Calendar,
  User,
  Filter,
  TrendingUp,
  Award
} from 'lucide-react';

interface Comment {
  id: string;
  name: string;
  message: string;
  rating: number;
  createdAt: string;
  projectTitle: string;
  projectId: string;
  avatar?: string;
}

export default function ReviewsPageClient() {
  const [reviews, setReviews] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating'>('newest');

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
      }
    } catch (error) {
      console.error('خطأ في جلب المراجعات:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallStats = () => {
    if (reviews.length === 0) return { average: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };

    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    const average = (sum / reviews.length).toFixed(1);

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });

    return { average: Number.parseFloat(average), distribution };
  };

  const renderStars = (rating: number, size = 'w-5 h-5') => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${size} ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredAndSortedReviews = () => {
    const filtered = reviews.filter(review => 
      filterRating ? review.rating === filterRating : true
    );

    switch (sortBy) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
    }

    return filtered;
  };

  const stats = calculateOverallStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                تقييمات ومراجعات العملاء
              </h1>
              <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                اكتشف ما يقوله عملاؤنا الكرام عن خدماتنا وجودة أعمالنا
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* الإحصائيات العامة */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
        >
          <div className="grid md:grid-cols-3 gap-8">
            {/* التقييم العام */}
            <div className="text-center">
              <div className="text-6xl font-bold text-blue-600 mb-2">
                {stats.average}
              </div>
              <div className="flex justify-center mb-2">
                {renderStars(Math.round(stats.average), 'w-6 h-6')}
              </div>
              <p className="text-gray-600 text-lg">
                من أصل {reviews.length} تقييم
              </p>
            </div>

            {/* توزيع التقييمات */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 mb-4">توزيع التقييمات</h3>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium w-3">{rating}</span>
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                      style={{
                        width: reviews.length > 0 
                          ? `${(stats.distribution[rating as keyof typeof stats.distribution] / reviews.length) * 100}%`
                          : '0%'
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {stats.distribution[rating as keyof typeof stats.distribution]}
                  </span>
                </div>
              ))}
            </div>

            {/* إحصائيات إضافية */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 mb-4">إحصائيات المراجعات</h3>
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <span className="text-sm text-gray-600">
                  {((stats.distribution[5] + stats.distribution[4]) / reviews.length * 100).toFixed(0)}% تقييمات إيجابية
                </span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">
                  متوسط {Math.round(reviews.reduce((acc, r) => acc + r.message.length, 0) / reviews.length)} كلمة في المراجعة
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* أدوات التصفية والترتيب */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="font-medium text-gray-900">تصفية وترتيب:</span>
            </div>

            <div className="flex items-center gap-4">
              {/* تصفية حسب التقييم */}
              <select
                value={filterRating || ''}
                onChange={(e) => setFilterRating(e.target.value ? Number.parseInt(e.target.value) : null)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">جميع التقييمات</option>
                <option value="5">5 نجوم</option>
                <option value="4">4 نجوم</option>
                <option value="3">3 نجوم</option>
                <option value="2">2 نجمة</option>
                <option value="1">نجمة واحدة</option>
              </select>

              {/* ترتيب */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'rating')}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="newest">الأحدث</option>
                <option value="oldest">الأقدم</option>
                <option value="rating">أعلى تقييم</option>
              </select>
            </div>
          </div>
        </div>

        {/* قائمة المراجعات */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">جاري تحميل المراجعات...</p>
          </div>
        ) : filteredAndSortedReviews().length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              لا توجد مراجعات
            </h3>
            <p className="text-gray-500">
              لم يتم العثور على مراجعات تطابق المعايير المحددة
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredAndSortedReviews().map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden ml-4">
                      <img
                        src={review.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=059669&color=fff`}
                        alt={review.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {review.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        {renderStars(review.rating, 'w-4 h-4')}
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="w-3 h-3 ml-1" />
                          {new Date(review.createdAt).toLocaleDateString('ar-SA')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Badge variant="outline" className="text-xs">
                    {review.projectTitle}
                  </Badge>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  {review.message}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}