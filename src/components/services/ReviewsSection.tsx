'use client';

import { Star, ThumbsUp, Calendar, User, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { useLocale } from 'next-intl';

interface Review {
  id: string;
  name: string;
  rating: number;
  message: string;
  createdAt: Date;
  likes: number;
}

interface ReviewsSectionProps {
  reviews: Review[];
  categoryName: string;
  averageRating: number;
  totalReviews: number;
}

export default function ReviewsSection({
  reviews,
  categoryName,
  averageRating,
  totalReviews
}: ReviewsSectionProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [expandedReviews, setExpandedReviews] = useState<Set<string>>(new Set());

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const renderStars = (rating: number, size: 'sm' | 'lg' = 'sm') => {
    const starSize = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6';
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            } transition-all duration-300`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const distribution = getRatingDistribution();

  return (
    <section 
      id="reviews" 
      className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Overall Rating */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {isRTL ? 'تقييمات ومراجعات العملاء' : 'Customer Reviews & Ratings'}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            {isRTL 
              ? `آراء عملائنا حول خدمة ${categoryName}`
              : `What our customers say about ${categoryName} service`}
          </p>

          {/* Overall Rating Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto border-2 border-green-100 hover:border-green-300 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-1">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              {/* Rating Number */}
              <div className="text-center">
                <div className="text-6xl font-bold text-primary mb-2 animate-scale-in">
                  {averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {renderStars(Math.round(averageRating), 'lg')}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isRTL ? 'من أصل 5.0' : 'out of 5.0'}
                </div>
              </div>

              {/* Divider */}
              <div className="hidden md:block w-px h-24 bg-gray-200"></div>

              {/* Rating Distribution */}
              <div className="flex-1 w-full max-w-md">
                <div className="text-sm text-muted-foreground mb-3">
                  {isRTL ? `${totalReviews} تقييم من عملائنا` : `${totalReviews} customer ratings`}
                </div>
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count = distribution[rating as keyof typeof distribution];
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={rating} className="flex items-center gap-3 mb-2 group">
                      <div className="text-sm text-muted-foreground w-8">
                        {rating} <Star className="inline w-3 h-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-1000 ease-out group-hover:from-yellow-500 group-hover:to-yellow-600"
                          style={{ 
                            width: `${percentage}%`,
                            animation: 'slideInFromLeft 1s ease-out'
                          }}
                        ></div>
                      </div>
                      <div className="text-sm text-muted-foreground w-12 text-right">
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => {
              const isExpanded = expandedReviews.has(review.id);
              const shouldTruncate = review.message.length > 150;
              const displayMessage = isExpanded ? review.message : review.message.slice(0, 150) + (shouldTruncate ? '...' : '');

              return (
                <div
                  key={review.id}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-green-200 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {review.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-primary">{review.name}</div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {formatDate(review.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="mb-4">
                    {renderStars(review.rating)}
                  </div>

                  {/* Review Text */}
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {displayMessage}
                  </p>

                  {/* Expand/Collapse Button */}
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(review.id)}
                      className="text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      {isExpanded 
                        ? (isRTL ? 'عرض أقل' : 'Show less')
                        : (isRTL ? 'قراءة المزيد' : 'Read more')}
                    </button>
                  )}

                  {/* Footer */}
                  <div className="flex items-center gap-4 pt-4 border-t border-gray-100 mt-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{review.likes}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-muted-foreground">
              {isRTL ? 'لا توجد تقييمات بعد. كن أول من يقيم!' : 'No reviews yet. Be the first to review!'}
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="inline-block bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 hover:border-green-300 transition-all duration-300 hover:shadow-lg">
            <h3 className="text-2xl font-bold text-primary mb-3">
              {isRTL ? 'شارك تجربتك معنا!' : 'Share Your Experience!'}
            </h3>
            <p className="text-muted-foreground mb-6">
              {isRTL 
                ? 'رأيك يهمنا ويساعد الآخرين في اتخاذ القرار المناسب'
                : 'Your feedback helps others make the right decision'}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            width: 0;
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.5);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out backwards;
        }
      `}</style>
    </section>
  );
}
