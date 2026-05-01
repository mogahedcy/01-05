import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const mazallatFAQs = [
  {
    question: 'ما هي أفضل أنواع المظلات للسيارات في جدة؟',
    answer: 'تعتبر مظلات PVC ومظلات القماش المعالج ومظلات اللكسان من أفضل الأنواع للسيارات في مناخ جدة. مظلات PVC هي الأكثر انتشارًا بسبب متانتها وقدرتها على عزل الحرارة وسعرها المناسب، بينما مظلات اللكسان توفر شفافية وإضاءة طبيعية.',
    category: 'مظلات',
    order: 1,
    featured: true
  },
  {
    question: 'كم تبلغ مدة تنفيذ مشروع المظلات؟',
    answer: 'تختلف مدة التنفيذ حسب حجم المشروع ونوع المظلة. للمشاريع الصغيرة (1-4 مظلات): 3-5 أيام، للمشاريع المتوسطة (5-15 مظلة): 7-10 أيام، للمشاريع الكبيرة (أكثر من 15 مظلة): 2-3 أسابيع.',
    category: 'مظلات',
    order: 2,
    featured: false
  },
  {
    question: 'ما هو الضمان المقدم على المظلات؟',
    answer: 'نقدم ضمان شامل يصل إلى 10 سنوات على المظلات حسب نوع الخامة المستخدمة. يشمل الضمان: جودة التركيب والخامات، مقاومة العوامل الجوية، الصيانة الدورية المجانية للسنة الأولى.',
    category: 'مظلات',
    order: 3,
    featured: false
  },
  {
    question: 'هل تقومون بالصيانة الدورية للمظلات؟',
    answer: 'نعم، نقدم خدمة صيانة دورية شاملة تشمل: تنظيف المظلات، فحص الهيكل المعدني، تشحيم المفاصل، استبدال القطع التالفة. الصيانة مجانية للسنة الأولى ثم بأسعار مدروسة.',
    category: 'مظلات',
    order: 4,
    featured: false
  },
  {
    question: 'ما هي تكلفة تركيب مظلات السيارات؟',
    answer: 'تبدأ أسعار مظلات السيارات من 2,500 ريال للمظلة الواحدة وتختلف حسب: نوع الخامة المستخدمة، حجم المظلة، تعقيد التصميم، الموقع الجغرافي. نقدم عروض أسعار مجانية مع إمكانية التقسيط.',
    category: 'مظلات',
    order: 5,
    featured: true
  },
  {
    question: 'هل تخدمون جميع مناطق جدة؟',
    answer: 'نعم، نخدم جميع أحياء ومناطق جدة بما في ذلك: شمال جدة (أبحر، الشاطئ، النهضة)، وسط جدة (العزيزية، البلد، الحمراء)، شرق جدة (الفيصلية، النزهة، الروضة)، جنوب جدة (الصفا، المروة، برايمان).',
    category: 'مظلات',
    order: 6,
    featured: false
  }
];

export async function GET() {
  try {
    const existingCount = await prisma.faqs.count({
      where: { category: 'مظلات' }
    });

    if (existingCount > 0) {
      return NextResponse.json({
        success: false,
        message: `البيانات موجودة بالفعل. يوجد ${existingCount} سؤال في فئة المظلات.`
      });
    }

    const created = await prisma.faqs.createMany({
      data: mazallatFAQs
    });

    return NextResponse.json({
      success: true,
      message: `تم إضافة ${created.count} سؤال بنجاح!`,
      count: created.count
    });
  } catch (error: any) {
    console.error('Error seeding FAQs:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
