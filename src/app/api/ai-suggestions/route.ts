import { type NextRequest, NextResponse } from 'next/server';
import { SEOAgent } from '@/lib/seo-agent';
import { analyzeCompetitors } from '@/lib/competitor-analyzer';

const seoAgent = new SEOAgent();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, category, location, type = 'project' } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'العنوان مطلوب' },
        { status: 400 }
      );
    }

    console.log('🤖 طلب اقتراحات AI:', { title, category, location, type });

    const suggestions: any = {
      keywords: [],
      titleSuggestions: [],
      descriptionSuggestions: [],
      metaTags: null,
      contentSuggestions: null,
      competitorAnalysis: null
    };

    // تجهيز المحتوى للتحليل - سياق غني للمحترفين
    const content = `المشروع: ${title}. 
الوصف: ${description || ''}. 
التصنيف التقني: ${category || 'غير محدد'}. 
الموقع الجغرافي: ${location || 'جدة، السعودية'}.
الهدف: استهداف عملاء النخبة في المنطقة الغربية وتصدر نتائج البحث المحلية.`;

    // 1. تحليل المنافسين المتصدرين في محركات البحث 🔥
    console.log('🔍 بدء تحليل المنافسين...');
    let competitorKeywords: string[] = [];
    let competitorTitles: string[] = [];
    
    try {
      const searchQuery = `${title} ${category || ''} ${location || 'السعودية'}`.trim();
      const competitorAnalysis = await analyzeCompetitors(searchQuery, true);
      
      suggestions.competitorAnalysis = {
        topKeywords: competitorAnalysis.topKeywords || [],
        titleSuggestions: competitorAnalysis.titleSuggestions || [],
        contentStrategy: competitorAnalysis.contentStrategy,
        targetAudience: competitorAnalysis.targetAudience,
        contentGaps: competitorAnalysis.contentGaps || [],
        aiBasedAnalysis: competitorAnalysis.aiBasedAnalysis,
        analysisMethod: competitorAnalysis.analysisMethod
      };
      
      competitorKeywords = competitorAnalysis.topKeywords?.slice(0, 10) || [];
      competitorTitles = competitorAnalysis.titleSuggestions?.slice(0, 3) || [];
      
      console.log('✅ تم تحليل المنافسين:', {
        keywords: competitorKeywords.length,
        titles: competitorTitles.length
      });
    } catch (error) {
      console.error('⚠️ تعذر تحليل المنافسين:', error);
    }

    // 2. توليد الكلمات المفتاحية مع دمج نتائج المنافسين
    const initialKeywords = [
      category || 'مشاريع',
      location || 'السعودية',
      'جدة',
      'ديار جدة العالمية',
      ...competitorKeywords.slice(0, 5)
    ];
    
    try {
      const keywordAnalysis = await seoAgent.analyzeKeywords(content, initialKeywords);
      const allKeywords = [
        ...keywordAnalysis.primary_keywords,
        ...keywordAnalysis.secondary_keywords.slice(0, 5),
        ...competitorKeywords.slice(0, 5)
      ];
      
      // إزالة التكرارات وضمان الجودة
      suggestions.keywords = [...new Set(allKeywords)].filter(k => k.length > 2);
      console.log('✅ تم توليد الكلمات المفتاحية الاحترافية:', suggestions.keywords.length);
    } catch (error) {
      console.error('خطأ في توليد الكلمات المفتاحية:', error);
      suggestions.keywords = [
        category || 'مشاريع',
        location || 'السعودية',
        'جدة',
        'ديار جدة العالمية',
        title.split(' ').slice(0, 3).join(' '),
        ...competitorKeywords.slice(0, 5)
      ];
    }

    // 3. توليد اقتراحات للعناوين مع دمج اقتراحات المنافسين
    try {
      const baseTitle = [
        `${title} في ${location || 'السعودية'} - ديار جدة العالمية`,
        `${category || 'مشروع'} احترافي: ${title} | ${location || 'جدة'}`,
        `تنفيذ ${category || 'مشروع'} ${title} بأعلى جودة في ${location || 'السعودية'}`
      ];
      
      // دمج عناوين المنافسين المحسّنة
      suggestions.titleSuggestions = [
        ...baseTitle,
        ...competitorTitles
      ].slice(0, 5);
      
      console.log('✅ تم توليد اقتراحات العناوين:', suggestions.titleSuggestions.length);
    } catch (error) {
      console.error('خطأ في توليد العناوين:', error);
      suggestions.titleSuggestions = [
        `${title} في ${location || 'السعودية'} - ديار جدة العالمية`,
        `${category || 'مشروع'} احترافي: ${title}`,
        `تنفيذ ${category || 'مشروع'} ${title} بأعلى جودة`
      ];
    }

    // 4. توليد اقتراحات لتحسين الوصف
    if (description) {
      try {
        const contentAnalysis = await seoAgent.analyzeContent(
          description,
          suggestions.keywords.slice(0, 5)
        );
        suggestions.descriptionSuggestions = contentAnalysis.suggestions || [];
        console.log('✅ تم تحليل الوصف:', suggestions.descriptionSuggestions.length);
      } catch (error) {
        console.error('خطأ في تحليل الوصف:', error);
      }
    } else {
      // إذا لم يكن هناك وصف، نقترح وصف أولي
      try {
        const generatedContent = await seoAgent.generateOptimizedContent(
          title,
          suggestions.keywords.slice(0, 5),
          'project_description',
          150
        );
        suggestions.contentSuggestions = generatedContent.content;
        console.log('✅ تم توليد اقتراح للوصف');
      } catch (error) {
        console.error('خطأ في توليد الوصف:', error);
        suggestions.contentSuggestions = `مشروع ${category || ''} ${title} في ${location || 'السعودية'}. تم تنفيذه بأعلى معايير الجودة والاحترافية من قبل ديار جدة العالمية. نفخر بتقديم أفضل الحلول والخدمات المتميزة لعملائنا.`;
      }
    }

    // 5. توليد Meta Tags
    try {
      const metaTags = await seoAgent.generateMetaTags(
        content,
        suggestions.keywords.slice(0, 5),
        type === 'article' ? 'article' : 'project'
      );
      suggestions.metaTags = metaTags;
      console.log('✅ تم توليد Meta Tags');
    } catch (error) {
      console.error('خطأ في توليد Meta Tags:', error);
      suggestions.metaTags = {
        title: `${title} في ${location || 'السعودية'} | ديار جدة العالمية`,
        description: description?.substring(0, 150) || `${title} - مشروع ${category || ''} تم تنفيذه بأعلى معايير الجودة في ${location || 'السعودية'}.`,
        og_title: title,
        og_description: description?.substring(0, 200) || `مشروع ${category || ''} احترافي`,
        twitter_title: title,
        twitter_description: description?.substring(0, 150) || `مشروع ${category || ''} احترافي`
      };
    }

    console.log('✅ تم إنشاء جميع الاقتراحات بنجاح');

    return NextResponse.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('❌ خطأ في API اقتراحات AI:', error);
    return NextResponse.json(
      {
        error: 'فشل في توليد الاقتراحات',
        details: error instanceof Error ? error.message : 'خطأ غير معروف'
      },
      { status: 500 }
    );
  }
}
