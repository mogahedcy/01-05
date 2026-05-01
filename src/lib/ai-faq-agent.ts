import ai, { GROQ_MODEL } from './groq-client';
import { prisma } from './prisma';
import { randomUUID } from 'crypto';

export interface FAQGenerationOptions {
  topic: string;
  keywords: string[];
  category: string;
  count?: number;
  shouldPublish?: boolean;
}

export interface GeneratedFAQ {
  id: string;
  question: string;
  answer: string;
  questionEn?: string;
  answerEn?: string;
  category: string;
  keywords: string[];
  metaTitle: string;
  metaDescription: string;
  keywordsEn?: string;
  metaTitleEn?: string;
  metaDescriptionEn?: string;
  slug: string;
  status: 'DRAFT' | 'PUBLISHED';
  featured: boolean;
}

export interface FAQGenerationResult {
  faqs: GeneratedFAQ[];
  stats: {
    total: number;
    saved: number;
    failed: number;
  };
}

export class AIFAQAgent {
  async generateFAQs(options: FAQGenerationOptions): Promise<GeneratedFAQ[]> {
    const {
      topic,
      keywords,
      category,
      count = 5,
    } = options;

    console.log(`🤖 بدء توليد ${count} أسئلة شائعة احترافية عن: ${topic}`);

    const prompt = `أنت "أبو فهد"، خبير سعودي متخصص في الـ SEO وفي صناعة المظلات والبرجولات والتشطيبات المعمارية في جدة منذ 15 عاماً.

**المهمة:**
أنشئ ${count} أسئلة شائعة (FAQ) عميقة جداً وواقعية باللغتين العربية والإنجليزية.

**الموضوع:** ${topic}
**الكلمات المفتاحية:** ${keywords.join(', ')}
**التصنيف:** ${category}

**قواعد المحتوى الذهبية:**
1. **الخبرة (Expertise):** لا تكتب كلاماً عاماً. اكتب كخبير يتحدث عن "سماكة الحديد"، "أنواع الـ PVC"، "العزل الحراري في ساندوتش بانل"، "أفضل أنواع الخشب المعالج".
2. **الواقعية:** الإجابة يجب أن تكون دليلاً شاملاً (500+ كلمة لكل لغة). اشرح "لماذا نختار هذا النوع" و "كيف تتم الصيانة" و "ما هي الأخطاء الشائعة".
3. **التوطين (Local SEO):** اذكر أحياء جدة (أبحر، المرجان، البساتين، الخالدية) أو تحديات مناخ جدة (الرطوبة العالية، ملوحة الجو، الحرارة الشديدة).
4. **التسعير والضمان:** اذكر نطاقات أسعار واقعية بالريال السعودي واذكر "ضمان ديار جدة" لمدة 10 سنوات.
5. **الكلمات المفتاحية:** استخدم الكلمات المفتاحية بذكاء في العناوين والوصف.

**الاستجابة بصيغة JSON حصراً:**
{
  "faqs": [
    {
      "question_ar": "السؤال الاحترافي بالعربية؟",
      "answer_ar": "دليل شامل بالعربي (فقرات، نقاط، نصائح خبير)...",
      "question_en": "Professional Question in English?",
      "answer_en": "Comprehensive English guide (paragraphs, bullets, expert advice)...",
      "keywords_ar": "كلمات مفتاحية بالعربية",
      "keywords_en": "Keywords in English",
      "metaTitle_ar": "عنوان SEO عربي جذاب",
      "metaTitle_en": "Catchy English SEO Title",
      "metaDescription_ar": "وصف SEO عربي مقنع",
      "metaDescription_en": "Compelling English SEO Description",
      "slug": "unique-english-slug"
    }
  ]
}`;

    try {
      const response = await ai.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          {
            role: 'system',
            content: 'You are Abu Fahad, a professional Saudi expert. You provide deep, technical, and helpful FAQ content in both Arabic and English. You always output valid JSON.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const responseContent = response.choices[0]?.message?.content || '{"faqs": []}';
      let result;
      try {
        result = JSON.parse(responseContent);
      } catch (e) {
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        result = jsonMatch ? JSON.parse(jsonMatch[0]) : { faqs: [] };
      }

      if (!result.faqs || !Array.isArray(result.faqs)) return [];

      return result.faqs.map((faq: any) => ({
        id: randomUUID(),
        question: faq.question_ar,
        answer: faq.answer_ar,
        questionEn: faq.question_en,
        answerEn: faq.answer_en,
        category: category,
        keywords: faq.keywords_ar?.split(',').map((k: string) => k.trim()) || keywords,
        keywordsEn: faq.keywords_en || faq.keywords_ar,
        metaTitle: faq.metaTitle_ar,
        metaTitleEn: faq.metaTitle_en,
        metaDescription: faq.metaDescription_ar,
        metaDescriptionEn: faq.metaDescription_en,
        slug: this.generateSlug(faq.slug || faq.question_en || faq.question_ar),
        status: 'DRAFT' as const,
        featured: false
      }));
    } catch (error) {
      console.error('❌ خطأ في توليد الأسئلة:', error);
      throw error;
    }
  }


  async saveFAQs(faqs: GeneratedFAQ[], shouldPublish = false): Promise<FAQGenerationResult> {
    console.log(`📝 جاري حفظ ${faqs.length} سؤال...`);

    const results: FAQGenerationResult = {
      faqs: [],
      stats: {
        total: faqs.length,
        saved: 0,
        failed: 0
      }
    };

    for (const faq of faqs) {
      try {
        const existingFaq = await prisma.faqs.findFirst({
          where: {
            OR: [
              { slug: faq.slug },
              { question: faq.question }
            ]
          }
        });

        if (existingFaq) {
          console.log(`⚠️ سؤال موجود مسبقاً: ${faq.question.substring(0, 50)}...`);
          faq.slug = `${faq.slug}-${Date.now()}`;
        }

        const savedFaq = await (prisma as any).faqs.create({
          data: {
            id: faq.id,
            question: faq.question,
            answer: faq.answer,
            questionEn: faq.questionEn,
            answerEn: faq.answerEn,
            category: faq.category,
            keywords: faq.keywords.join(', '),
            keywordsEn: faq.keywordsEn,
            metaTitle: faq.metaTitle,
            metaTitleEn: faq.metaTitleEn,
            metaDescription: faq.metaDescription,
            metaDescriptionEn: faq.metaDescriptionEn,
            slug: faq.slug,
            status: shouldPublish ? 'PUBLISHED' : 'DRAFT',
            featured: faq.featured,
            order: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        });

        faq.status = shouldPublish ? 'PUBLISHED' : 'DRAFT';
        results.faqs.push(faq);
        results.stats.saved++;
        console.log(`✅ تم حفظ: ${faq.question.substring(0, 50)}...`);
      } catch (error) {
        console.error(`❌ فشل حفظ سؤال: ${faq.question.substring(0, 50)}...`, error);
        results.stats.failed++;
      }
    }

    console.log(`✅ اكتمل الحفظ: ${results.stats.saved}/${results.stats.total}`);
    return results;
  }

  async generateAndSaveFAQs(
    options: FAQGenerationOptions
  ): Promise<FAQGenerationResult> {
    const faqs = await this.generateFAQs(options);

    if (faqs.length === 0) {
      return {
        faqs: [],
        stats: { total: 0, saved: 0, failed: 0 }
      };
    }

    return await this.saveFAQs(faqs, options.shouldPublish || false);
  }

  async generateSmartFAQs(
    niche: string,
    count = 5,
    shouldPublish = false
  ): Promise<FAQGenerationResult> {
    console.log(`🧠 التوليد الذكي للأسئلة عن: ${niche}`);

    const analysisPrompt = `أنت خبير SEO متخصص في السوق السعودي.

**المهمة:**
حلل الموضوع التالي واقترح أفضل التصنيفات والكلمات المفتاحية لتوليد أسئلة شائعة:

**الموضوع:** ${niche}

**أرجع JSON:**
{
  "category": "التصنيف الأنسب من: مظلات سيارات، سواتر، خيم ملكية، بيوت شعر ملكي، برجولات، تنسيق حدائق، هناجر، شبوك، قراميد، ساندوتش بانل",
  "keywords": ["5-10 كلمات مفتاحية مهمة"],
  "suggestedTopics": ["3-5 مواضيع محددة للأسئلة"]
}`;

    try {
      const analysisResponse = await ai.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: 'أنت خبير SEO محترف.' },
          { role: 'user', content: analysisPrompt }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      });

      const responseContent = analysisResponse.choices[0]?.message?.content || '{}';
      let analysis;
      try {
        analysis = JSON.parse(responseContent);
      } catch (e) {
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          analysis = {};
        }
      }

      const category = analysis.category || 'برجولات';
      const keywords = analysis.keywords || [niche];

      return await this.generateAndSaveFAQs({
        topic: niche,
        keywords,
        category,
        count,
        shouldPublish
      });
    } catch (error) {
      console.error('❌ خطأ في التحليل الذكي:', error);

      return await this.generateAndSaveFAQs({
        topic: niche,
        keywords: [niche],
        category: 'برجولات',
        count,
        shouldPublish
      });
    }
  }

  private generateSlug(text: string): string {
    const slug = text
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[،؛؟!@#$%^&*()+=\[\]{};:"\\|<>\/]/g, '')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);

    return slug || `faq-${Date.now()}`;
  }
}

export const aiFAQAgent = new AIFAQAgent();
