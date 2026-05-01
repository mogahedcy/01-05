const fs = require('fs');
const arPath = 'messages/ar.json';
const enPath = 'messages/en.json';
const ar = JSON.parse(fs.readFileSync(arPath));
const en = JSON.parse(fs.readFileSync(enPath));

ar.pergolas.seoArticle = {
  title: 'الدليل المرجعي لتصميم وتركيب البرجولات والجلسات الخارجية في جدة',
  paragraphs: [
    'البرجولات (Pergolas) لم تعد مجرد إضافة كمالية، بل أصبحت العنصر المعماري الأهم في تحويل الحدائق المنزلية، الأحواش، والأسطح إلى مساحات معيشة خارجية تنبض بالفخامة والراحة. نحن في ديار جدة العالمية نتفوق في تحويل الأماكن المهدرة إلى جلسات خارجية فاخرة، باستخدام أحدث تقنيات بناء البرجولات المودرن والكلاسيكية التي تناسب ذوق العميل وتتحمل الطقس الحار والرطوبة العالية في مدينة جدة والمناطق الساحلية.',
    'عند اتخاذ قرار بتركيب برجولة، فإن اختيار نوع المادة هو العامل الحاسم لعمرها الافتراضي وجمالياتها. نحن نوفر تشكيلة واسعة تلبي جميع التطلعات، بدءاً من البرجولات الخشبية المصنوعة من الخشب الطبيعي المعالج أو الخشب البلاستيكي (WPC) الذي يجمع بين مظهر الخشب الفاخر ومقاومة البلاستيك للتسوس والمياه. كما نتميز في تصميم البرجولات الحديدية المجدولة ذات الطابع الخشبي، والبرجولات الألمنيوم العصرية التي لا تصدأ ولا تتأثر بحرارة الشمس، بالإضافة إلى إضافة تغطيات من اللكسان الشفاف أو القماش كعازل لحرارة الشمس وتوفير ظل كامل.',
    'يعتبر استغلال الأسطح (Rooftops) من أهم اتجاهات التصميم الحديث في السعودية. نقدم خدمة متكاملة لتصميم وتنسيق برجولات الأسطح مع إضافات رائعة مثل العشب الصناعي (النجيلة)، والإضاءات المخفية، وسواتر الحماية الزجاجية أو الخشبية لضمان الخصوصية التامة للعائلة. بفضل خبرتنا التي تتجاوز 15 عاماً وفريق المهندسين والفنيين المحترفين لدينا، نضمن لك تسليم مشروعك بأعلى درجات الدقة الهندسية والجمالية مع ضمان يمتد لـ 10 سنوات على الهيكل والتنفيذ.'
  ],
  keywordsTitle: 'أهم الكلمات البحثية في مجال البرجولات:',
  keywordsList: [
    'برجولات خشبية جدة',
    'تركيب برجولات حديد مودرن',
    'أفضل شركة برجولات في جدة',
    'برجولات أسطح واستراحات',
    'جلسات خارجية للمنازل',
    'خشب معالج WPC للحدائق',
    'برجولات ألمنيوم',
    'برجولات لكسان شفافة',
    'حداد برجولات وجلسات',
    'أسعار البرجولات الخشبية'
  ]
};

en.pergolas.seoArticle = {
  title: 'The Ultimate Guide to Designing & Installing Pergolas & Outdoor Seating in Jeddah',
  paragraphs: [
    'Pergolas are no longer just an aesthetic accessory; they have become the most crucial architectural element in transforming home gardens, patios, and rooftops into luxurious outdoor living spaces. At Aldeyar Global Professionals, we excel at turning unused areas into premium outdoor seating using the latest techniques in modern and classic pergola construction, tailored to your taste and built to withstand the hot climate and high humidity of Jeddah and coastal regions.',
    'When deciding to install a pergola, choosing the right material is the deciding factor for its lifespan and aesthetics. We offer a wide selection that meets all expectations, starting from wooden pergolas made of treated natural wood or Wood Plastic Composite (WPC), which combines the luxurious look of wood with plastic\'s resistance to decay and water. We also specialize in designing braided steel pergolas with a faux wood finish, and modern aluminum pergolas that never rust or degrade under intense sunlight. Additionally, we provide roof covers made of transparent Lexan or heavy-duty fabrics to insulate against solar heat and provide complete shade.',
    'Utilizing rooftops is one of the most prominent modern design trends in Saudi Arabia. We provide an integrated service for designing and landscaping rooftop pergolas, complemented by fantastic additions such as artificial grass (turf), concealed lighting, and glass or wooden privacy screens (Sawater) to ensure absolute privacy for your family. With over 15 years of experience and a team of professional engineers and technicians, we guarantee the delivery of your project with the highest degree of engineering and aesthetic precision, backed by a 10-year warranty on structure and execution.'
  ],
  keywordsTitle: 'Key Search Terms for Pergolas:',
  keywordsList: [
    'Wooden pergolas Jeddah',
    'Modern steel pergolas installation',
    'Best pergola company in Jeddah',
    'Rooftop and resort pergolas',
    'Outdoor home seating',
    'WPC wood for gardens',
    'Aluminum pergolas',
    'Transparent Lexan pergolas',
    'Pergola & seating blacksmith',
    'Wooden pergola prices'
  ]
};

fs.writeFileSync(arPath, JSON.stringify(ar, null, 2));
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));
console.log("Done");
