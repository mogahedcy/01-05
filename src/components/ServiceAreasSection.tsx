import { MapPin, Clock, CheckCircle, Car, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const serviceAreas = [
  {
    name: 'شمال جدة',
    districts: ['الشاطئ', 'الروضة', 'النعيم', 'الصفا', 'أبحر الشمالية', 'أبحر الجنوبية'],
    responseTime: '30 دقيقة',
    projects: '+1200',
    color: 'bg-blue-50 border-blue-200',
    icon: '🌊'
  },
  {
    name: 'وسط جدة',
    districts: ['البلد', 'الصحيفة', 'المحمدية', 'الجامعة', 'الخالدية', 'الفيصلية'],
    responseTime: '20 دقيقة',
    projects: '+1500',
    color: 'bg-green-50 border-green-200',
    icon: '🏛️'
  },
  {
    name: 'شرق جدة',
    districts: ['الحمراء', 'المروة', 'النزهة', 'الصالحية', 'باب مكة', 'الثعالبة'],
    responseTime: '25 دقيقة',
    projects: '+1000',
    color: 'bg-orange-50 border-orange-200',
    icon: '🏗️'
  },
  {
    name: 'جنوب جدة',
    districts: ['الجوهرة', 'الحرازات', 'ذهبان', 'الياقوت', 'المرجان', 'الفروسية'],
    responseTime: '35 دقيقة',
    projects: '+800',
    color: 'bg-purple-50 border-purple-200',
    icon: '🏘️'
  },
  {
    name: 'غرب جدة',
    districts: ['الكورنيش', 'الشرفية', 'الأندلس', 'الزهراء', 'الرحاب', 'النهضة'],
    responseTime: '25 دقيقة',
    projects: '+1100',
    color: 'bg-teal-50 border-teal-200',
    icon: '🏖️'
  },
  {
    name: 'الأحياء الجديدة',
    districts: ['حي الياسمين', 'النرجس', 'المحمدية الجديدة', 'ذا سيتي', 'الأمير عبدالمجيد'],
    responseTime: '40 دقيقة',
    projects: '+600',
    color: 'bg-indigo-50 border-indigo-200',
    icon: '🌟'
  }
];

const services = [
  { name: 'مظلات سيارات', icon: Car, coverage: 'جميع المناطق' },
  { name: 'برجولات حدائق', icon: Building, coverage: 'جميع المناطق' },
  { name: 'ساندوتش بانل', icon: Building, coverage: 'المناطق الصناعية' },
  { name: 'ترميم ملحقات', icon: Building, coverage: 'جميع المناطق' },
];

export default function ServiceAreasSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 text-accent rounded-full mb-6">
            <MapPin className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            مناطق خدماتنا في جدة
          </h2>
          <p className="text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            ديار جدة العالمية تغطي جميع أحياء ومناطق جدة بفرق عمل متخصصة ومتنقلة.
            نصل إليكم أينما كنتم في جدة لتقديم أفضل خدماتنا بأسرع وقت ممكن
          </p>
        </div>

        {/* Service Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {serviceAreas.map((area) => (
            <div key={area.name} className={`${area.color} border-2 rounded-2xl p-6 hover:shadow-lg transition-all duration-300`}>
              {/* Area Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3 space-x-reverse">
                  <span className="text-2xl">{area.icon}</span>
                  <h3 className="text-xl font-bold text-primary">
                    {area.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">زمن الوصول</div>
                  <div className="font-bold text-accent">{area.responseTime}</div>
                </div>
              </div>

              {/* Districts */}
              <div className="mb-4">
                <h4 className="font-semibold text-primary mb-2">الأحياء المخدومة:</h4>
                <div className="flex flex-wrap gap-1">
                  {area.districts.map((district) => (
                    <span key={district} className="text-xs bg-white px-2 py-1 rounded-full text-muted-foreground">
                      {district}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-white">
                <div className="flex items-center space-x-2 space-x-reverse text-sm">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-muted-foreground">مشاريع مكتملة</span>
                </div>
                <div className="font-bold text-accent">
                  {area.projects}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Coverage */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-12">
          <h3 className="text-2xl font-bold text-primary text-center mb-8">
            تغطية الخدمات حسب المنطقة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const IconComponent = service.icon;
              return (
                <div key={service.name} className="text-center p-4 border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 text-accent rounded-full mb-3">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h4 className="font-semibold text-primary mb-2">
                    {service.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {service.coverage}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Coverage Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl font-bold text-accent mb-2">100%</div>
            <div className="text-sm text-muted-foreground font-medium">تغطية جدة</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl font-bold text-accent mb-2">24/7</div>
            <div className="text-sm text-muted-foreground font-medium">خدمة عملاء</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl font-bold text-accent mb-2">30</div>
            <div className="text-sm text-muted-foreground font-medium">دقيقة وسطياً</div>
          </div>
          <div className="text-center bg-white rounded-2xl p-6 shadow-lg">
            <div className="text-4xl font-bold text-accent mb-2">8</div>
            <div className="text-sm text-muted-foreground font-medium">خدمات شاملة</div>
          </div>
        </div>

        {/* Emergency Services */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 text-red-600 rounded-full mb-6">
            <Clock className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-4">
            خدمة الطوارئ السريعة
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            لدينا فريق طوارئ متخصص متاح 24/7 للحالات العاجلة في جميع أنحاء جدة.
            إصلاحات سريعة وصيانة طارئة لجميع خدماتنا
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
              <Link href="tel:+966553719009" className="flex items-center space-x-2 space-x-reverse">
                <span>طوارئ: 966553719009+</span>
              </Link>
            </Button>
            <Button variant="outline" size="lg">
              <Link href="https://wa.me/+966553719009" className="flex items-center space-x-2 space-x-reverse">
                <span>واتساب سريع</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
