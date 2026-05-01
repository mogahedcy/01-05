# دليل نظام التوليد الذكي للمحتوى
# Smart Content Generation System Guide

## نظرة عامة | Overview

نظام التوليد الذكي للمحتوى هو نظام متقدم يستخدم الذكاء الاصطناعي لتوليد مقالات محسنة لمحركات البحث (SEO) بناءً على تحليل المنافسين واحتياجات السوق.

The Smart Content Generation System is an advanced AI-powered system that generates SEO-optimized articles based on competitor analysis and market needs.

## الحالة الحالية | Current Status

### الوضع الحالي | Current Mode: **Mock Data Mode**

- ✅ **البنية التحتية جاهزة**: النظام مبني ومجهز للعمل
- ⚠️ **بيانات محاكاة**: يستخدم حالياً بيانات تجريبية لتحليل المنافسين
- 🔧 **جاهز للإنتاج**: يمكن دمج API بحث حقيقي بسهولة

- ✅ **Infrastructure Ready**: System is built and ready to work
- ⚠️ **Mock Data**: Currently uses demo data for competitor analysis
- 🔧 **Production Ready**: Can easily integrate real search API

## كيفية الاستخدام | How to Use

### 1. الوصول إلى API | API Access

**Endpoint**: `POST /api/ai-agent/smart-auto-generate`

**Authentication**: Requires admin authentication (admin-token cookie)

### 2. طلب التوليد | Generation Request

```json
{
  "niche": "البرجولات الخشبية في جدة",
  "count": 3,
  "autoPublish": false
}
```

**Parameters**:
- `niche` (required): المجال أو الموضوع | Topic or niche
- `count` (required): عدد المقالات (1-10) | Number of articles (1-10)
- `autoPublish` (optional): نشر تلقائي؟ | Auto-publish? (default: false)

### 3. الاستجابة | Response

```json
{
  "success": true,
  "message": "تم توليد 3 من أصل 3 مقالات بنجاح",
  "analysis": {
    "niche": "البرجولات الخشبية في جدة",
    "webSearchUsed": false,
    "competitorUrls": [],
    "competitorInsights": {
      "topKeywords": [...],
      "targetAudience": "...",
      "toneAndStyle": "...",
      "contentGaps": [...]
    },
    "stats": {
      "totalRequested": 3,
      "successCount": 3,
      "failureCount": 0,
      "averageSeoScore": 85
    }
  },
  "results": [
    {
      "success": true,
      "title": "...",
      "id": "art_...",
      "seoScore": 85
    }
  ]
}
```

## مراحل التوليد | Generation Phases

### المرحلة 1: تحليل المنافسين | Phase 1: Competitor Analysis
- 🔍 تحليل استراتيجيات المنافسين
- 📊 استخراج الكلمات المفتاحية
- 🎯 تحديد الجمهور المستهدف
- 📝 تحديد أسلوب الكتابة السائد

### المرحلة 2: توليد أفكار المقالات | Phase 2: Article Ideas Generation
- 💡 توليد عناوين جذابة
- 🗂️ تحديد التصنيفات المناسبة
- 📋 إنشاء مخطط المقال
- 🔑 اختيار الكلمات المفتاحية

### المرحلة 3: كتابة المحتوى | Phase 3: Content Writing
- ✍️ كتابة محتوى بشري طبيعي
- 🎨 تطبيق أسلوب الكتابة المناسب
- 📈 تحسين لمحركات البحث
- 🔗 إضافة روابط داخلية

### المرحلة 4: اختيار الصور | Phase 4: Image Selection
- 🖼️ اختيار صور مناسبة
- 📝 توليد نص بديل (alt text)
- 🎯 ربط الصور بالمحتوى

### المرحلة 5: الحفظ والنشر | Phase 5: Save & Publish
- 💾 حفظ في قاعدة البيانات
- 📊 تحليل SEO
- 🚀 نشر أو حفظ كمسودة

## اختبار النظام | Testing the System

### 1. اختبار أساسي | Basic Test

```bash
curl -X POST http://localhost:5000/api/ai-agent/smart-auto-generate \
  -H "Content-Type: application/json" \
  -H "Cookie: admin-token=YOUR_TOKEN" \
  -d '{
    "niche": "مظلات السيارات",
    "count": 1,
    "autoPublish": false
  }'
```

### 2. التحقق من الجودة | Quality Verification

عند اختبار النظام، تحقق من:
- ✅ جودة المحتوى ومدى طبيعيته
- ✅ تنوع العناوين والأفكار
- ✅ دقة الكلمات المفتاحية
- ✅ جودة Meta Tags
- ✅ ملاءمة الصور المختارة
- ✅ درجة SEO (يجب أن تكون > 70)

When testing, verify:
- ✅ Content quality and naturalness
- ✅ Variety of titles and ideas
- ✅ Keyword accuracy
- ✅ Meta tags quality
- ✅ Image relevance
- ✅ SEO score (should be > 70)

### 3. معايير النجاح | Success Criteria

| المعيار | Criterion | الهدف | Target |
|---------|-----------|--------|---------|
| نسبة النجاح | Success Rate | > 90% | > 90% |
| درجة SEO | SEO Score | > 75 | > 75 |
| طبيعية المحتوى | Content Naturalness | عالية | High |
| تنوع المحتوى | Content Variety | جيد | Good |

## التكامل مع بحث حقيقي | Real Search Integration

### الخطوات المطلوبة | Required Steps

1. **اختيار مزود البحث | Choose Search Provider**:
   - Google Custom Search API
   - Bing Search API
   - SerpAPI

2. **إضافة متغيرات البيئة | Add Environment Variables**:
   ```bash
   ENABLE_REAL_WEB_SEARCH=true
   SEARCH_API_KEY=your_api_key
   SEARCH_API_CX=your_search_engine_id  # For Google
   ```

3. **تحديث الكود | Update Code**:
   - تعديل `searchCompetitorContent()` في `src/lib/competitor-analyzer.ts`
   - استبدال البيانات المحاكاة بنتائج API الحقيقية
   - تعيين `isRealSearch = true`

4. **اختبار البحث الحقيقي | Test Real Search**:
   - التحقق من صحة النتائج
   - مراقبة استهلاك API
   - تطبيق Rate Limiting

## الملاحظات المهمة | Important Notes

### ⚠️ الحد من الاستخدام | Usage Limits
- الحد الأقصى: 10 مقالات في الطلب الواحد
- يُنصح بـ 3-5 مقالات للحصول على أفضل النتائج
- مراقبة استهلاك Google AI API

### 🔒 الأمان | Security
- مطلوب مصادقة Admin
- التحقق من صحة المدخلات
- تطهير المحتوى المُولد

### 📊 المراقبة | Monitoring
- تتبع نسبة النجاح
- مراقبة درجات SEO
- تحليل جودة المحتوى

## الأسئلة الشائعة | FAQ

### Q: لماذا `webSearchUsed` دائماً `false`؟
**A**: النظام يستخدم حالياً بيانات محاكاة. سيتحول إلى `true` بعد تكامل API بحث حقيقي.

### Q: Why is `webSearchUsed` always `false`?
**A**: The system currently uses mock data. It will switch to `true` after integrating a real search API.

### Q: كيف أحسّن جودة المحتوى؟
**A**: 
- استخدم مجالات محددة ودقيقة
- قدم كلمات مفتاحية واضحة
- راجع النتائج وقدم ملاحظات

### Q: How do I improve content quality?
**A**:
- Use specific and precise niches
- Provide clear keywords
- Review results and provide feedback

## الدعم | Support

للمزيد من المعلومات، راجع:
- `docs/SEO-AGENT.md` - دليل SEO Agent
- `replit.md` - نظرة عامة على المشروع

For more information, see:
- `docs/SEO-AGENT.md` - SEO Agent Guide
- `replit.md` - Project Overview
