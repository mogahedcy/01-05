
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const videoProjects = [
  {
    title: "ساندوتش بانل للمستودعات - المنطقة الصناعية",
    description: "تنفيذ ساندوتش بانل عالي الجودة للمستودعات والمباني الصناعية مع عزل حراري ممتاز ومقاومة للعوامل الجوية",
    category: "ساندوتش بانل",
    location: "جدة - المنطقة الصناعية الثانية",
    completionDate: new Date('2024-01-20'),
    client: "شركة التطوير الصناعي",
    featured: false,
    projectDuration: "15 يوم",
    projectCost: "45000 ريال",
    mediaItems: [
      {
        type: "IMAGE",
        src: "/uploads/sandwich-panel-1.jpg",
        title: "ساندوتش بانل المستودع",
        description: "تنفيذ احترافي لواجهات المستودعات"
      },
      {
        type: "IMAGE",
        src: "/uploads/sandwich-panel-2.jpg",
        title: "التفاصيل الداخلية",
        description: "جودة العزل والتشطيب الداخلي"
      }
    ],
    tags: ["ساندوتش بانل", "مستودعات", "عزل حراري", "صناعي"],
    materials: ["ألواح ساندوتش بانل", "هيكل معدني", "مواد عزل", "مثبتات خاصة"]
  },
  {
    title: "ترميم شامل لفيلا كلاسيكية",
    description: "مشروع ترميم متكامل لفيلا كلاسيكية يشمل إعادة تأهيل الواجهات والأسقف وتحديث الأنظمة الكهربائية والصحية",
    category: "ترميم",
    location: "جدة - حي الحمراء",
    completionDate: new Date('2024-03-15'),
    client: "عائلة الشمراني",
    featured: true,
    projectDuration: "30 يوم",
    projectCost: "35000 ريال",
    mediaItems: [
      {
        type: "IMAGE",
        src: "/uploads/renovation-1.jpg",
        title: "الفيلا بعد الترميم",
        description: "تجديد شامل مع الحفاظ على الطابع الكلاسيكي"
      },
      {
        type: "IMAGE",
        src: "/uploads/renovation-2.jpg",
        title: "تفاصيل الواجهة",
        description: "جودة المواد والتشطيبات"
      }
    ],
    tags: ["ترميم", "فيلا", "كلاسيكي", "تجديد"],
    materials: ["دهانات خارجية", "عوازل حديثة", "بلاط سيراميك", "تمديدات كهربائية"]
  }
];

async function addVideoProjects() {
  try {
    console.log('🎬 بدء إضافة المشاريع مع الفيديوهات...');

    let addedCount = 0;

    for (const projectData of videoProjects) {
      const { mediaItems, tags, materials, ...projectInfo } = projectData;

      console.log(`📁 إضافة مشروع: ${projectInfo.title}`);

      const project = await prisma.project.create({
        data: {
          ...projectInfo,
          views: Math.floor(Math.random() * 300) + 100,
          likes: Math.floor(Math.random() * 80) + 20,
          rating: 4.0 + Math.random() * 1.0,
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

    console.log(`\n🎉 تم إضافة ${addedCount} مشروع إضافي!`);

  } catch (error) {
    console.error('❌ خطأ في إضافة المشاريع:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// تشغيل السكريبت
if (require.main === module) {
  addVideoProjects()
    .then(() => {
      console.log('✨ تم الانتهاء من إضافة المشاريع الإضافية!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 خطأ في تشغيل السكريبت:', error);
      process.exit(1);
    });
}

module.exports = { addVideoProjects };
