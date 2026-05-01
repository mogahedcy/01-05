import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SEOAgent } from '@/lib/seo-agent';
import { requireAdmin } from '@/lib/auth-middleware';

export const dynamic = 'force-dynamic';

const seoAgent = new SEOAgent();

/**
 * إصلاح تلقائي للمشاكل القابلة للإصلاح
 */
export async function POST(request: NextRequest) {
  // التحقق من صلاحيات Admin
  const auth = await requireAdmin(request);
  if (!auth.authorized) {
    return auth.response!;
  }

  try {
    const { issueType, targetId, targetType } = await request.json();
    
    let result = { success: false, message: '' };
    
    switch (issueType) {
      case 'missing_alt':
        result = await fixMissingAltText(targetId, targetType);
        break;
        
      case 'meta_issue':
        result = await fixMetaTags(targetId, targetType);
        break;
        
      case 'duplicate_content':
        result = await fixDuplicateContent(targetId, targetType);
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'نوع المشكلة غير مدعوم للإصلاح التلقائي'
        }, { status: 400 });
    }
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('خطأ في الإصلاح التلقائي:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'حدث خطأ أثناء الإصلاح'
    }, { status: 500 });
  }
}

async function fixMissingAltText(mediaId: string, type: 'project' | 'article'): Promise<{ success: boolean; message: string }> {
  try {
    if (type === 'project') {
      const media = await prisma.media_items.findUnique({
        where: { id: mediaId },
        include: { projects: { select: { title: true, category: true } } }
      });
      
      if (!media || !media.projects) {
        return { success: false, message: 'الصورة غير موجودة' };
      }
      
      // توليد Alt Text ذكي
      const generatedAlt = `${media.projects.category} - ${media.title || media.projects.title} - ديار جدة العالمية جدة`;
      
      await prisma.media_items.update({
        where: { id: mediaId },
        data: { alt: generatedAlt }
      });
      
      return { success: true, message: `تم إضافة نص بديل: "${generatedAlt}"` };
    } else {
      const media = await prisma.article_media_items.findUnique({
        where: { id: mediaId },
        include: { articles: { select: { title: true, category: true } } }
      });
      
      if (!media || !media.articles) {
        return { success: false, message: 'الصورة غير موجودة' };
      }
      
      const generatedAlt = `${media.articles.category} - ${media.title || media.articles.title} - ديار جدة العالمية`;
      
      await prisma.article_media_items.update({
        where: { id: mediaId },
        data: { alt: generatedAlt }
      });
      
      return { success: true, message: `تم إضافة نص بديل: "${generatedAlt}"` };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function fixMetaTags(targetId: string, type: 'project' | 'article'): Promise<{ success: boolean; message: string }> {
  try {
    if (type === 'project') {
      const project = await prisma.projects.findUnique({
        where: { id: targetId },
        select: { id: true, title: true, description: true, category: true, location: true, keywords: true }
      });
      
      if (!project) {
        return { success: false, message: 'المشروع غير موجود' };
      }
      
      // توليد Meta Tags محسّنة
      const content = `${project.title}. ${project.description}`;
      const keywords = Array.isArray(project.keywords) ? project.keywords : (project.keywords ? [project.keywords] : []);
      
      const analysis = await seoAgent.analyzeContent(content, keywords);
      
      await prisma.projects.update({
        where: { id: targetId },
        data: {
          metaTitle: analysis.meta_title_suggestion,
          metaDescription: analysis.meta_description_suggestion
        }
      });
      
      return { 
        success: true, 
        message: `تم تحديث Meta Tags للمشروع "${project.title}"` 
      };
    } else {
      const article = await prisma.articles.findUnique({
        where: { id: targetId },
        select: { id: true, title: true, content: true, excerpt: true, keywords: true }
      });
      
      if (!article) {
        return { success: false, message: 'المقال غير موجود' };
      }
      
      const content = `${article.title}. ${article.excerpt || article.content}`;
      const keywords = Array.isArray(article.keywords) ? article.keywords : (article.keywords ? [article.keywords] : []);
      
      const analysis = await seoAgent.analyzeContent(content, keywords);
      
      await prisma.articles.update({
        where: { id: targetId },
        data: {
          metaTitle: analysis.meta_title_suggestion,
          metaDescription: analysis.meta_description_suggestion
        }
      });
      
      return { 
        success: true, 
        message: `تم تحديث Meta Tags للمقال "${article.title}"` 
      };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

async function fixDuplicateContent(targetId: string, type: 'project' | 'article'): Promise<{ success: boolean; message: string }> {
  try {
    if (type === 'project') {
      const project = await prisma.projects.findUnique({
        where: { id: targetId },
        select: { id: true, title: true, description: true, category: true, metaDescription: true }
      });
      
      if (!project) {
        return { success: false, message: 'المشروع غير موجود' };
      }
      
      // توليد وصف فريد
      const keywords = [project.category, 'جدة', 'ديار جدة العالمية'];
      
      const generated = await seoAgent.generateOptimizedContent(
        project.title,
        keywords,
        'project_description',
        200
      );
      
      await prisma.projects.update({
        where: { id: targetId },
        data: {
          metaDescription: generated.meta_description
        }
      });
      
      return { 
        success: true, 
        message: 'تم إنشاء وصف فريد للمشروع' 
      };
    }
    
    return { success: false, message: 'نوع الهدف غير مدعوم' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
