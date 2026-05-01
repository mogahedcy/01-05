import { type NextRequest, NextResponse } from 'next/server';
import ai, { GROQ_MODEL } from '@/lib/groq-client';

/**
 * API لتحليل المنافسين باستخدام Gemini AI
 * POST /api/ai/analyze-competitors
 */

export interface CompetitorAnalysisRequest {
  projectTitle: string;
  category: string;
  description?: string;
  location?: string;
  keywords?: string[];
}

export interface CompetitorAnalysisResponse {
  success: boolean;
  analysis?: {
    topRankingFactors: string[];
    suggestedKeywords: string[];
    contentStructure: string[];
    titleSuggestions: string[];
    imageSuggestions: string[];
    descriptionImprovement: string;
    competitiveAdvantages: string[];
    marketInsights: string;
  };
  error?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CompetitorAnalysisRequest = await request.json();
    const { projectTitle, category, description, location, keywords } = body;

    // التحقق من البيانات المطلوبة
    if (!projectTitle || !category) {
      return NextResponse.json(
        { success: false, error: 'عنوان المشروع والفئة مطلوبان' },
        { status: 400 }
      );
    }

    // التحقق من توفر مفتاح Groq API
    const apiKey = process.env.GROQ_API_KEY;
    console.log('🔑 GROQ_API_KEY exists:', !!apiKey);
    console.log('🔑 GROQ_API_KEY length:', apiKey?.length || 0);
    
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'مفتاح Groq API غير متوفر' },
        { status: 500 }
      );
    }

    // بناء prompt متقدم لتحليل المنافسين
    const prompt = `أنت خبير SEO ومحلل منافسين متخصص في مجال ${category} في السعودية، وخاصةً في ${location || 'جدة'}.

**معلومات المشروع:**
- العنوان: ${projectTitle}
- الفئة: ${category}
- الموقع: ${location || 'جدة'}
- الوصف: ${description || 'غير متوفر'}
- الكلمات المفتاحية الحالية: ${keywords?.join(', ') || 'غير متوفر'}

**المهمة: تحليل شامل للمنافسين وتقديم توصيات محددة**

قم بتحليل السوق وتقديم النتائج التالية بصيغة JSON:

1. **topRankingFactors** (مصفوفة من 5-7 عوامل): حدد أهم العوامل التي تجعل المشاريع المماثلة تتصدر نتائج البحث في Google
   - ركز على SEO العملي والتقني
   - اذكر استراتيجيات محددة قابلة للتطبيق

2. **suggestedKeywords** (مصفوفة من 10-15 كلمة): اقترح كلمات مفتاحية طويلة (long-tail keywords) محددة
   - يجب أن تكون باللغة العربية
   - ركز على الكلمات التي يبحث عنها العملاء فعلياً
   - ضمّن موقع جدة أو المدن القريبة

3. **contentStructure** (مصفوفة من 6-8 نقاط): حدد البنية المثلى للمحتوى
   - العناوين الرئيسية (H1, H2, H3)
   - الأقسام الضرورية
   - العناصر التي يجب تضمينها (صور، فيديو، مواصفات، إلخ)

4. **titleSuggestions** (مصفوفة من 3 عناوين): اقترح 3 عناوين بديلة جذابة ومحسّنة لمحركات البحث
   - يجب أن تكون باللغة العربية
   - طول كل عنوان بين 50-70 حرف
   - تضمين الكلمات المفتاحية الأساسية

5. **imageSuggestions** (مصفوفة من 5-7 توصيات): توصيات محددة لتحسين الصور
   - أنواع الصور المطلوبة
   - زوايا التصوير المفضلة
   - عناصر يجب تضمينها في الصور

6. **descriptionImprovement** (نص): اقترح وصفاً محسّناً للمشروع
   - بين 120-160 حرف
   - يتضمن الكلمات المفتاحية الرئيسية
   - جذاب ومقنع للعملاء المحتملين

7. **competitiveAdvantages** (مصفوفة من 4-6 ميزات): حدد الميزات التنافسية التي يجب إبرازها
   - ميزات فريدة يمكن التركيز عليها
   - نقاط قوة المشروع مقارنة بالمنافسين

8. **marketInsights** (نص): تحليل السوق والاتجاهات الحالية
   - اتجاهات البحث في ${category}
   - توقعات الطلب
   - فرص النمو

**مهم جداً:**
- الرد يجب أن يكون JSON صحيح فقط، بدون أي نص إضافي
- جميع النصوص باللغة العربية
- كن محدداً وعملياً في التوصيات
- ركز على السوق السعودي وخاصة جدة`;

    console.log('🤖 بدء تحليل المنافسين باستخدام Groq AI...');

    // استدعاء Groq AI
    const result = await ai.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });
    
    const analysisText = result.choices[0]?.message?.content || '';

    if (!analysisText) {
      return NextResponse.json(
        { success: false, error: 'لم يتم الحصول على استجابة من AI' },
        { status: 500 }
      );
    }

    console.log('✅ تم الحصول على التحليل من Groq AI');

    // تنظيف النص وإزالة markdown code blocks إذا وجدت
    let cleanedText = analysisText.trim();
    if (cleanedText.startsWith('```json')) {
      cleanedText = cleanedText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (cleanedText.startsWith('```')) {
      cleanedText = cleanedText.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // تحويل النص إلى JSON
    let analysis;
    try {
      analysis = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('❌ فشل في تحليل JSON:', parseError);
      console.error('النص المستلم:', cleanedText);
      
      // محاولة إصلاح JSON التالف
      try {
        // إزالة الأحرف غير المرغوب فيها
        const cleaned = cleanedText.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
        analysis = JSON.parse(cleaned);
      } catch {
        return NextResponse.json(
          { 
            success: false, 
            error: 'فشل في تحليل استجابة AI. يرجى المحاولة مرة أخرى.' 
          },
          { status: 500 }
        );
      }
    }

    // التحقق من صحة البيانات المستلمة
    const validatedAnalysis = {
      topRankingFactors: Array.isArray(analysis.topRankingFactors) ? analysis.topRankingFactors : [],
      suggestedKeywords: Array.isArray(analysis.suggestedKeywords) ? analysis.suggestedKeywords : [],
      contentStructure: Array.isArray(analysis.contentStructure) ? analysis.contentStructure : [],
      titleSuggestions: Array.isArray(analysis.titleSuggestions) ? analysis.titleSuggestions : [],
      imageSuggestions: Array.isArray(analysis.imageSuggestions) ? analysis.imageSuggestions : [],
      descriptionImprovement: analysis.descriptionImprovement || '',
      competitiveAdvantages: Array.isArray(analysis.competitiveAdvantages) ? analysis.competitiveAdvantages : [],
      marketInsights: analysis.marketInsights || ''
    };

    console.log('✅ تم التحقق من صحة التحليل');

    return NextResponse.json({
      success: true,
      analysis: validatedAnalysis
    });

  } catch (error: any) {
    console.error('❌ خطأ في تحليل المنافسين:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'حدث خطأ أثناء تحليل المنافسين' 
      },
      { status: 500 }
    );
  }
}
