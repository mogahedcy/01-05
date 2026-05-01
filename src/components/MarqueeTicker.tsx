'use client';

import { useLocale } from 'next-intl';

export default function MarqueeTicker() {
  const locale = useLocale();
  const isArabic = locale === 'ar';

  const items = isArabic 
    ? [
        "حي الشاطئ", "حي الروضة", "حي الخالدية", "حي النعيم", "حي الزهراء", 
        "حي المحمدية", "حي المرجان", "حي السلامة", "حي الأندلس", "حي الحمراء",
        "حي البساتين", "حي النهضة"
      ]
    : [
        "Al Shati", "Al Rawdah", "Al Khalidiyah", "Al Naim", "Al Zahra",
        "Al Mohammadiyyah", "Al Murjan", "Al Salamah", "Al Andalus", "Al Hamra",
        "Al Basateen", "Al Nahdah"
      ];

  // Double the array to make the infinite scroll seamless
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 py-3 overflow-hidden flex whitespace-nowrap shadow-inner border-y border-amber-600">
      <div className="flex animate-marquee items-center" dir="ltr">
        {duplicatedItems.map((item, index) => (
          <div key={index} className="flex items-center mx-4">
            <span className="text-black font-bold text-sm md:text-base tracking-wide whitespace-nowrap">
              {item}
            </span>
            <span className="mx-4 text-black/40 text-xl font-black">•</span>
          </div>
        ))}
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 30s linear infinite;
          min-width: 200%;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
