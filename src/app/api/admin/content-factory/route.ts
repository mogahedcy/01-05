import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { keyword, category } = body;

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'GROQ_API_KEY is not configured in environment variables' }, { status: 500 });
    }

    // Call Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an elite Arab SEO copywriter and expert engineer working for 'ديار جدة العالمية' (Aldeyar Global Professionals) in Saudi Arabia.
Your task is to write a highly professional, engaging, and detailed article about the given keyword.
CRITICAL RULES:
1. You MUST write exclusively in perfect, native, professional Arabic (except for the English fields). DO NOT use Chinese or any other language.
2. The article must be LONG and COMPREHENSIVE (at least 600 words).
3. The 'content' field MUST be formatted in rich, semantic HTML (use <h2>, <h3>, <p>, <ul>, <li>, <strong>).
4. Do NOT include <html>, <head>, or <body> tags. Just the inner HTML.
5. Emphasize the quality, luxury, and expertise of 'ديار جدة العالمية' in the Saudi market.
6. Return STRICTLY a valid JSON object matching this schema exactly:
{
  "title": "Arabic Title (SEO friendly, catchy, max 60 chars)",
  "titleEn": "English Title",
  "excerpt": "Powerful short summary in Arabic (max 150 chars)",
  "excerptEn": "Short summary in English",
  "content": "Full article HTML content in Arabic. Must be long, detailed, and use semantic HTML tags like <h2>, <h3>, <p>, <ul>.",
  "contentEn": "Full article HTML content in English",
  "metaDescription": "Arabic meta description (max 150 chars)",
  "metaDescriptionEn": "English meta description",
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "faqs": [
    {
      "question": "Arabic FAQ Question 1",
      "answer": "Detailed Arabic FAQ Answer 1",
      "questionEn": "English FAQ Question 1",
      "answerEn": "English FAQ Answer 1"
    },
    {
      "question": "Arabic FAQ Question 2",
      "answer": "Detailed Arabic FAQ Answer 2",
      "questionEn": "English FAQ Question 2",
      "answerEn": "English FAQ Answer 2"
    },
    {
      "question": "Arabic FAQ Question 3",
      "answer": "Detailed Arabic FAQ Answer 3",
      "questionEn": "English FAQ Question 3",
      "answerEn": "English FAQ Answer 3"
    }
  ]
}`
          },
          {
            role: 'user',
            content: `Keyword: "${keyword}", Category: "${category || 'Contracting'}"`
          }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Groq API Error:', errText);
      return NextResponse.json({ error: `Groq Error: ${errText}` }, { status: response.status });
    }

    const aiData = await response.json();
    const contentData = JSON.parse(aiData.choices[0].message.content);

    // Contextual FAQs Magic (SEO Booster)
    // Inject FAQs directly into the HTML so they display beautifully and are parsed by extractFAQsFromHtml()
    if (contentData.faqs && contentData.faqs.length > 0) {
      let faqHtml = '<div class="article-faqs mt-12 bg-slate-50 p-8 rounded-3xl border border-slate-100"><h2 class="text-2xl font-bold mb-6 text-blue-900">الأسئلة الشائعة</h2>';
      contentData.faqs.forEach((faq: any) => {
        faqHtml += `<h3 class="text-xl font-bold mt-6 mb-2 text-slate-800">${faq.question}</h3><p class="text-slate-600 leading-relaxed">${faq.answer}</p>`;
      });
      faqHtml += '</div>';
      contentData.content += faqHtml;

      let faqHtmlEn = '<div class="article-faqs mt-12 bg-slate-50 p-8 rounded-3xl border border-slate-100"><h2 class="text-2xl font-bold mb-6 text-blue-900">Frequently Asked Questions</h2>';
      contentData.faqs.forEach((faq: any) => {
        if (faq.questionEn && faq.answerEn) {
          faqHtmlEn += `<h3 class="text-xl font-bold mt-6 mb-2 text-slate-800">${faq.questionEn}</h3><p class="text-slate-600 leading-relaxed">${faq.answerEn}</p>`;
        }
      });
      faqHtmlEn += '</div>';
      contentData.contentEn = (contentData.contentEn || '') + faqHtmlEn;
    }

    // Create unique slug
    const slug = keyword.replace(/[\s_]+/g, '-').replace(/[^\w\-\u0600-\u06FF]+/g, '').toLowerCase() + '-' + Date.now().toString().slice(-4);
    
    // Create Article
    const article = await prisma.articles.create({
      data: {
        id: slug,
        slug: slug,
        title: contentData.title,
        titleEn: contentData.titleEn,
        excerpt: contentData.excerpt,
        excerptEn: contentData.excerptEn,
        content: contentData.content,
        contentEn: contentData.contentEn,
        metaTitle: contentData.title,
        metaTitleEn: contentData.titleEn,
        metaDescription: contentData.metaDescription,
        metaDescriptionEn: contentData.metaDescriptionEn,
        category: category || 'عام',
        status: 'PUBLISHED',
        updatedAt: new Date(),
        article_tags: {
          create: contentData.tags.map((tag: string) => ({
            name: tag
          }))
        }
      }
    });

    // Create FAQs
    if (contentData.faqs && contentData.faqs.length > 0) {
      await Promise.all(contentData.faqs.map(async (faq: any) => {
        await prisma.faqs.create({
          data: {
            question: faq.question,
            answer: faq.answer,
            questionEn: faq.questionEn,
            answerEn: faq.answerEn,
            category: category || 'عام',
            slug: faq.question.replace(/[\s_]+/g, '-').replace(/[^\w\-\u0600-\u06FF]+/g, '').slice(0, 50) + '-' + Date.now().toString().slice(-4),
            status: 'PUBLISHED'
          }
        });
      }));
    }

    // Ping IndexNow to instantly notify search engines
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.deyarsu.com';
      const indexNowKey = process.env.INDEXNOW_KEY || 'aldeyarksa-indexnow-key-2024';
      const indexNowEndpoint = 'https://api.indexnow.org/indexnow';
      
      const payload = {
        host: baseUrl.replace(/^https?:\/\//, ''),
        key: indexNowKey,
        keyLocation: `${baseUrl}/${indexNowKey}.txt`,
        urlList: [
          `${baseUrl}/articles/${slug}`,
          `${baseUrl}/en/articles/${slug}`,
          `${baseUrl}/faq`
        ]
      };

      await fetch(indexNowEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'AlDeyar-SEO-Bot/1.0' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(5000)
      });
      console.log(`[Content Factory] Pinged IndexNow for ${slug}`);
    } catch (e) {
      console.error('[Content Factory] Failed to ping IndexNow:', e);
    }

    return NextResponse.json({ success: true, article, faqs: contentData.faqs });

  } catch (error) {
    console.error('Content Factory Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
