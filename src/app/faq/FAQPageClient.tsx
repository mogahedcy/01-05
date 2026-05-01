'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter,
  HelpCircle,
  ChevronDown,
  MessageCircle,
  Phone,
  Loader2,
  BookOpen,
  Sparkles,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Check,
  Copy
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  featured: boolean;
  views: number;
  slug?: string | null;
  helpfulness: number;
  createdAt: Date;
}

interface FAQPageClientProps {
  initialFAQs: FAQ[];
}

const categories = [
  { value: 'all', label: 'جميع الأسئلة', icon: '❓' },
  { value: 'مظلات سيارات', label: 'مظلات سيارات', icon: '🚗' },
  { value: 'سواتر', label: 'سواتر', icon: '🛡️' },
  { value: 'خيم ملكية', label: 'خيم ملكية', icon: '⛺' },
  { value: 'بيوت شعر ملكي', label: 'بيوت شعر ملكي', icon: '🏕️' },
  { value: 'برجولات', label: 'برجولات', icon: '🌿' },
  { value: 'تنسيق حدائق', label: 'تنسيق حدائق', icon: '🌺' },
  { value: 'هناجر', label: 'هناجر', icon: '🏢' },
  { value: 'شبوك', label: 'شبوك', icon: '🔲' },
  { value: 'قراميد', label: 'قراميد', icon: '🏛️' },
  { value: 'ساندوتش بانل', label: 'ساندوتش بانل', icon: '📦' }
];

export default function FAQPageClient({ initialFAQs }: FAQPageClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const [faqs, setFaqs] = useState<FAQ[]>(initialFAQs);
  const [baseFaqs, setBaseFaqs] = useState<FAQ[]>(initialFAQs);
  const [loading, setLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, 'yes' | 'no' | null>>({});

  const pendingScrollIdRef = useRef<string | null>(null);
  const hasHandledDeepLinkRef = useRef(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  const clearDeepLink = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
      scrollTimeoutRef.current = null;
    }
    pendingScrollIdRef.current = null;
    hasHandledDeepLinkRef.current = true;
  }, []);

  useEffect(() => {
    const search = searchParams?.get('search') || '';
    const category = searchParams?.get('category') || 'all';
    setSearchTerm(search);
    setSelectedCategory(category);
  }, [searchParams]);

  useEffect(() => {
    const idParam = searchParams?.get('id');
    pendingScrollIdRef.current = idParam;
    hasHandledDeepLinkRef.current = !idParam;
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [searchParams]);

  useEffect(() => {
    if (
      !pendingScrollIdRef.current ||
      hasHandledDeepLinkRef.current ||
      faqs.length === 0
    ) {
      return;
    }

    const targetId = pendingScrollIdRef.current;
    const element = document.getElementById(`question-${targetId}`);
    if (!element) {
      return;
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = window.setTimeout(() => {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setExpandedFAQ(targetId);
      hasHandledDeepLinkRef.current = true;
      scrollTimeoutRef.current = null;
    }, 300);

    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = null;
      }
    };
  }, [faqs]);

  const updateURL = useCallback((search: string, category: string) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category && category !== 'all') params.set('category', category);
    const newURL = params.toString() ? `${pathname}?${params}` : pathname;
    router.replace(newURL, { scroll: false });
  }, [pathname, router]);

  const fetchFAQs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        limit: '100',
        status: 'PUBLISHED',
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await fetch(`/api/faqs?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setFaqs(data.faqs || []);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    if (searchTerm || selectedCategory !== 'all') {
      fetchFAQs();
    }
  }, [searchTerm, selectedCategory, fetchFAQs]);

  const displayFAQs = searchTerm || selectedCategory !== 'all' ? faqs : baseFaqs;
  
  const filteredFAQs = displayFAQs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = !searchTerm || 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  const copyLink = async (faq: FAQ) => {
    const link = faq.slug 
      ? `${window.location.origin}/faq/${faq.slug}`
      : `${window.location.origin}/faq?id=${faq.id}`;
    
    try {
      await navigator.clipboard.writeText(link);
      setCopiedId(faq.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      console.error('Failed to copy link:', error);
    }
  };

  const handleHelpful = async (faqId: string, helpful: boolean) => {
    const voteKey = `faq_vote_${faqId}`;
    const existingVote = localStorage.getItem(voteKey);
    
    if (existingVote) {
      return;
    }

    try {
      const response = await fetch('/api/faqs/track-helpfulness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faqId, helpful })
      });

      if (response.ok) {
        const data = await response.json();
        setHelpfulVotes(prev => ({ ...prev, [faqId]: helpful ? 'yes' : 'no' }));
        localStorage.setItem(voteKey, helpful ? 'yes' : 'no');
        
        const updateFn = (prevFaqs: FAQ[]) => prevFaqs.map(faq => 
          faq.id === faqId 
            ? { ...faq, helpfulness: data.helpfulness }
            : faq
        );
        
        setFaqs(updateFn);
        setBaseFaqs(updateFn);
      }
    } catch (error) {
      console.error('Error tracking helpfulness:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
              <HelpCircle className="w-4 h-4" />
              <span className="text-sm font-bold">مركز المساعدة</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
              الأسئلة الشائعة
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              إجابات شاملة على أكثر الأسئلة شيوعاً حول خدماتنا
            </p>
            <div className="inline-flex items-center gap-2 mt-4 text-sm text-accent">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="font-medium">{faqs.length} سؤال وجواب</span>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث في الأسئلة..."
                value={searchTerm}
                onChange={(e) => {
                  clearDeepLink();
                  const newSearch = e.target.value;
                  setSearchTerm(newSearch);
                  updateURL(newSearch, selectedCategory);
                }}
                className="pr-12 h-14 text-lg rounded-xl border-2"
              />
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => {
                    clearDeepLink();
                    setSelectedCategory(cat.value);
                    updateURL(searchTerm, cat.value);
                  }}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    selectedCategory === cat.value
                      ? 'bg-accent text-white shadow-lg scale-105'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs List */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-accent animate-spin" />
            </div>
          ) : filteredFAQs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-600 mb-2">
                لا توجد أسئلة
              </h3>
              <p className="text-gray-500 mb-6">
                جرّب البحث بكلمات أخرى أو تصفح فئة مختلفة
              </p>
              <Button onClick={() => {
                clearDeepLink();
                setSearchTerm(''); 
                setSelectedCategory('all');
                updateURL('', 'all');
              }}>
                إعادة تعيين البحث
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredFAQs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    id={`question-${faq.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white rounded-2xl border-2 overflow-hidden hover:shadow-xl transition-all duration-300 ${
                      expandedFAQ === faq.id ? 'border-accent shadow-lg' : 'border-gray-100'
                    }`}
                  >
                    <button
                      onClick={() => toggleFAQ(faq.id)}
                      className="w-full p-6 text-right flex items-start justify-between gap-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {faq.featured && (
                            <span className="inline-flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-bold">
                              <Sparkles className="w-3 h-3" />
                              شائع
                            </span>
                          )}
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-primary text-right">
                          {faq.question}
                        </h3>
                      </div>
                      <motion.div
                        animate={{ rotate: expandedFAQ === faq.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-6 h-6 text-accent flex-shrink-0" />
                      </motion.div>
                    </button>

                    <AnimatePresence>
                      {expandedFAQ === faq.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="px-6 pb-6 pt-2 border-t border-gray-100 space-y-4">
                            <div className="bg-gradient-to-br from-accent/5 to-primary/5 rounded-xl p-5">
                              <p className="text-gray-700 leading-relaxed text-right whitespace-pre-line">
                                {faq.answer}
                              </p>
                            </div>

                            <div className="flex items-center justify-between flex-wrap gap-4 pt-3">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => copyLink(faq)}
                                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium text-gray-700"
                                >
                                  {copiedId === faq.id ? (
                                    <>
                                      <Check className="w-4 h-4 text-green-600" />
                                      <span className="text-green-600">تم النسخ!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-4 h-4" />
                                      <span>نسخ الرابط</span>
                                    </>
                                  )}
                                </button>

                                <div className="flex items-center gap-2">
                                  {faq.views > 0 && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-lg">
                                      {faq.views} مشاهدة
                                    </span>
                                  )}
                                  {faq.helpfulness > 0 && (
                                    <span className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg font-medium">
                                      {faq.helpfulness}% مفيدة
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 mr-2">هل كانت الإجابة مفيدة؟</span>
                                <button
                                  onClick={() => handleHelpful(faq.id, true)}
                                  disabled={!!helpfulVotes[faq.id]}
                                  className={`p-2 rounded-lg transition-all ${
                                    helpfulVotes[faq.id] === 'yes'
                                      ? 'bg-green-100 text-green-600'
                                      : 'bg-gray-100 hover:bg-green-50 text-gray-600 hover:text-green-600'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  <ThumbsUp className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleHelpful(faq.id, false)}
                                  disabled={!!helpfulVotes[faq.id]}
                                  className={`p-2 rounded-lg transition-all ${
                                    helpfulVotes[faq.id] === 'no'
                                      ? 'bg-red-100 text-red-600'
                                      : 'bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-600'
                                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                  <ThumbsDown className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-primary mb-4">
            لم تجد إجابة لسؤالك؟
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            فريقنا جاهز للإجابة على جميع استفساراتكم
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="https://wa.me/+966553719009" target="_blank">
              <Button size="lg" className="text-lg px-8">
                <MessageCircle className="w-5 h-5 mr-2" />
                تواصل معنا عبر واتساب
              </Button>
            </Link>
            <Link href="tel:+966553719009">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Phone className="w-5 h-5 mr-2" />
                اتصل بنا
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
