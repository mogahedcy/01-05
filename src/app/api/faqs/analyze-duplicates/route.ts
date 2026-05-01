import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/jwt';
import { cookies } from 'next/headers';
import ai, { GROQ_MODEL } from '@/lib/groq-client';

async function checkAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = verifyToken(token) as any;
    return decoded;
  } catch (error) {
    return null;
  }
}

async function analyzeSimilarityWithAI(faqs: any[]): Promise<any[]> {
  try {
    const faqList = faqs.map((faq, index) => 
      `${index + 1}. ${faq.question} (الفئة: ${faq.category}, المعرف: ${faq.id})`
    ).join('\n');

    const prompt = `أنت خبير في تحليل الأسئلة المتشابهة. قم بتحليل القائمة التالية من الأسئلة الشائعة واكتشف الأسئلة المتشابهة دلالياً (حتى لو كانت الصياغة مختلفة):

${faqList}

قم بتحديد مجموعات الأسئلة المتشابهة والتي تعالج نفس الموضوع أو الاستفسار. اعتبر الأسئلة متشابهة إذا كانت:
1. تسأل عن نفس المعلومة بصياغة مختلفة
2. تتعلق بنفس الموضوع بشكل وثيق
3. يمكن دمجها في سؤال واحد شامل

قدم النتيجة بصيغة JSON كما يلي:
{
  "duplicateGroups": [
    {
      "group": 1,
      "similarityReason": "السبب الدلالي للتشابه",
      "questionIds": ["id1", "id2", "id3"],
      "recommendation": "توصية بكيفية دمج الأسئلة",
      "suggestedMergedQuestion": "صياغة السؤال المدمج المقترح"
    }
  ]
}

ملاحظة: قم فقط بإرجاع مجموعات الأسئلة المتشابهة (لا تدرج الأسئلة الفريدة).`;

    const response = await ai.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: "أنت خبير في تحليل النصوص العربية والكشف عن التشابه الدلالي. قدم استجابة JSON دقيقة ومفصلة." },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0]?.message?.content || '{"duplicateGroups":[]}';
    const result = JSON.parse(content);
    return result.duplicateGroups || [];
  } catch (error) {
    console.error('Error analyzing with AI:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await checkAuth();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const faqs = await prisma.faqs.findMany({
      select: {
        id: true,
        question: true,
        answer: true,
        category: true,
        status: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (faqs.length === 0) {
      return NextResponse.json({
        success: true,
        duplicates: [],
        totalGroups: 0,
        message: 'لا توجد أسئلة للتحليل',
        analyzedWith: 'AI'
      });
    }

    const aiDuplicateGroups = await analyzeSimilarityWithAI(faqs);

    const enrichedGroups = aiDuplicateGroups.map((group, index) => {
      const questions = group.questionIds.map((id: string) => {
        const faq = faqs.find(f => f.id === id);
        return faq ? {
          id: faq.id,
          question: faq.question,
          category: faq.category,
          status: faq.status
        } : null;
      }).filter(Boolean);

      return {
        group: index + 1,
        questions,
        similarityReason: group.similarityReason,
        recommendation: group.recommendation,
        suggestedMergedQuestion: group.suggestedMergedQuestion,
        aiAnalyzed: true
      };
    });

    return NextResponse.json({
      success: true,
      duplicates: enrichedGroups,
      totalGroups: enrichedGroups.length,
      message: enrichedGroups.length > 0 
        ? `تم العثور على ${enrichedGroups.length} مجموعة من الأسئلة المتشابهة بواسطة الذكاء الاصطناعي`
        : 'لا توجد أسئلة متشابهة',
      analyzedWith: 'Groq AI (Llama 3.3 70B)'
    });
  } catch (error: any) {
    console.error('Error analyzing duplicates with AI:', error);
    return NextResponse.json(
      { success: false, error: 'فشل تحليل التكرار بواسطة الذكاء الاصطناعي: ' + error.message },
      { status: 500 }
    );
  }
}
