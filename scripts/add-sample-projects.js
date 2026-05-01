const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSampleProjects() {
  try {
    console.log('🚀 إضافة مشاريع تجريبية...');

    const projects = [
      {
        id: 'cmetmvq3b0000k02wiplqk0qk',
        title: 'مظلة سيارات حديثة - فيلا الروضة',
        description: 'تركيب مظلة سيارات عصرية لفيلا فاخرة في شمال جدة بتصميم معاصر يتناسب مع الطراز المعماري للفيلا. تتميز المظلة بإضاءة LED ونظام تصريف مياه متطور.',
        category: 'مظلات',
        location: 'شمال جدة - حي الروضة',
        completionDate: new Date('2024-01-15'),
        client: 'عائلة الأحمد',
        featured: true,
        projectDuration: '5 أيام',
        projectCost: '25000 ريال',
        status: 'PUBLISHED',
        updatedAt: new Date(),
        slug: 'مظلة-سيارات-حديثة---فيلا-الروضة-cmetmvq3b0000k02wiplqk0qk'
      },
      {
        id: 'cmetmvq5b000kk02w4t27a4e2',
        title: 'ساتر خصوصية معدني مزخرف',
        description: 'تركيب ساتر خصوصية معدني بتصاميم إسلامية مزخرفة لضمان الخصوصية والحماية مع الحفاظ على الجمال المعماري.',
        category: 'سواتر',
        location: 'غرب جدة - حي النسيم',
        completionDate: new Date('2024-03-10'),
        client: 'فيلا الأمير',
        featured: false,
        projectDuration: '6 أيام',
        projectCost: '35000 ريال',
        status: 'PUBLISHED',
        updatedAt: new Date(),
        slug: 'ساتر-خصوصية-معدني-مزخرف-cmetmvq5b000kk02w4t27a4e2'
      },
      {
        id: 'cmetmvq46000ak02wpnlgxndl',
        title: 'برجولة خشبية - استراحة الواحة',
        description: 'تصميم وتنفيذ برجولة خشبية فاخرة لاستراحة عائلية مع منطقة جلوس مريحة ونظام تكييف طبيعي.',
        category: 'برجولات',
        location: 'شرق جدة - طريق الملك عبدالله',
        completionDate: new Date('2024-02-20'),
        client: 'استراحة الواحة',
        featured: true,
        projectDuration: '8 أيام',
        projectCost: '45000 ريال',
        status: 'PUBLISHED',
        updatedAt: new Date(),
        slug: 'برجولة-خشبية---استراحة-الواحة-cmetmvq46000ak02wpnlgxndl'
      },
      {
        id: 'cmetmvq73000lk02wqr8vb3m9',
        title: 'تنسيق حديقة منزلية شاملة',
        description: 'تصميم وتنفيذ حديقة منزلية متكاملة مع نظام ري ذكي ومناطق جلوس وألعاب أطفال ونباتات مناسبة للمناخ المحلي.',
        category: 'تنسيق حدائق',
        location: 'شمال جدة - حي الصفا',
        completionDate: new Date('2024-04-25'),
        client: 'عائلة الزهراني',
        featured: false,
        projectDuration: '15 يوم',
        projectCost: '55000 ريال',
        status: 'PUBLISHED',
        updatedAt: new Date(),
        slug: 'تنسيق-حديقة-منزلية-شاملة-cmetmvq73000lk02wqr8vb3m9'
      },
      {
        id: 'cmetmvq84000mk02w8x9nc4p1',
        title: 'خيمة شعر تراثية',
        description: 'تصميم وتنفيذ خيمة شعر تراثية أصيلة للمناسبات والاستقبال مع الحفاظ على الطابع التراثي السعودي الأصيل.',
        category: 'خيام',
        location: 'جدة - استراحة الأصالة',
        completionDate: new Date('2024-03-30'),
        client: 'استراحة الأصالة',
        featured: true,
        projectDuration: '4 أيام',
        projectCost: '20000 ريال',
        status: 'PUBLISHED',
        updatedAt: new Date(),
        slug: 'خيمة-شعر-تراثية-cmetmvq84000mk02w8x9nc4p1'
      },
      {
        id: 'cmetmvq95000nk02wb5l8d7q8',
        title: 'تجديد فيلا كاملة',
        description: 'تجديد شامل لفيلا قديمة مع تحديث التصاميم والمرافق وإضافة لمسات عصرية مع الحفاظ على الطابع المعماري الأصلي.',
        category: 'تجديدات',
        location: 'وسط جدة - حي البلد',
        completionDate: new Date('2024-05-15'),
        client: 'عائلة المالكي',
        featured: true,
        projectDuration: '30 يوم',
        projectCost: '120000 ريال',
        status: 'PUBLISHED',
        updatedAt: new Date(),
        slug: 'تجديد-فيلا-كاملة-cmetmvq95000nk02wb5l8d7q8'
      }
    ];

    for (const project of projects) {
      try {
        await prisma.projects.create({
          data: project
        });
        console.log(`✅ تم إضافة: ${project.title}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ المشروع ${project.title} موجود بالفعل`);
        } else {
          console.error(`❌ خطأ في إضافة ${project.title}:`, error.message);
        }
      }
    }

    // إضافة صور للمشاريع
    const mediaItems = [
      {
        id: 'media-001',
        projectId: 'cmetmvq3b0000k02wiplqk0qk',
        type: 'IMAGE',
        src: '/uploads/mazallat-1.webp',
        title: 'مظلة السيارات المكتملة',
        description: 'المنظر النهائي للمظلة مع الإضاءة',
        order: 1
      },
      {
        id: 'media-002',
        projectId: 'cmetmvq5b000kk02w4t27a4e2',
        type: 'IMAGE',
        src: '/uploads/sawater-1.webp',
        title: 'الساتر المعدني المزخرف',
        description: 'التصميم النهائي للساتر',
        order: 1
      },
      {
        id: 'media-003',
        projectId: 'cmetmvq46000ak02wpnlgxndl',
        type: 'IMAGE',
        src: '/uploads/pergola-1.jpg',
        title: 'البرجولة الخشبية',
        description: 'التصميم النهائي مع النباتات',
        order: 1
      },
      {
        id: 'media-004',
        projectId: 'cmetmvq73000lk02wqr8vb3m9',
        type: 'IMAGE',
        src: '/uploads/landscaping-1.webp',
        title: 'الحديقة المنزلية',
        description: 'التصميم النهائي للحديقة',
        order: 1
      },
      {
        id: 'media-005',
        projectId: 'cmetmvq84000mk02w8x9nc4p1',
        type: 'IMAGE',
        src: '/uploads/khayyam-1.webp',
        title: 'خيمة الشعر التراثية',
        description: 'التصميم التراثي الأصيل',
        order: 1
      },
      {
        id: 'media-006',
        projectId: 'cmetmvq95000nk02wb5l8d7q8',
        type: 'IMAGE',
        src: '/uploads/renovation-1.jpg',
        title: 'تجديد الفيلا',
        description: 'النتيجة النهائية للتجديد',
        order: 1
      }
    ];

    for (const media of mediaItems) {
      try {
        await prisma.media_items.create({
          data: media
        });
        console.log(`✅ تم إضافة صورة: ${media.title}`);
      } catch (error) {
        if (error.code === 'P2002') {
          console.log(`⚠️ الصورة ${media.title} موجودة بالفعل`);
        } else {
          console.error(`❌ خطأ في إضافة الصورة:`, error.message);
        }
      }
    }

    const totalProjects = await prisma.projects.count();
    const totalMedia = await prisma.media_items.count();
    
    console.log(`🎉 تم الانتهاء من الإعداد!`);
    console.log(`📊 إجمالي المشاريع: ${totalProjects}`);
    console.log(`🖼️ إجمالي الصور: ${totalMedia}`);
    console.log(`👤 بيانات تسجيل الدخول:`);
    console.log(`   اسم المستخدم: admin`);
    console.log(`   كلمة المرور: aldeyar2024`);

  } catch (error) {
    console.error('❌ خطأ في إضافة المشاريع:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleProjects();