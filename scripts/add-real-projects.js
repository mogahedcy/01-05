
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const realProjects = [
  {
    title: "مظلة سيارات حديثة - فيلا الروضة",
    description: "تصميم وتنفيذ مظلة سيارات عصرية لفيلا في حي الروضة بجدة مع هيكل معدني قوي وتغطية عالية الجودة مقاومة للعوامل الجوية",
    category: "مظلات",
    location: "جدة - حي الروضة",
    completionDate: new Date('2024-01-15'),
    client: "أحمد العمري",
    featured: true,
    projectDuration: "5 أيام",
    projectCost: "8500 ريال",
    mediaItems: [
      {
        type: "IMAGE",
        src: "/uploads/mazallat-1.webp",
        title: "مظلة السيارات الرئيسية",
        description: "عرض شامل للمظلة المنجزة"
      },
      {
        type: "IMAGE", 
        src: "/uploads/mazallat-2.webp",
        title: "تفاصيل التركيب",
        description: "جودة التنفيذ والتشطيب"
      }
    ],
    tags: ["مظلات", "سيارات", "معدن", "جدة"],
    materials: ["هيكل معدني مجلفن", "قماش PVC", "براغي ستانلس"]
  },
  {
    title: "برجولة خشبية فاخرة - حديقة منزلية",
    description: "تصميم وتنفيذ برجولة خشبية أنيقة للحديقة مع إضاءة LED متكاملة ونظام تغطية قابل للطي",
    category: "برجولات", 
    location: "جدة - حي النسيم",
    completionDate: new Date('2024-02-20'),
    client: "فاطمة الزهراني",
    featured: false,
    projectDuration: "8 أيام",
    projectCost: "12000 ريال",
    mediaItems: [
      {
        type: "IMAGE",
        src: "/uploads/pergola-1.jpg",
        title: "البرجولة الخشبية",
        description: "تصميم عصري مع إضاءة ذكية"
      },
      {
        type: "IMAGE",
        src: "/uploads/pergola-2.jpg", 
        title: "منظر ليلي",
        description: "الإضاءة المدمجة تضفي جواً ساحراً"
      }
    ],
    tags: ["برجولات", "خشب", "إضاءة", "حدائق"],
    materials: ["خشب الصنوبر المعالج", "إضاءة LED", "قماش مقاوم للماء"]
  },
  {
    title: "ساتر خصوصية معدني مزخرف",
    description: "تنفيذ ساتر حديدي مزخرف بتصاميم عربية أصيلة لضمان الخصوصية مع الحفاظ على الجمالية",
    category: "سواتر",
    location: "جدة - حي الصفا", 
    completionDate: new Date('2024-03-10'),
    client: "محمد الغامدي",
    featured: true,
    projectDuration: "4 أيام",
    projectCost: "6500 ريال",
    mediaItems: [
      {
        type: "IMAGE",
        src: "/uploads/sawater-1.webp",
        title: "الساتر المعدني",
        description: "تصميم عربي أصيل مع زخارف معدنية"
      },
      {
        type: "IMAGE",
        src: "/uploads/sawater-2.webp",
        title: "تفاصيل الزخرفة", 
        description: "جودة الصناعة والتشطيب"
      }
    ],
    tags: ["سواتر", "حديد", "خصوصية", "زخارف"],
    materials: ["حديد مجلفن", "دهان إلكتروستاتيك", "زخارف معدنية"]
  },
  {
    title: "تنسيق حديقة فيلا مع نظام ري ذكي",
    description: "تصميم وتنفيذ حديقة متكاملة مع نباتات محلية ونظام ري ذكي وإضاءة ليلية جميلة",
    category: "تنسيق حدائق",
    location: "جدة - حي الحمراء",
    completionDate: new Date('2024-02-28'),
    client: "سارة الأحمدي", 
    featured: true,
    projectDuration: "12 يوم",
    projectCost: "15500 ريال",
    mediaItems: [
      {
        type: "IMAGE",
        src: "/uploads/landscaping-1.webp",
        title: "الحديقة المكتملة",
        description: "تنسيق شامل مع نباتات متنوعة"
      }
    ],
    tags: ["تنسيق حدائق", "ري ذكي", "نباتات", "إضاءة"],
    materials: ["نباتات محلية", "نظام ري بالتنقيط", "إضاءة LED", "تربة معالجة"]
  },
  {
    title: "بيت شعر تراثي للاستراحة",
    description: "تنفيذ بيت شعر تراثي أصيل بمواد عالية الجودة مع تجهيزات عصرية للراحة والضيافة",
    category: "بيوت شعر",
    location: "جدة - طريق المدينة",
    completionDate: new Date('2024-01-25'),
    client: "عبدالله الحربي",
    featured: false,
    projectDuration: "6 أيام", 
    projectCost: "9500 ريال",
    mediaItems: [
      {
        type: "IMAGE",
        src: "/uploads/byoot-shaar-1.webp",
        title: "بيت الشعر التراثي",
        description: "تصميم أصيل بمواد تقليدية عالية الجودة"
      }
    ],
    tags: ["بيوت شعر", "تراث", "ضيافة", "أصالة"],
    materials: ["شعر الماعز الطبيعي", "أعمدة خشبية", "حبال قوية", "أوتاد معدنية"]
  },
  {
    title: "خيمة ملكية فاخرة للمناسبات",
    description: "تجهيز خيمة ملكية فاخرة مجهزة بالكامل للمناسبات والأفراح مع تكييف وإضاءة وفرش راقي",
    category: "خيام ملكية",
    location: "جدة - حي الشاطئ",
    completionDate: new Date('2024-03-05'),
    client: "نورا السلمي",
    featured: true,
    projectDuration: "3 أيام",
    projectCost: "18000 ريال",
    mediaItems: [
      {
        type: "IMAGE",
        src: "/uploads/khayyam-1.webp", 
        title: "الخيمة الملكية",
        description: "تجهيز فاخر للمناسبات الخاصة"
      }
    ],
    tags: ["خيام ملكية", "مناسبات", "فخامة", "تكييف"],
    materials: ["قماش ملكي فاخر", "هيكل معدني", "تكييف مركزي", "فرش راقي"]
  }
];

async function addRealProjects() {
  try {
    console.log('🚀 بدء إضافة المشاريع الحقيقية...');

    // حذف المشاريع الوهمية أولاً
    console.log('🗑️ حذف المشاريع القديمة...');
    await prisma.mediaItem.deleteMany();
    await prisma.projectTag.deleteMany();
    await prisma.projectMaterial.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.project.deleteMany();

    let addedCount = 0;

    for (const projectData of realProjects) {
      const { mediaItems, tags, materials, ...projectInfo } = projectData;

      console.log(`📁 إضافة مشروع: ${projectInfo.title}`);

      const project = await prisma.project.create({
        data: {
          ...projectInfo,
          views: Math.floor(Math.random() * 200) + 50,
          likes: Math.floor(Math.random() * 50) + 10,
          rating: 4.2 + Math.random() * 0.8,
          mediaItems: {
            create: mediaItems.map((item, index) => ({
              ...item,
              order: index
            }))
          },
          tags: {
            create: tags.map(tag => ({ name: tag }))
          },
          materials: {
            create: materials.map(material => ({ name: material }))
          }
        },
        include: {
          mediaItems: true,
          tags: true,
          materials: true
        }
      });

      console.log(`✅ تم إضافة: ${project.title} (${project.mediaItems.length} وسائط)`);
      addedCount++;
    }

    console.log(`\n🎉 تم الانتهاء! تم إضافة ${addedCount} مشروع حقيقي`);

  } catch (error) {
    console.error('❌ خطأ في إضافة المشاريع:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// تشغيل السكريبت
if (require.main === module) {
  addRealProjects()
    .then(() => {
      console.log('✨ تم الانتهاء من إضافة المشاريع الحقيقية!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 خطأ في تشغيل السكريبت:', error);
      process.exit(1);
    });
}

module.exports = { addRealProjects };
