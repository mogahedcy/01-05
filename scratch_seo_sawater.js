const fs = require('fs');
const arPath = 'messages/ar.json';
const enPath = 'messages/en.json';
const ar = JSON.parse(fs.readFileSync(arPath));
const en = JSON.parse(fs.readFileSync(enPath));

ar.sawater.seoArticle = {
  title: 'الدليل المرجعي لتركيب السواتر الجدارية وتأمين الخصوصية في جدة',
  paragraphs: [
    'تعتبر السواتر (Fences) من أهم المتطلبات الأساسية في المجتمع السعودي، حيث ترتبط ارتباطاً وثيقاً بثقافة الخصوصية العائلية والأمان. نحن في ديار جدة العالمية ندرك هذه الحاجة، ولذلك نقدم أحدث الحلول المبتكرة لرفع الأسوار وتركيب السواتر الجدارية التي تضمن حجب الرؤية تماماً بين الجيران بنسبة 100%، مع السماح بمرور الهواء وتوفير عزل حراري وحماية من تقلبات الطقس والرياح المحملة بالأتربة التي تميز مدينة جدة والمناطق المجاورة.',
    'تتنوع خيارات السواتر لدينا لتناسب جميع الاحتياجات والميزانيات، ولعل أبرزها السواتر الحديدية (مجدول وشرائح) والتي تعد الأقوى والأطول عمراً في مقاومة الصدأ والتآكل بفضل دهانات الفرن الحراري. كما نقدم سواتر الخشب البلاستيكي (WPC) التي تجمع بين فخامة الشكل الطبيعي للخشب ومقاومة البلاستيك للتسوس، بالإضافة إلى سواتر اللكسان الشفافة والملونة التي تحافظ على الإضاءة الطبيعية للمسابح والاستراحات، والسواتر القماشية (PVC والبولي إيثيلين) التي تعتبر خياراً اقتصادياً وفعالاً بتشكيلة ألوان عصرية.',
    'لا يقتصر دور الساتر على توفير الخصوصية فحسب، بل يلعب دوراً محورياً في تجميل الواجهات الخارجية للفلل والمنازل. بفضل فريقنا الهندسي والفني ذو الخبرة التي تفوق 15 عاماً، نضمن لك تثبيت السواتر بأقصى درجات المتانة والأمان للتعامل مع قوة الرياح، مع توفير تصاميم مودرن كلاسيكية تتناغم مع هوية مبناك. جميع أعمالنا مدعومة بضمان شامل يصل إلى 10 سنوات، لأننا نثق في جودة المواد العالمية التي نستخدمها في كل تفصيلة من تفاصيل التركيب.'
  ],
  keywordsTitle: 'أبرز الكلمات البحثية لخدمات السواتر:',
  keywordsList: [
    'سواتر حديد مجدول وشرائح',
    'أفضل شركة تركيب سواتر بجدة',
    'سواتر خشبية معالجة WPC',
    'رفع أسوار الفلل',
    'سواتر قماش PVC',
    'سواتر لكسان شفافة للمسابح',
    'حداد سواتر وتغطيات',
    'سواتر بلاستيك مقوى',
    'حجب الرؤية بين الجيران',
    'أسعار السواتر في جدة'
  ]
};

en.sawater.seoArticle = {
  title: 'The Ultimate Guide to Wall Fences & Privacy Screens Installation in Jeddah',
  paragraphs: [
    "Privacy screens and fences (Sawater) are fundamental requirements in Saudi society, deeply connected to the culture of family privacy and security. At Aldeyar Global Professionals, we understand this need and offer the latest innovative solutions for extending wall heights and installing privacy screens that guarantee 100% vision block between neighbors while allowing airflow and providing thermal insulation against Jeddah's unique climate and dusty winds.",
    "Our fence options vary to suit all needs and budgets. The most prominent are iron fences (slatted and braided), which are the strongest and longest-lasting, highly resistant to rust and corrosion thanks to thermal oven paint finishes. We also provide Wood Plastic Composite (WPC) fences that combine the luxurious, natural look of wood with plastic's resistance to decay. In addition, we offer transparent and colored Lexan screens ideal for pools and resorts, as well as fabric fences (PVC and Polyethylene) that serve as highly effective, economical options available in modern color palettes.",
    "The role of a privacy screen is not limited to concealment; it plays a pivotal role in beautifying the exterior facades of villas and homes. With our engineering and technical team boasting over 15 years of experience, we ensure that fences are installed with maximum durability to withstand high winds, offering modern and classic designs that harmonize with your building's architectural identity. All our projects are backed by a comprehensive 10-year warranty, reflecting our absolute confidence in the world-class materials we use in every detail of our installation process."
  ],
  keywordsTitle: 'Key Search Terms for Fences & Privacy Screens:',
  keywordsList: [
    'Braided iron fences',
    'Best fence installation in Jeddah',
    'WPC wooden privacy screens',
    'Villa wall extension',
    'PVC fabric fences',
    'Transparent Lexan for pools',
    'Fences and coverings blacksmith',
    'Reinforced plastic screens',
    'Neighbor privacy screens',
    'Fence prices in Jeddah'
  ]
};

fs.writeFileSync(arPath, JSON.stringify(ar, null, 2));
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
console.log("Sawater SEO article injected successfully!");
