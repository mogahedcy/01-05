import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { aiArticleAgent } from '@/lib/ai-article-agent';
import { aiFAQAgent } from '@/lib/ai-faq-agent';
import { seoDiagnostics } from '@/lib/seo-diagnostics';
import {
  analyzeCompetitors,
  generateSmartArticleIdeas,
  generateHumanLikeContent,
  generateOptimizedMetaTags,
} from '@/lib/competitor-analyzer';
import { imageSelector } from '@/lib/image-selector';
import { seoAgent } from '@/lib/seo-agent';

export async function GET(request: NextRequest) {
  try {
    console.log('🤖 بدء تنفيذ المهام المجدولة بواسطة Groq AI...');
    
    const schedule = await prisma.automation_schedules.findFirst({
      orderBy: { createdAt: 'desc' }
    });

    if (!schedule) {
      return NextResponse.json({
        success: false,
        message: 'لا توجد إعدادات جدولة'
      });
    }

    const now = new Date();
    const results = {
      generateTask: null as any,
      fixTask: null as any,
      faqTask: null as any,
    };

    if (schedule.generateEnabled && schedule.nextGenerateRun && now >= schedule.nextGenerateRun) {
      console.log('📝 تنفيذ مهمة توليد المقالات المجدولة...');
      
      const nextRun = calculateNextRun(now, schedule.generateFrequency);
      
      try {
        let generateResult;
        
        if (!schedule.generateNiche) {
          generateResult = {
            success: false,
            error: 'لم يتم تحديد مجال للتوليد',
            successCount: 0,
            failureCount: schedule.generateCount
          };
        } else {
          generateResult = await runSmartGeneration(
            schedule.generateNiche,
            schedule.generateCount,
            schedule.generateAutoPublish || false
          );
        }

        await prisma.automation_logs.create({
          data: {
            taskType: 'GENERATE_ARTICLES',
            status: generateResult.success ? 'SUCCESS' : 'FAILED',
            message: generateResult.message || generateResult.error || null,
            successCount: generateResult.successCount || 0,
            failureCount: generateResult.failureCount || 0,
            details: JSON.stringify(generateResult.details || {}),
          }
        });

        results.generateTask = generateResult;
        console.log(`✅ مهمة التوليد اكتملت${generateResult.success ? '' : ' (مع أخطاء)'}. التشغيل القادم: ${nextRun}`);
        
      } catch (error: any) {
        console.error('❌ فشل في تنفيذ مهمة التوليد:', error);
        
        await prisma.automation_logs.create({
          data: {
            taskType: 'GENERATE_ARTICLES',
            status: 'FAILED',
            message: error.message || 'خطأ غير متوقع',
            failureCount: schedule.generateCount,
          }
        });
        
        results.generateTask = {
          success: false,
          error: error.message
        };
      } finally {
        await prisma.automation_schedules.update({
          where: { id: schedule.id },
          data: {
            lastGenerateRun: now,
            nextGenerateRun: nextRun,
          }
        });
      }
    }

    if (schedule.fixEnabled && schedule.nextFixRun && now >= schedule.nextFixRun) {
      console.log('🔧 تنفيذ مهمة إصلاح SEO المجدولة...');
      
      const nextRun = calculateNextRun(now, schedule.fixFrequency);
      
      try {
        const fixResult = await seoDiagnostics.autoFixAll();

        await prisma.automation_logs.create({
          data: {
            taskType: 'FIX_SEO',
            status: 'SUCCESS',
            successCount: fixResult.fixed,
            failureCount: fixResult.failed,
            details: JSON.stringify({ results: fixResult.results }),
          }
        });

        results.fixTask = {
          success: true,
          fixed: fixResult.fixed,
          failed: fixResult.failed
        };
        
        console.log(`✅ مهمة الإصلاح اكتملت. التشغيل القادم: ${nextRun}`);
        
      } catch (error: any) {
        console.error('❌ فشل في تنفيذ مهمة الإصلاح:', error);
        
        await prisma.automation_logs.create({
          data: {
            taskType: 'FIX_SEO',
            status: 'FAILED',
            message: error.message || 'خطأ غير متوقع',
          }
        });
        
        results.fixTask = {
          success: false,
          error: error.message
        };
      } finally {
        await prisma.automation_schedules.update({
          where: { id: schedule.id },
          data: {
            lastFixRun: now,
            nextFixRun: nextRun,
          }
        });
      }
    }

    if (schedule.faqEnabled && schedule.nextFaqRun && now >= schedule.nextFaqRun) {
      console.log('❓ تنفيذ مهمة توليد الأسئلة الشائعة المجدولة...');
      
      const nextRun = calculateNextRun(now, schedule.faqFrequency);
      
      try {
        let faqResult;
        
        if (!schedule.faqNiche) {
          faqResult = {
            success: false,
            error: 'لم يتم تحديد مجال للتوليد',
            successCount: 0,
            failureCount: schedule.faqCount
          };
        } else {
          const generatedFAQs = await aiFAQAgent.generateSmartFAQs(
            schedule.faqNiche,
            schedule.faqCount,
            schedule.faqAutoPublish || false
          );
          
          faqResult = {
            success: true,
            message: `تم توليد ${generatedFAQs.stats.saved} من أصل ${generatedFAQs.stats.total} سؤال`,
            successCount: generatedFAQs.stats.saved,
            failureCount: generatedFAQs.stats.failed,
            details: { faqs: generatedFAQs.faqs }
          };
        }

        await prisma.automation_logs.create({
          data: {
            taskType: 'GENERATE_FAQS',
            status: faqResult.success ? 'SUCCESS' : 'FAILED',
            message: faqResult.message || faqResult.error || null,
            successCount: faqResult.successCount || 0,
            failureCount: faqResult.failureCount || 0,
            details: JSON.stringify(faqResult.details || {}),
          }
        });

        results.faqTask = faqResult;
        console.log(`✅ مهمة توليد الأسئلة اكتملت${faqResult.success ? '' : ' (مع أخطاء)'}. التشغيل القادم: ${nextRun}`);
        
      } catch (error: any) {
        console.error('❌ فشل في تنفيذ مهمة توليد الأسئلة:', error);
        
        await prisma.automation_logs.create({
          data: {
            taskType: 'GENERATE_FAQS',
            status: 'FAILED',
            message: error.message || 'خطأ غير متوقع',
            failureCount: schedule.faqCount,
          }
        });
        
        results.faqTask = {
          success: false,
          error: error.message
        };
      } finally {
        await prisma.automation_schedules.update({
          where: { id: schedule.id },
          data: {
            lastFaqRun: now,
            nextFaqRun: nextRun,
          }
        });
      }
    }

    console.log('✅ اكتملت جميع المهام المجدولة');
    
    return NextResponse.json({
      success: true,
      executedAt: now,
      results
    });

  } catch (error: any) {
    console.error('❌ خطأ في تنفيذ المهام المجدولة:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

async function runSmartGeneration(niche: string, count: number, autoPublish: boolean) {
  try {
    const competitorAnalysis = await analyzeCompetitors(niche);
    const articleIdeas = await generateSmartArticleIdeas(competitorAnalysis, niche, count);
    
    const results = [];
    let successCount = 0;
    let failureCount = 0;

    for (const idea of articleIdeas) {
      try {
        const content = await generateHumanLikeContent(idea, competitorAnalysis);
        const metaTags = await generateOptimizedMetaTags(idea.title, idea.keywords, competitorAnalysis);
        const images = await imageSelector.selectImagesForArticle(idea.title, content, idea.keywords, 3);
        
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

        for (let i = 0; i < images.length; i++) {
          const media = images[i];
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
          } catch {}
        }

        results.push({ success: true, title: idea.title, id: article.id });
        successCount++;
        
      } catch (error) {
        results.push({ success: false, title: idea.title, error: error instanceof Error ? error.message : 'خطأ' });
        failureCount++;
      }
    }

    return {
      success: true,
      message: `تم توليد ${successCount} من أصل ${count} مقالات`,
      successCount,
      failureCount,
      details: { results }
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'خطأ في التوليد الذكي',
      successCount: 0,
      failureCount: count
    };
  }
}

function calculateNextRun(from: Date, frequency: string): Date {
  const next = new Date(from);
  
  switch (frequency) {
    case 'daily':
      next.setDate(next.getDate() + 1);
      next.setHours(2, 0, 0, 0);
      break;
    case 'weekly':
      next.setDate(next.getDate() + 7);
      next.setHours(2, 0, 0, 0);
      break;
    case 'monthly':
      next.setMonth(next.getMonth() + 1);
      next.setHours(2, 0, 0, 0);
      break;
  }
  
  return next;
}
