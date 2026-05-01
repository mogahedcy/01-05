'use client';

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  MouseEvent as ReactMouseEvent,
  TouchEvent as ReactTouchEvent,
} from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Pair {
  beforeSrc: string;
  afterSrc: string;
  label: string;
  labelEn: string;
}

// Real before/after from actual Deyar Jeddah projects (Arabic filenames URL-encoded)
const pairs: Pair[] = [
  {
    beforeSrc: '/uploads/%D9%82%D8%A8%D9%84%20%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%20%D8%A7%D9%84%D9%85%D8%B8%D9%84%D8%A9%20.webp',
    afterSrc:  '/uploads/%D9%85%D8%B8%D9%84%D8%A7%D8%AA%20%D8%B3%D9%8A%D8%A7%D8%B1%D8%A7%D8%AA%20%D8%AC%D8%AF%D8%A9%20%20(2).jpg',
    label:   '🚗 مظلات السيارات — نفس الموقف قبل وبعد التركيب في جدة',
    labelEn: '🚗 Car Shades — Same parking lot before & after installation in Jeddah',
  },
  {
    beforeSrc: '/uploads/%D9%82%D8%A8%D9%84%20%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%20%D8%A7%D9%84%D8%B3%D8%A7%D8%AA%D8%B1.webp',
    afterSrc:  '/uploads/%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%20%D8%B3%D8%A7%D8%AA%D8%B1%20%D9%82%D9%85%D8%A7%D8%B4%20%D8%B3%D8%A7%D8%AA%D8%B1%20%D9%85%D8%AC%D8%AF%D9%88%D9%84%20%D8%AC%D8%AF%D8%A9%20%20(2).jpg',
    label:   '🏊 ساتر قماش مجدول — قبل وبعد التركيب',
    labelEn: '🏊 Braided Fabric Fence — Before & after installation',
  },
  {
    beforeSrc: '/uploads/%D9%82%D8%A8%D9%84%20%D8%AA%D8%B1%D9%83%D9%8A%D8%A8%20%D8%A7%D9%84%D8%A8%D8%B1%D8%AC%D9%88%D9%84%D8%A9.webp',
    afterSrc:  '/uploads/%D8%A8%D8%B1%D8%AC%D9%88%D9%84%D8%A7%D8%AA%20%D9%88%D8%AC%D9%84%D8%B3%D8%A7%D8%AA%20%D8%AE%D8%A7%D8%B1%D8%AC%D9%8A%D8%A9%20%20(5).jpg',
    label:   '🌿 برجولة وجلسة خارجية — تحول كامل للحديقة في جدة',
    labelEn: '🌿 Pergola & Outdoor Seating — Complete garden transformation in Jeddah',
  },
];

function SingleSlider({ pair, isRTL }: { pair: Pair; isRTL: boolean }) {
  const [pos, setPos] = useState(50);
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const computePos = useCallback(
    (clientX: number) => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const raw = (clientX - rect.left) / rect.width;
      setPos(Math.max(3, Math.min(97, raw * 100)));
    },
    []
  );

  const onMouseMove = (e: ReactMouseEvent) => {
    if (dragging) computePos(e.clientX);
  };
  const onTouchMove = (e: ReactTouchEvent) => {
    if (dragging) computePos(e.touches[0].clientX);
  };
  const stop = () => setDragging(false);

  useEffect(() => {
    window.addEventListener('mouseup', stop);
    window.addEventListener('touchend', stop);
    return () => {
      window.removeEventListener('mouseup', stop);
      window.removeEventListener('touchend', stop);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[16/8] md:aspect-[16/7] cursor-ew-resize select-none rounded-2xl overflow-hidden shadow-2xl border border-white/10"
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      onMouseDown={(e) => { setDragging(true); computePos(e.clientX); }}
      onTouchStart={(e) => { setDragging(true); computePos(e.touches[0].clientX); }}
    >
      {/* ─── AFTER (background) ─── */}
      <div className="absolute inset-0">
        <Image
          src={pair.afterSrc}
          alt="after"
          fill
          className="object-cover"
          sizes="(max-width: 1200px) 100vw, 1200px"
          priority
        />
        {/* After label */}
        <div className="absolute bottom-4 right-4 z-20 bg-green-500/90 backdrop-blur-sm text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
          ✅ {isRTL ? 'بعد ديار جدة' : 'After · Deyar'}
        </div>
      </div>

      {/* ─── BEFORE (clipped overlay) ─── */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pos}%` }}
      >
        <div className="absolute inset-0" style={{ width: ref.current?.offsetWidth ?? '100vw' }}>
          <Image
            src={pair.beforeSrc}
            alt="before"
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 1200px"
            priority
          />
          {/* Dark tint on before */}
          <div className="absolute inset-0 bg-gray-900/30" />
          {/* Before label */}
          <div className="absolute bottom-4 left-4 z-20 bg-red-500/90 backdrop-blur-sm text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
            ❌ {isRTL ? 'قبل ديار جدة' : 'Before · Deyar'}
          </div>
        </div>
      </div>

      {/* ─── DIVIDER LINE ─── */}
      <div
        className="absolute top-0 bottom-0 z-30 flex items-center justify-center"
        style={{ left: `calc(${pos}% - 22px)` }}
      >
        {/* Line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
        {/* Handle */}
        <div className="relative w-11 h-11 bg-white rounded-full shadow-2xl border-2 border-gray-200 flex items-center justify-center cursor-grab active:cursor-grabbing">
          <ChevronLeft className="w-3.5 h-3.5 text-gray-600 absolute -translate-x-1.5" />
          <ChevronRight className="w-3.5 h-3.5 text-gray-600 absolute translate-x-1.5" />
        </div>
      </div>

      {/* Hint overlay — fades after first drag */}
      {!dragging && pos === 50 && (
        <div className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 0.8] }}
            transition={{ duration: 2, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
            className="bg-black/60 backdrop-blur-md text-white text-sm font-bold px-5 py-2.5 rounded-full border border-white/20 flex items-center gap-2"
          >
            <span>←</span>
            <span>{isRTL ? 'اسحب لترى الفرق' : 'Drag to compare'}</span>
            <span>→</span>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default function BeforeAfterSlider() {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [active, setActive] = useState(0);

  const prev = () => setActive((a) => (a - 1 + pairs.length) % pairs.length);
  const next = () => setActive((a) => (a + 1) % pairs.length);

  return (
    <section
      className="py-24 bg-gray-950 overflow-hidden relative"
      dir={isRTL ? 'rtl' : 'ltr'}
      id="before-after"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-full mb-5">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="font-bold text-amber-400 text-sm">
              {isRTL ? 'سحر التحول — شاهد الفرق بنفسك' : 'The Magic Transformation — See it yourself'}
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            {isRTL ? (
              <>قبل وبعد <span className="text-amber-500">ديار جدة</span></>
            ) : (
              <>Before &amp; After <span className="text-amber-500">Deyar Jeddah</span></>
            )}
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {isRTL
              ? 'نحول المساحات العادية إلى تحف معمارية فاخرة — اسحب الخط لترى الفرق المذهل'
              : 'We turn ordinary spaces into luxury masterpieces — drag the line to see the stunning difference'}
          </p>
        </div>

        {/* Slider area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: isRTL ? -30 : 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isRTL ? 30 : -30 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          >
            <SingleSlider pair={pairs[active]} isRTL={isRTL} />
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        <div className="text-center mt-5">
          <p className="text-amber-400 font-semibold text-sm md:text-base">
            {isRTL ? pairs[active].label : pairs[active].labelEn}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prev}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-amber-500 hover:border-amber-500 text-white flex items-center justify-center transition-all duration-300 group"
            aria-label="Previous"
          >
            <ChevronRight className={`w-5 h-5 group-hover:scale-110 transition-transform ${isRTL ? '' : 'rotate-180'}`} />
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {pairs.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`rounded-full transition-all duration-300 ${i === active
                    ? 'w-8 h-2.5 bg-amber-500'
                    : 'w-2.5 h-2.5 bg-white/20 hover:bg-white/40'
                  }`}
                aria-label={`Pair ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-12 h-12 rounded-full bg-white/5 border border-white/10 hover:bg-amber-500 hover:border-amber-500 text-white flex items-center justify-center transition-all duration-300 group"
            aria-label="Next"
          >
            <ChevronLeft className={`w-5 h-5 group-hover:scale-110 transition-transform ${isRTL ? '' : 'rotate-180'}`} />
          </button>
        </div>
      </div>
    </section>
  );
}
