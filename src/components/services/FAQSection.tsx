'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, Sparkles } from 'lucide-react';

interface FAQ {
  id: string | number;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  categoryName: string;
}

export default function FAQSection({ faqs, categoryName }: FAQSectionProps) {
  const [openId, setOpenId] = useState<string | number | null>(faqs.length > 0 ? faqs[0].id : null);

  if (faqs.length === 0) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <HelpCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">
              لا توجد أسئلة شائعة حالياً
            </h3>
            <p className="text-gray-500">
              سنقوم بإضافة أسئلة شائعة عن {categoryName} قريباً
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-600 px-4 py-2 rounded-full mb-4">
            <HelpCircle className="w-4 h-4" />
            <span className="text-sm font-bold">أسئلة ديناميكية</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
            الأسئلة الشائعة
          </h2>
          <p className="text-lg text-muted-foreground">
            إجابات على أكثر الأسئلة شيوعاً حول {categoryName}
          </p>
          <div className="inline-flex items-center gap-2 mt-4 text-sm text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-medium">{faqs.length} سؤال من قاعدة البيانات</span>
          </div>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id;
            
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="bg-white rounded-2xl border-2 border-gray-100 overflow-hidden hover:border-accent transition-all duration-300 shadow-sm hover:shadow-xl">
                  <button
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-6 text-right hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-bold text-primary pr-4 flex-1">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      {isOpen ? (
                        <Minus className="w-6 h-6 text-accent" />
                      ) : (
                        <Plus className="w-6 h-6 text-accent" />
                      )}
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-2">
                          <div className="border-t-2 border-gray-100 pt-4">
                            <p className="text-muted-foreground leading-relaxed pr-4">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <a
            href={`/faq?search=${categoryName}`}
            className="inline-flex items-center gap-3 bg-accent text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent/90 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
          >
            <HelpCircle className="w-5 h-5" />
            عرض جميع الأسئلة عن {categoryName}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center bg-gradient-to-r from-accent/10 to-primary/10 rounded-2xl p-8"
        >
          <HelpCircle className="w-12 h-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-bold text-primary mb-2">
            لديك سؤال آخر؟
          </h3>
          <p className="text-muted-foreground mb-6">
            تواصل معنا وسنكون سعداء بالإجابة على استفساراتك
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="tel:+966553719009"
              className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-bold hover:bg-accent/90 transition-colors shadow-lg hover:shadow-xl"
            >
              اتصل بنا
            </a>
            <a
              href="https://wa.me/+966553719009"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg hover:shadow-xl"
            >
              واتساب
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
