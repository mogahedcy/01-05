'use client';

import Script from 'next/script';

interface AllProductsSchemaProps {
  locale?: string;
}

export default function AllProductsSchema({ locale = 'ar' }: AllProductsSchemaProps) {
  const isArabic = locale === 'ar';
  const baseUrl = 'https://www.deyarsu.com';
  const brand = isArabic ? 'ديار جدة العالمية' : 'Deyar Jeddah Global';

  // جميع منتجات/خدمات الموقع
  const products = [
    {
      id: 'car-shades',
      name: isArabic ? 'مظلات سيارات' : 'Car Shades',
      description: isArabic 
        ? 'مظلات سيارات عالية الجودة من خامات PVC وLexan، مقاومة للحرارة والأمطار والغبار، بتصاميم عصرية وضمان 10 سنوات. تركيب احترافي في جدة.'
        : 'High-quality car shades made of PVC and Lexan materials, resistant to heat, rain and dust, with modern designs and 10-year warranty. Professional installation in Jeddah.',
      image: `${baseUrl}/uploads/mazallat-1.webp`,
      price: '2500',
      sku: 'MAZALLAT-001',
      category: isArabic ? 'مظلات' : 'Shades',
      url: `${baseUrl}/services/mazallat`,
      materials: isArabic 
        ? ['PVC', 'لكسان', 'حديد مجلفن', 'قماش عالي الجودة']
        : ['PVC', 'Lexan', 'Galvanized Iron', 'High-quality Fabric']
    },
    {
      id: 'pergolas',
      name: isArabic ? 'برجولات حدائق' : 'Garden Pergolas',
      description: isArabic 
        ? 'برجولات خشبية وحديدية للحدائق والاستراحات، تصاميم كلاسيكية وعصرية، مقاومة للعوامل الجوية، مع ضمان 10 سنوات وتركيب احترافي.'
        : 'Wooden and iron pergolas for gardens and rest areas, classic and modern designs, weather-resistant, with 10-year warranty and professional installation.',
      image: `${baseUrl}/uploads/pergola-1.jpg`,
      price: '3500',
      sku: 'PERGOLA-001',
      category: isArabic ? 'برجولات' : 'Pergolas',
      url: `${baseUrl}/services/pergolas`,
      materials: isArabic 
        ? ['خشب معالج', 'حديد مطلي', 'ألومنيوم', 'خشب صناعي']
        : ['Treated Wood', 'Coated Iron', 'Aluminum', 'WPC Wood']
    },
    {
      id: 'privacy-fences',
      name: isArabic ? 'سواتر خصوصية' : 'Privacy Fences',
      description: isArabic 
        ? 'سواتر خصوصية بأنواع متعددة: حديد، قماش، خشبي، شرائح، لوفر. حماية كاملة للخصوصية مع تصاميم أنيقة وضمان 15 سنة.'
        : 'Privacy fences in multiple types: iron, fabric, wooden, slats, louver. Complete privacy protection with elegant designs and 15-year warranty.',
      image: `${baseUrl}/uploads/sawater-1.webp`,
      price: '1800',
      sku: 'SAWATER-001',
      category: isArabic ? 'سواتر' : 'Fences',
      url: `${baseUrl}/services/sawater`,
      materials: isArabic 
        ? ['حديد مجلفن', 'قماش PVC', 'خشب صناعي', 'شرائح ألومنيوم']
        : ['Galvanized Iron', 'PVC Fabric', 'WPC Wood', 'Aluminum Slats']
    },
    {
      id: 'sandwich-panel',
      name: isArabic ? 'ساندوتش بانل' : 'Sandwich Panel',
      description: isArabic 
        ? 'ألواح ساندوتش بانل للعزل الحراري والصوتي، مثالية للمستودعات والهناجر والملحقات. عزل فائق وتركيب سريع بضمان 10 سنوات.'
        : 'Sandwich panels for thermal and acoustic insulation, ideal for warehouses, hangars and annexes. Superior insulation and quick installation with 10-year warranty.',
      image: `${baseUrl}/uploads/sandwich-panel-1.jpg`,
      price: '4500',
      sku: 'SANDWICH-001',
      category: isArabic ? 'ساندوتش بانل' : 'Sandwich Panel',
      url: `${baseUrl}/services/sandwich-panel`,
      materials: isArabic 
        ? ['صاج مجلفن', 'فوم عازل', 'بولي يوريثان', 'صوف صخري']
        : ['Galvanized Steel', 'Insulating Foam', 'Polyurethane', 'Rock Wool']
    },
    {
      id: 'landscaping',
      name: isArabic ? 'تنسيق حدائق' : 'Landscaping',
      description: isArabic 
        ? 'خدمات تنسيق وتصميم الحدائق المنزلية والتجارية، زراعة النباتات والأشجار، تركيب العشب الصناعي والطبيعي، شبكات الري الآلية.'
        : 'Landscaping and garden design services for residential and commercial properties, planting, artificial and natural grass installation, automatic irrigation systems.',
      image: `${baseUrl}/uploads/landscaping-1.webp`,
      price: '5000',
      sku: 'LANDSCAPE-001',
      category: isArabic ? 'تنسيق حدائق' : 'Landscaping',
      url: `${baseUrl}/services/landscaping`,
      materials: isArabic 
        ? ['عشب صناعي', 'نباتات زينة', 'حجر طبيعي', 'إضاءة خارجية']
        : ['Artificial Grass', 'Ornamental Plants', 'Natural Stone', 'Outdoor Lighting']
    },
    {
      id: 'traditional-tents',
      name: isArabic ? 'بيوت شعر تراثية' : 'Traditional Hair Houses',
      description: isArabic 
        ? 'بيوت شعر تراثية أصيلة بتصاميم سعودية عريقة، مصنوعة من أجود أنواع شعر الماعز، مثالية للاستراحات والمناسبات.'
        : 'Authentic traditional hair houses with original Saudi designs, made from the finest goat hair, ideal for rest areas and events.',
      image: `${baseUrl}/uploads/byoot-shaar-1.webp`,
      price: '8000',
      sku: 'BYOOT-001',
      category: isArabic ? 'بيوت شعر' : 'Traditional Houses',
      url: `${baseUrl}/services/byoot-shaar`,
      materials: isArabic 
        ? ['شعر ماعز طبيعي', 'أعمدة خشبية', 'حبال قطنية', 'قماش تراثي']
        : ['Natural Goat Hair', 'Wooden Poles', 'Cotton Ropes', 'Traditional Fabric']
    },
    {
      id: 'royal-tents',
      name: isArabic ? 'خيام ملكية' : 'Royal Tents',
      description: isArabic 
        ? 'خيام ملكية فاخرة للمناسبات والأفراح والاستراحات، تصاميم راقية ومساحات واسعة، مقاومة للعوامل الجوية مع تجهيزات متكاملة.'
        : 'Luxury royal tents for events, weddings and rest areas, elegant designs and spacious areas, weather-resistant with complete equipment.',
      image: `${baseUrl}/uploads/khayyam-1.webp`,
      price: '12000',
      sku: 'KHAYYAM-001',
      category: isArabic ? 'خيام ملكية' : 'Royal Tents',
      url: `${baseUrl}/services/khayyam`,
      materials: isArabic 
        ? ['قماش مقاوم للماء', 'هيكل ألومنيوم', 'إضاءة LED', 'تكييف']
        : ['Waterproof Fabric', 'Aluminum Frame', 'LED Lighting', 'Air Conditioning']
    },
    {
      id: 'renovation',
      name: isArabic ? 'ترميم وتجديد' : 'Renovation',
      description: isArabic 
        ? 'خدمات ترميم وتجديد الملحقات والاستراحات والفلل، تحديث التصاميم، إصلاح الأضرار، تحسين العزل، بأسعار منافسة.'
        : 'Renovation services for annexes, rest areas and villas, design updates, damage repair, insulation improvement, at competitive prices.',
      image: `${baseUrl}/uploads/renovation-1.webp`,
      price: '15000',
      sku: 'RENOVATION-001',
      category: isArabic ? 'ترميم' : 'Renovation',
      url: `${baseUrl}/services/renovation`,
      materials: isArabic 
        ? ['دهانات عازلة', 'بلاط', 'جبس بورد', 'أسقف معلقة']
        : ['Insulating Paints', 'Tiles', 'Gypsum Board', 'Suspended Ceilings']
    }
  ];

  // إنشاء ItemList Schema لجميع المنتجات
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": isArabic ? "خدمات ديار جدة العالمية" : "Deyar Jeddah Global Services",
    "description": isArabic 
      ? "قائمة شاملة بجميع خدمات ومنتجات شركة ديار جدة العالمية للمظلات والسواتر والبرجولات"
      : "Comprehensive list of all services and products by Deyar Jeddah Global for shades, fences and pergolas",
    "numberOfItems": products.length,
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "@id": `${baseUrl}/#product-${product.id}`,
        "name": product.name,
        "description": product.description,
        "image": product.image,
        "url": product.url,
        "sku": product.sku,
        "category": product.category,
        "brand": {
          "@type": "Brand",
          "name": brand
        },
        "manufacturer": {
          "@type": "Organization",
          "name": brand,
          "url": baseUrl
        },
        "offers": {
          "@type": "Offer",
          "url": product.url,
          "priceCurrency": "SAR",
          "price": product.price,
          "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          "availability": "https://schema.org/InStock",
          "itemCondition": "https://schema.org/NewCondition",
          "seller": {
            "@type": "LocalBusiness",
            "name": brand,
            "url": baseUrl
          },
          "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingDestination": {
              "@type": "DefinedRegion",
              "addressCountry": "SA",
              "addressRegion": isArabic ? "جدة" : "Jeddah"
            },
            "deliveryTime": {
              "@type": "ShippingDeliveryTime",
              "handlingTime": {
                "@type": "QuantitativeValue",
                "minValue": 1,
                "maxValue": 3,
                "unitCode": "DAY"
              },
              "transitTime": {
                "@type": "QuantitativeValue",
                "minValue": 0,
                "maxValue": 1,
                "unitCode": "DAY"
              }
            }
          },
          "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "SA",
            "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
            "merchantReturnDays": 30,
            "returnMethod": "https://schema.org/ReturnByMail",
            "returnFees": "https://schema.org/FreeReturn"
          }
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "287",
          "bestRating": "5",
          "worstRating": "1"
        },
        "additionalProperty": product.materials.map(material => ({
          "@type": "PropertyValue",
          "name": isArabic ? "المواد المستخدمة" : "Materials Used",
          "value": material
        }))
      }
    }))
  };

  // إنشاء OfferCatalog Schema
  const offerCatalogSchema = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    "name": isArabic ? "كتالوج خدمات ديار جدة العالمية" : "Deyar Jeddah Global Services Catalog",
    "description": isArabic 
      ? "كتالوج شامل لجميع خدمات المظلات والسواتر والبرجولات في جدة"
      : "Comprehensive catalog of all shades, fences and pergolas services in Jeddah",
    "numberOfItems": products.length,
    "provider": {
      "@type": "LocalBusiness",
      "name": brand,
      "url": baseUrl,
      "telephone": "+966553719009",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": isArabic ? "جدة" : "Jeddah",
        "addressRegion": isArabic ? "منطقة مكة المكرمة" : "Makkah Province",
        "addressCountry": "SA"
      }
    },
    "itemListElement": products.map((product, index) => ({
      "@type": "Offer",
      "itemOffered": {
        "@type": "Service",
        "name": product.name,
        "description": product.description,
        "image": product.image,
        "url": product.url,
        "provider": {
          "@type": "LocalBusiness",
          "name": brand
        },
        "areaServed": {
          "@type": "City",
          "name": isArabic ? "جدة" : "Jeddah"
        },
        "serviceType": product.category
      },
      "price": product.price,
      "priceCurrency": "SAR",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString().split('T')[0],
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    }))
  };

  return (
    <>
      <Script
        id="all-products-itemlist-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        strategy="afterInteractive"
      />
      <Script
        id="offer-catalog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offerCatalogSchema) }}
        strategy="afterInteractive"
      />
    </>
  );
}
