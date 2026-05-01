import { type NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import {
  analyzeCompetitors,
  generateSmartArticleIdeas,
  generateHumanLikeContent,
  generateOptimizedMetaTags,
  type CompetitorAnalysis,
  type GeneratedArticleIdea,
} from '@/lib/competitor-analyzer';
import { imageSelector } from '@/lib/image-selector';
import { prisma } from '@/lib/prisma';
import { seoAgent } from '@/lib/seo-agent';

interface SmartGenerateRequest {
  niche: string;
  count: number;
  autoPublish?: boolean;
}

interface ArticleResult {
  success: boolean;
  title: string;
  id?: string;
  error?: string;
  seoScore?: number;
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('admin-token')?.value;
    if (!token) {
      return NextResponse.json(
        { error: 'غير مصرح' },
        { status: 401 }
      );
    }

    try {
      verifyToken(token);
    } catch {
      return NextResponse.json(
        { error: 'جلسة غير صالحة' },
        { status: 401 }
      );
    }

    const body: SmartGenerateRequest = await request.json();
    const { niche, count, autoPublish = false } = body;

    if (!niche || count < 1 || count > 10) {
      return NextResponse.json(
        { error: 'يجب تحديد المجال وعدد المقالات (1-10)' },
        { status: 400 }
      );
    }

    console.log(`🧠 بدء التوليد الذكي لـ ${count} مقالات في مجال: ${niche}`);

    console.log('🔍 المرحلة 1: تحليل المنافسين...');
    const competitorAnalysis: CompetitorAnalysis = await analyzeCompetitors(niche);
    
    console.log('✅ تم تحليل المنافسين');
    console.log(`📊 الكلمات المفتاحية: ${competitorAnalysis.topKeywords.slice(0, 5).join(', ')}...`);
    console.log(`🎯 الجمهور المستهدف: ${competitorAnalysis.targetAudience}`);

    console.log('💡 المرحلة 2: توليد أفكار المقالات الذكية...');
    const articleIdeas: GeneratedArticleIdea[] = await generateSmartArticleIdeas(
      competitorAnalysis,
      niche,
      count
    );
    
    console.log(`✅ تم توليد ${articleIdeas.length} فكرة مقال`);

    console.log('✍️ المرحلة 3: كتابة المقالات بأسلوب بشري متطور...');
    const results: ArticleResult[] = [];

    for (let i = 0; i < articleIdeas.length; i++) {
      const idea = articleIdeas[i];
      console.log(`\n📝 توليد المقال ${i + 1}/${articleIdeas.length}: ${idea.title}`);

      try {
        console.log('  📄 كتابة المحتوى...');
        const content = await generateHumanLikeContent(idea, competitorAnalysis);
        
        console.log('  🏷️ توليد Meta Tags محسنة...');
        const metaTags = await generateOptimizedMetaTags(
          idea.title,
          idea.keywords,
          competitorAnalysis
        );

        console.log('  🖼️ اختيار الصور المناسبة...');
        const images = await imageSelector.selectImagesForArticle(
          idea.title,
          content,
          idea.keywords,
          3
        );
        
        const mediaItems = images.map((img: { type: 'IMAGE' | 'VIDEO'; src: string; alt: string; description: string }, idx: number) => ({
          type: img.type,
          src: img.src,
          alt: img.alt,
          description: img.description,
          order: idx,
        }));

        console.log('  📊 تحليل SEO للمحتوى...');
        const seoAnalysis = await seoAgent.analyzeContent(content, idea.keywords);

        console.log('  💾 حفظ المقال في قاعدة البيانات...');
        const articleId = `art_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        const article = await prisma.articles.create({
          data: {
            id: articleId,
            title: idea.title,
            content,
            excerpt: content.substring(0, 200).replace(/<[^>]*>/g, '') + '...',
            metaTitle: metaTags.metaTitle,
            metaDescription: metaTags.metaDescription,
            keywords: idea.keywords.join(', '),
            category: idea.category,
            author: 'ديار جدة العالمية',
            status: autoPublish ? 'PUBLISHED' : 'DRAFT',
            featured: false,
            views: 0,
            likes: 0,
            updatedAt: new Date(),
          },
        });

        for (let i = 0; i < mediaItems.length; i++) {
          const media = mediaItems[i];
          await prisma.article_media_items.create({
            data: {
              id: `media_${articleId}_${i}`,
              articleId: article.id,
              type: media.type,
              src: media.src,
              title: media.alt,
              description: media.description,
            },
          });
        }

        for (const keyword of idea.keywords) {
          try {
            await prisma.article_tags.create({
              data: {
                articleId: article.id,
                name: keyword,
              },
            });
          } catch {
          }
        }

        console.log(`  ✅ تم حفظ المقال: ${article.id}`);
        console.log(`  📈 نقاط SEO: ${seoAnalysis.seo_score}/100`);

        results.push({
          success: true,
          title: idea.title,
          id: article.id,
          seoScore: seoAnalysis.seo_score,
        });

      } catch (error) {
        console.error(`  ❌ فشل توليد المقال: ${idea.title}`, error);
        results.push({
          success: false,
          title: idea.title,
          error: error instanceof Error ? error.message : 'خطأ غير معروف',
        });
      }
    }

    const successCount = results.filter((r) => r.success).length;
    const avgSeoScore = results
      .filter((r) => r.seoScore)
      .reduce((sum, r) => sum + (r.seoScore || 0), 0) / successCount;

    console.log('\n🎉 اكتمل التوليد الذكي!');
    console.log(`✅ نجح: ${successCount}/${count}`);
    console.log(`📊 متوسط نقاط SEO: ${avgSeoScore.toFixed(1)}/100`);
    
    if (competitorAnalysis.realContentAnalyzed) {
      console.log(`🌐 تم تحليل محتوى حقيقي من ${competitorAnalysis.competitorUrls?.length || 0} مصادر`);
    }

    return NextResponse.json({
      success: true,
      message: `تم توليد ${successCount} من أصل ${count} مقالات بنجاح`,
      analysis: {
        niche,
        webSearchUsed: competitorAnalysis.realContentAnalyzed || false,
        competitorUrls: competitorAnalysis.competitorUrls || [],
        competitorInsights: {
          topKeywords: competitorAnalysis.topKeywords.slice(0, 10),
          targetAudience: competitorAnalysis.targetAudience,
          toneAndStyle: competitorAnalysis.toneAndStyle,
          contentGaps: competitorAnalysis.contentGaps,
        },
        stats: {
          totalRequested: count,
          successCount,
          failureCount: count - successCount,
          averageSeoScore: Math.round(avgSeoScore),
        },
      },
      results,
    });

  } catch (error) {
    console.error('❌ خطأ في التوليد الذكي:', error);
    return NextResponse.json(
      {
        error: 'فشل التوليد الذكي',
        details: error instanceof Error ? error.message : 'خطأ غير معروف',
      },
      { status: 500 }
    );
  }
}
