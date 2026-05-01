"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, TrendingUp, Eye, Heart, MessageCircle, CheckCircle, Trash2, Star, Award, ThumbsUp, ThumbsDown, BarChart3, Wifi, Send } from "lucide-react";
import DatabaseUsage from "@/components/dashboard/DatabaseUsage";

interface TrendPoint { date: string; views: number; likes: number; comments: number }
interface TopProject { id: string; title: string; slug: string | null; cover: string | null; views: number }
interface RecentComment { id: string; name: string; message: string; rating: number; status: string; createdAt: string; project: { id: string; title: string; slug: string | null } }
interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: { 1: number; 2: number; 3: number; 4: number; 5: number };
  totalCommentLikes: number;
  totalCommentDislikes: number;
  satisfactionRate: number;
  topCommentedProjects: Array<{ id: string; title: string; slug: string | null; rating: number; commentCount: number; cover: string | null }>;
  ratingTrends: Array<{ date: string; count: number; averageRating: number }>;
}

export default function OverviewClient() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [sources, setSources] = useState<Record<string, number>>({});
  const [topProjects, setTopProjects] = useState<TopProject[]>([]);
  const [recentComments, setRecentComments] = useState<RecentComment[]>([]);
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [error, setError] = useState<string>("");
  const [testingN8n, setTestingN8n] = useState(false);

  const testN8nConnection = async () => {
    setTestingN8n(true);
    try {
      const res = await fetch("/api/n8n/test", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        alert("✅ تم بنجاح: " + data.message);
      } else {
        alert("❌ فشل: " + data.message);
      }
    } catch (e) {
      alert("❌ خطأ في الاتصال بالخادم");
    } finally {
      setTestingN8n(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/dashboard/stats", { cache: "no-store" });
        const data = await res.json();
        if (res.ok && data.success) {
          setStats(data.stats);
          setTrends(data.trends || []);
          setSources(data.sources || {});
          setTopProjects(data.topProjects || []);
          setRecentComments(data.recentComments || []);
          setReviewStats(data.reviewStats || null);
        } else {
          setError(data.error || "فشل في جلب الإحصائيات");
        }
      } catch (e) {
        setError("تعذر الاتصال بالخادم");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const maxViews = useMemo(() => Math.max(1, ...trends.map(t => t.views)), [trends]);
  const maxLikes = useMemo(() => Math.max(1, ...trends.map(t => t.likes)), [trends]);
  const maxComments = useMemo(() => Math.max(1, ...trends.map(t => t.comments)), [trends]);

  const moderateComment = async (c: RecentComment, action: "approve" | "delete") => {
    try {
      if (action === "approve") {
        const res = await fetch(`/api/projects/${c.project.id}/comments`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ commentId: c.id, status: "APPROVED" })
        });
        if (res.ok) {
          setRecentComments(prev => prev.map(x => x.id === c.id ? { ...x, status: "APPROVED" } : x));
        }
      } else {
        const res = await fetch(`/api/projects/${c.project.id}/comments?commentId=${c.id}`, { method: "DELETE" });
        if (res.ok) {
          setRecentComments(prev => prev.filter(x => x.id !== c.id));
        }
      }
    } catch {}
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin" /></div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">{error}</div>;
  }

  return (
    <div className="space-y-8">
      {/* N8N Test Connection Card */}
      <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2 text-indigo-900">
              <Wifi className="w-5 h-5" /> اختبار الاتصال مع n8n
            </CardTitle>
            <p className="text-xs text-indigo-700">تأكد من أن الرابط يعمل بشكل صحيح لاستقبال المشاريع الجديدة</p>
          </div>
          <Button 
            onClick={testN8nConnection} 
            disabled={testingN8n}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {testingN8n ? <Loader2 className="w-4 h-4 animate-spin ml-2" /> : <Send className="w-4 h-4 ml-2" />}
            {testingN8n ? "جاري الاختبار..." : "ارسال بيانات تجريبية"}
          </Button>
        </CardHeader>
      </Card>

      {/* Database Usage */}
      <DatabaseUsage />

      {/* Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Eye className="w-4 h-4" /> المشاهدات (7 أيام)</CardTitle>
            <Badge variant="secondary">{trends.reduce((a, b) => a + b.views, 0)} إجمالي</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-24">
              {trends.map((t, i) => (
                <div key={`v-${i}`} className="flex-1">
                  <div className="bg-emerald-500 rounded-t" style={{ height: `${Math.round((t.views / maxViews) * 100)}%`, minHeight: 2 }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Heart className="w-4 h-4" /> الإعجابات (7 أيام)</CardTitle>
            <Badge variant="secondary">{trends.reduce((a, b) => a + b.likes, 0)} إجمالي</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-24">
              {trends.map((t, i) => (
                <div key={`l-${i}`} className="flex-1">
                  <div className="bg-rose-500 rounded-t" style={{ height: `${Math.round((t.likes / maxLikes) * 100)}%`, minHeight: 2 }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><MessageCircle className="w-4 h-4" /> التعليقات (7 أيام)</CardTitle>
            <Badge variant="secondary">{trends.reduce((a, b) => a + b.comments, 0)} إجمالي</Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2 h-24">
              {trends.map((t, i) => (
                <div key={`c-${i}`} className="flex-1">
                  <div className="bg-indigo-500 rounded-t" style={{ height: `${Math.round((t.comments / maxComments) * 100)}%`, minHeight: 2 }} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top projects and recent comments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2"><TrendingUp className="w-4 h-4" /> أفضل المشاريع (30 يوم)</CardTitle>
          </CardHeader>
          <CardContent>
            {topProjects.length === 0 ? (
              <div className="text-sm text-gray-500">لا توجد بيانات كافية</div>
            ) : (
              <div className="space-y-3">
                {topProjects.map(p => (
                  <div key={p.id} className="flex items-center gap-3">
                    <div className="relative w-14 h-14 rounded overflow-hidden bg-gray-100">
                      {p.cover ? (
                        <Image src={p.cover} alt={p.title} fill sizes="56px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link href={p.slug ? `/portfolio/${p.slug}` : `/portfolio/${p.id}`} className="font-medium text-sm line-clamp-1 hover:underline">
                        {p.title}
                      </Link>
                      <div className="text-xs text-gray-500 flex items-center gap-1"><Eye className="w-3 h-3" /> {p.views} مشاهدة</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">أحدث التعليقات</CardTitle>
          </CardHeader>
          <CardContent>
            {recentComments.length === 0 ? (
              <div className="text-sm text-gray-500">لا توجد تعليقات</div>
            ) : (
              <div className="space-y-4">
                {recentComments.map(c => (
                  <div key={c.id} className="flex items-start justify-between gap-3 border-b last:border-b-0 pb-3">
                    <div className="min-w-0">
                      <div className="text-sm font-medium line-clamp-1">{c.name} على <Link className="hover:underline" href={c.project.slug ? `/portfolio/${c.project.slug}` : `/portfolio/${c.project.id}`}>{c.project.title}</Link></div>
                      <div className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString('ar-SA')}</div>
                      <div className="text-sm text-gray-700 mt-1 line-clamp-2">{c.message}</div>
                      <div className="mt-1">
                        <Badge variant={c.status === 'APPROVED' ? 'default' : 'outline'}>{c.status === 'APPROVED' ? 'معتمدة' : 'في الانتظار'}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {c.status !== 'APPROVED' && (
                        <Button variant="outline" size="sm" onClick={() => moderateComment(c, 'approve')}>
                          <CheckCircle className="w-4 h-4 ml-1" /> اعتماد
                        </Button>
                      )}
                      <Button variant="destructive" size="sm" onClick={() => moderateComment(c, 'delete')}>
                        <Trash2 className="w-4 h-4 ml-1" /> حذف
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">مصادر الزيارات (30 يوم)</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(sources).length === 0 ? (
            <div className="text-sm text-gray-500">لا توجد بيانات كافية</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(sources).map(([name, count]) => (
                <div key={name} className="bg-white rounded border p-3">
                  <div className="text-sm font-medium mb-2">{name}</div>
                  <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
                    <div className="h-2 bg-sky-500" style={{ width: `${count / Math.max(...Object.values(sources)) * 100}%` }} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{count} زيارة</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Review Statistics */}
      {reviewStats && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><Award className="w-5 h-5 text-amber-600" /> متوسط التقييم</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="text-4xl font-bold text-amber-600">{reviewStats.averageRating.toFixed(1)}</div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < Math.round(reviewStats.averageRating) ? 'text-amber-400 fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <div className="text-xs text-gray-600">{reviewStats.totalReviews} تقييم</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><BarChart3 className="w-5 h-5 text-green-600" /> معدل الرضا</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">{reviewStats.satisfactionRate.toFixed(1)}%</div>
                <div className="text-xs text-gray-600 mt-1">تقييمات 4-5 نجوم</div>
                <div className="h-2 w-full bg-gray-200 rounded overflow-hidden mt-2">
                  <div className="h-2 bg-green-500 rounded" style={{ width: `${reviewStats.satisfactionRate}%` }} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><ThumbsUp className="w-5 h-5 text-blue-600" /> الإعجابات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600">{reviewStats.totalCommentLikes}</div>
                <div className="text-xs text-gray-600 mt-1">على التعليقات</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
              <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2"><ThumbsDown className="w-5 h-5 text-red-600" /> عدم الإعجاب</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-red-600">{reviewStats.totalCommentDislikes}</div>
                <div className="text-xs text-gray-600 mt-1">على التعليقات</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">توزيع التقييمات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map(rating => {
                    const count = reviewStats.ratingDistribution[rating as keyof typeof reviewStats.ratingDistribution];
                    const percentage = reviewStats.totalReviews > 0 ? (count / reviewStats.totalReviews) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center gap-3">
                        <div className="flex items-center gap-1 w-20">
                          <span className="text-sm font-medium">{rating}</span>
                          <Star className="w-4 h-4 text-amber-400 fill-current" />
                        </div>
                        <div className="flex-1 h-3 bg-gray-200 rounded overflow-hidden">
                          <div className="h-3 bg-amber-500 rounded" style={{ width: `${percentage}%` }} />
                        </div>
                        <span className="text-sm font-medium w-12 text-right">{count}</span>
                        <span className="text-xs text-gray-500 w-12 text-left">({percentage.toFixed(0)}%)</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">المشاريع الأكثر تعليقاً</CardTitle>
              </CardHeader>
              <CardContent>
                {reviewStats.topCommentedProjects.length === 0 ? (
                  <div className="text-sm text-gray-500">لا توجد بيانات كافية</div>
                ) : (
                  <div className="space-y-3">
                    {reviewStats.topCommentedProjects.map(p => (
                      <div key={p.id} className="flex items-center gap-3">
                        <div className="relative w-14 h-14 rounded overflow-hidden bg-gray-100">
                          {p.cover ? (
                            <Image src={p.cover} alt={p.title} fill sizes="56px" className="object-cover" />
                          ) : (
                            <div className="w-full h-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={p.slug ? `/portfolio/${p.slug}` : `/portfolio/${p.id}`} className="font-medium text-sm line-clamp-1 hover:underline">
                            {p.title}
                          </Link>
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MessageCircle className="w-3 h-3" /> {p.commentCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-amber-400 fill-current" /> {p.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
