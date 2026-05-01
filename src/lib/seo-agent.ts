import ai, { GROQ_MODEL } from './groq-client';

async function callGroqWithJSON(systemPrompt: string, userPrompt: string): Promise<any> {
  const response = await ai.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0]?.message?.content || '{}';
  
  try {
    return JSON.parse(content);
  } catch (error) {
    console.warn('⚠️ GROQ returned malformed JSON. Attempting regex extraction...', error);
    // محاولة استخراج الـ JSON في حال قام الـ AI بإضافة نص قبله أو بعده
    const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch (e) {
        console.error('❌ Regex extraction failed:', e);
      }
    }
    throw new Error('فشل تحليل مخرجات الذكاء الاصطناعي (JSON Parsing Error)');
  }
}

async function callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await ai.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.7
  });

  return response.choices[0]?.message?.content || '';
}

export interface KeywordAnalysis {
  primary_keywords: string[];
  secondary_keywords: string[];
  long_tail_keywords: string[];
  keyword_density: { [key: string]: number };
  search_intent: string;
  difficulty_score: number;
  opportunity_score: number;
}

export interface ContentAnalysis {
  seo_score: number;
  readability_score: number;
  keyword_optimization: string;
  content_gaps: string[];
  suggestions: string[];
  meta_title_suggestion: string;
  meta_description_suggestion: string;
  h1_suggestions: string[];
  internal_linking_opportunities: string[];
}

export interface CompetitorInsight {
  top_keywords: string[];
  content_strategy: string;
  content_gaps: string[];
  backlink_opportunities: string[];
  improvement_areas: string[];
}

export class SEOAgent {
  async analyzeKeywords(content: string, targetKeywords: string[], language = 'ar'): Promise<KeywordAnalysis> {
    try {
      const prompt = `أنت خبير SEO استراتيجي ومهندس معماري متخصص في قطاع الحدادة والإنشاءات (مظلات، برجولات، سواتر) في السوق السعودي. 
      حلل المحتوى التالي لاستخراج أقوى الكلمات المفتاحية التي تضمن تصدر نتائج البحث في جدة والمملكة.

المحتوى: ${content}

الكلمات المفتاحية المستهدفة حالياً: ${targetKeywords.join(', ')}

قدم تحليلاً استراتيجياً بصيغة JSON يتضمن:
- primary_keywords: الكلمات الأساسية عالية الأهمية والتحويل (3-5 كلمات مثل "مظلات سيارات جدة"، "تركيب برجولات مودرن")
- secondary_keywords: كلمات LSI مرتبطة تقنياً (5-10 كلمات مثل "قماش PVC ألماني"، "خشب معالج"، "مظلات لكسان")
- long_tail_keywords: عبارات بحث طويلة تستهدف نية الشراء (5-10 عبارات مثل "أفضل شركة تركيب مظلات في حي الشاطئ جدة")
- keyword_density: كثافة كل كلمة رئيسية في المحتوى
- search_intent: نية البحث الدقيقة (هل المستخدم يبحث عن معلومة أم يريد الشراء فوراً؟)
- difficulty_score: درجة صعوبة المنافسة مع كبار السوق (1-100)
- opportunity_score: درجة الفرصة لاقتناص المركز الأول (1-100)

المتطلبات الاحترافية:
1. استهدف أحياء جدة الراقية (الشاطئ، الروضة، الحمراء، أبحر الشمالية، البساتين) بشكل ذكي.
2. استخدم مصطلحات هندسية وتقنية احترافية (سمك الحديد، نوع القماش، العزل الحراري، الضمان).
3. اجعل الكلمات المفتاحية تبدو كأنها مختارة بعناية من مستشار تسويق خبير.`;

      const result = await callGroqWithJSON(
        "أنت مستشار SEO وخبير هندسي متخصص في سوق الإنشاءات والمظلات السعودي. قدم استجابة JSON دقيقة واحترافية.",
        prompt
      );
      return result as KeywordAnalysis;
    } catch (error) {
      console.error('Error analyzing keywords:', error);
      throw new Error('فشل تحليل الكلمات المفتاحية');
    }
  }

  async analyzeContent(content: string, targetKeywords: string[], url?: string): Promise<ContentAnalysis> {
    try {
      const prompt = `أنت خبير SEO متقدم. حلل هذا المحتوى وقدم تقييماً شاملاً:

المحتوى: ${content}

الكلمات المفتاحية المستهدفة: ${targetKeywords.join(', ')}
${url ? `الرابط: ${url}` : ''}

قدم تحليلاً بصيغة JSON يشمل:
- seo_score: درجة SEO الإجمالية (1-100)
- readability_score: درجة سهولة القراءة (1-100)
- keyword_optimization: تقييم استخدام الكلمات المفتاحية
- content_gaps: الفجوات في المحتوى التي يجب تغطيتها
- suggestions: اقتراحات محددة للتحسين
- meta_title_suggestion: عنوان meta محسّن (50-60 حرف)
- meta_description_suggestion: وصف meta محسّن (150-160 حرف)
- h1_suggestions: اقتراحات لعناوين H1 جذابة
- internal_linking_opportunities: فرص للربط الداخلي

ركز على تقنيات SEO القوية والفعالة.`;

      const result = await callGroqWithJSON(
        "أنت خبير SEO استراتيجي متخصص في تحليل وتحسين المحتوى لمحركات البحث.",
        prompt
      );
      return result as ContentAnalysis;
    } catch (error) {
      console.error('Error analyzing content:', error);
      throw new Error('فشل تحليل المحتوى');
    }
  }

  async generateBilingualArticle(
    topic: string,
    keywords: string[]
  ): Promise<{
    ar: { title: string; excerpt: string; content: string; metaTitle: string; metaDescription: string; keywords: string[] };
    en: { title: string; excerpt: string; content: string; metaTitle: string; metaDescription: string; keywords: string[] };
    aiAnalysis: { score: number; recommendations: string[] };
  }> {
    try {
      const systemPrompt = `You are Abu Fahad, a legendary Saudi master craftsman and architect with 20+ years of hands-on experience in Jeddah's shade, pergola, and fence industry. You write like a passionate expert who genuinely cares about helping homeowners make the best decisions. Your writing feels HUMAN — warm, opinionated, detailed, and full of real-world wisdom.

      YOUR MISSION: Generate a COMPREHENSIVE, AUTHORITATIVE, LONG-FORM bilingual article (2000+ words PER LANGUAGE).

      ===== ABSOLUTE REQUIREMENTS =====

      1. OUTPUT FORMAT: Valid JSON only. No markdown, no code fences.
      
      2. BILINGUAL CONTENT — SEPARATE AND COMPLETE:
         - Arabic: Native, eloquent, culturally resonant Saudi dialect mixed with formal Arabic. Use colloquial expressions where natural (e.g., "والله", "ما شاء الله", "يا جماعة").
         - English: Professional, native-level architectural English. NOT a translation of Arabic — write independently for English-speaking audiences searching in English.
      
      3. LENGTH: 2000+ words for Arabic AND 2000+ words for English. Each language is a STANDALONE article.
      
      4. HUMAN EXPERT VOICE — THIS IS CRITICAL:
         - Write in FIRST PERSON as Abu Fahad sharing real experience
         - Include personal anecdotes: "In my 20 years, I've seen...", "One of our clients in Al-Rawdah..."
         - Share controversial opinions: "Many companies use cheap PVC — I refuse to..."
         - Add insider tips: "Here's something most contractors won't tell you..."
         - Express genuine passion: "This is what keeps me excited about this work..."
         - DO NOT sound like ChatGPT or a content mill. NO generic filler.
      
      5. MASSIVE KEYWORD TARGETING (20+ keywords per language):
         - Include 20-30 long-tail keywords per language naturally in the text
         - Arabic keywords: Include price-related terms (أسعار, تكلفة, عرض سعر), material terms (PVC, بولي إيثيلين, حديد مجلفن, خشب معالج, لكسان), location terms (جدة, مكة, الطائف), service terms (تركيب, صيانة, تصميم, ضمان)
         - English keywords: Include "best [service] in Jeddah", "[service] prices Saudi Arabia", "[service] installation cost", "weather resistant [material]", "10 year warranty", "professional [service] company"
         - MUST list all targeted keywords in the "keywords" array (minimum 20 per language)
      
      6. JEDDAH LOCAL SEO — MENTION 10+ NEIGHBORHOODS:
         Arabic: الشاطئ، الروضة، البساتين، أبحر الشمالية، أبحر الجنوبية، النزهة، الفيصلية، الحمراء، الزهراء، السلامة، المحمدية، الصفا، المروة، الخالدية، النسيم، الرحاب، المرجان، الأندلس، الريان، درة العروس
         English: Al-Shatie, Al-Rawdah, Al-Basateen, Obhur North, Obhur South, Al-Nuzha, Al-Faisaliyah, Al-Hamra, Al-Zahra, Al-Salamah, Al-Muhammadiyah, Al-Safa, Al-Marwah, Al-Khalidiyah, Al-Naseem, Durrat Al-Arous
      
      7. SMART INTERNAL LINKING — MANDATORY:
         Arabic content MUST include these links naturally:
         - <a href="/services/mazallat">مظلات السيارات</a>
         - <a href="/services/pergolas">برجولات</a>
         - <a href="/services/sawater">سواتر</a>
         - <a href="/services/sandwich-panel">ساندوتش بانل</a>
         - <a href="/services/landscaping">تنسيق حدائق</a>
         - <a href="/services/byoot-shaar">بيوت شعر</a>
         - <a href="/services/khayyam">خيام ملكية</a>
         - <a href="/portfolio">معرض أعمالنا</a>
         - <a href="/quote">اطلب عرض سعر مجاني</a>
         English content MUST use /en/ prefix:
         - <a href="/en/services/mazallat">car shades</a>
         - <a href="/en/services/pergolas">pergolas</a>
         - <a href="/en/services/sawater">privacy fences</a>
         - <a href="/en/portfolio">our portfolio</a>
         - <a href="/en/quote">request a free quote</a>

      8. RICH HTML STRUCTURE — HIERARCHICAL AND PROFESSIONAL:
         - <h2> for main sections (5-7 sections minimum)
         - <h3> for sub-sections (2-3 per main section)
         - <blockquote> for expert tips, client testimonials, or important warnings
         - <ul>/<li> for materials, benefits, steps, comparisons
         - <strong> for emphasis on key terms
         - <table> for price comparisons or material specifications where relevant
         - MUST end with a powerful "Conclusion & Call to Action" section
         - MUST include a "Frequently Asked Questions" section with 5+ Q&A pairs using <h3> for questions

      9. TECHNICAL DEPTH — INCLUDE:
         - Specific material specifications (thickness, grade, UV resistance rating)
         - Jeddah climate challenges (humidity 60-80%, temperatures 35-48°C, salt air corrosion)
         - Installation process steps
         - Maintenance schedules and tips
         - Price ranges (approximate, in SAR)
         - Warranty details
         - Comparison tables between material types

      JSON STRUCTURE:
      {
        "ar": {
          "title": "عنوان عربي جذاب وطويل يحتوي كلمات مفتاحية (60-80 حرف)",
          "excerpt": "ملخص عربي شامل (200-300 كلمة)",
          "content": "محتوى HTML عربي تفصيلي (2000+ كلمة) باستخدام h2, h3, p, ul, li, strong, blockquote, a, table",
          "metaTitle": "عنوان SEO عربي (50-60 حرف)",
          "metaDescription": "وصف SEO عربي (150-160 حرف)",
          "keywords": ["20+ كلمة مفتاحية عربية"]
        },
        "en": {
          "title": "Engaging English Title with Keywords (60-80 chars)",
          "excerpt": "Comprehensive English summary (200-300 words)",
          "content": "Detailed HTML English content (2000+ words) using h2, h3, p, ul, li, strong, blockquote, a, table",
          "metaTitle": "SEO Title English (50-60 chars)",
          "metaDescription": "SEO Description English (150-160 chars)",
          "keywords": ["20+ English keywords"]
        },
        "aiAnalysis": {
          "score": 0-100,
          "recommendations": ["rec1", "rec2", "rec3"]
        }
      }`;

      const userPrompt = `Generate a comprehensive, expert-level bilingual article about: "${topic}".
      
      Primary Keywords to naturally weave in: ${keywords.join(', ')}.
      
      IMPORTANT REMINDERS:
      - Write as Abu Fahad, a real human expert — NOT as an AI
      - Each language must be 2000+ words with 20+ targeted keywords
      - Include 10+ Jeddah neighborhood mentions for local SEO
      - Embed internal HTML links to our services pages
      - Include a FAQ section with 5+ questions at the end
      - Include specific prices, materials, and technical specifications
      - Make the reader feel they are getting advice from a trusted friend and expert`;


      const result = await callGroqWithJSON(systemPrompt, userPrompt);
      return result as any;
    } catch (error) {
      console.error('Error generating bilingual article:', error);
      throw new Error('فشل توليد المقال ثنائي اللغة');
    }
  }

  async generateOptimizedContent(
    topic: string,
    keywords: string[],
    contentType: 'article' | 'project_description' | 'service_page',
    wordCount = 800
  ): Promise<{ title: string; content: string; meta_description: string; tags: string[] }> {
    try {
      const contentTypeAr = {
        article: 'مقال',
        project_description: 'وصف مشروع',
        service_page: 'صفحة خدمة'
      };

      const prompt = `أنت كاتب محتوى SEO محترف متخصص في قطاع البناء والإنشاءات في السعودية.

اكتب ${contentTypeAr[contentType]} محسّن للـ SEO عن: ${topic}

الكلمات المفتاحية: ${keywords.join(', ')}
عدد الكلمات المطلوب: ${wordCount}

المتطلبات:
1. المحتوى يجب أن يكون أصلي 100% وليس منسوخاً
2. استخدم الكلمات المفتاحية بشكل طبيعي (كثافة 1-2%)
3. اجعل المحتوى غني بالمعلومات وقيم للقارئ
4. استخدم عناوين فرعية واضحة (H2, H3)
5. أضف قوائم نقطية حيثما كان مناسباً
6. اكتب بأسلوب احترافي يناسب السوق السعودي
7. ضمّن دعوة للعمل (CTA) في النهاية

قدم النتيجة بصيغة JSON تحتوي على:
- title: عنوان جذاب محسّن للSEO (50-60 حرف)
- content: المحتوى الكامل بتنسيق HTML
- meta_description: وصف meta محسّن (150-160 حرف)
- tags: 5-8 وسوم ذات صلة`;

      const result = await callGroqWithJSON(
        "أنت كاتب محتوى SEO خبير تنشئ محتوى عالي الجودة محسّن لمحركات البحث.",
        prompt
      );
      return result;
    } catch (error) {
      console.error('Error generating content:', error);
      throw new Error('فشل توليد المحتوى');
    }
  }

  async analyzeCompetitor(competitorUrl: string, industry: string): Promise<CompetitorInsight> {
    try {
      const prompt = `أنت محلل SEO تنافسي محترف. حلل استراتيجية المنافس التالي:

رابط المنافس: ${competitorUrl}
المجال: ${industry}

بناءً على خبرتك في السوق، قدم تحليلاً استراتيجياً بصيغة JSON يتضمن:
- top_keywords: الكلمات المفتاحية التي من المحتمل أن يستهدفها (10-15 كلمة)
- content_strategy: وصف استراتيجية المحتوى المحتملة
- content_gaps: الفجوات في محتوى المنافس يمكن استغلالها
- backlink_opportunities: فرص الحصول على روابط خلفية
- improvement_areas: مجالات يمكن التفوق فيها

ركز على الاستراتيجيات القوية والفعالة للتفوق على المنافسين.`;

      const result = await callGroqWithJSON(
        "أنت خبير تحليل تنافسي في SEO متخصص في إيجاد الفرص الاستراتيجية.",
        prompt
      );
      return result as CompetitorInsight;
    } catch (error) {
      console.error('Error analyzing competitor:', error);
      throw new Error('فشل تحليل المنافس');
    }
  }

  async suggestInternalLinks(content: string, availablePages: { title: string; url: string; keywords: string[] }[]): Promise<{ suggestions: { anchor_text: string; target_url: string; position: string; relevance_score: number }[] }> {
    try {
      const prompt = `أنت خبير في بناء بنية الربط الداخلي. حلل المحتوى التالي واقترح روابط داخلية مناسبة:

المحتوى: ${content}

الصفحات المتاحة للربط:
${availablePages.map(p => `- ${p.title} (${p.url}): ${p.keywords.join(', ')}`).join('\n')}

قدم اقتراحات بصيغة JSON تحتوي على:
- suggestions: قائمة باقتراحات الروابط، كل اقتراح يحتوي على:
  * anchor_text: نص الرابط المقترح
  * target_url: الرابط الهدف
  * position: موقع الإدراج المقترح في المحتوى
  * relevance_score: درجة الملاءمة (1-100)

اختر 3-5 روابط داخلية ذات صلة قوية فقط. تأكد من أن نص الرابط (anchor text) طبيعي ومناسب.`;

      const result = await callGroqWithJSON(
        "أنت خبير في استراتيجيات الربط الداخلي لتحسين SEO.",
        prompt
      );
      return result;
    } catch (error) {
      console.error('Error suggesting internal links:', error);
      throw new Error('فشل اقتراح الروابط الداخلية');
    }
  }

  async generateMetaTags(content: string, keywords: string[], pageType: string): Promise<{
    title: string;
    description: string;
    og_title: string;
    og_description: string;
    twitter_title: string;
    twitter_description: string;
  }> {
    try {
      const prompt = `أنت مستشار تسويق رقمي خبير. قم بإنشاء Meta Tags احترافية تجذب النقرات وتتصدر النتائج.

نوع الصفحة: ${pageType}
المحتوى: ${content.substring(0, 700)}...
الكلمات المفتاحية: ${keywords.join(', ')}

المتطلبات الاحترافية:
1. Title: يجب أن يكون مغناطيسياً للنقرات (Click-Magnet) مع دمج الكلمة المفتاحية في البداية.
2. Description: يجب أن يتضمن ميزة تنافسية (مثلاً: ضمان 10 سنوات، توريد وتركيب سريع، خامات ألمانية).
3. نبرة فخمة وموثوقة تعكس ريادة "ديار جدة العالمية".

قدم النتيجة بصيغة JSON:
- title: عنوان الصفحة (50-60 حرف) - مثال: "مظلات سيارات بجدة | ضمان 10 سنوات وتركيب احترافي"
- description: وصف الصفحة (150-160 حرف) - يجب أن ينتهي بدعوة للعمل (CTA) مثل "اتصل الآن" أو "احصل على عرض سعر".
- og_title: عنوان جذاب لوسائل التواصل الاجتماعي.
- og_description: وصف مشوق للمشاركة.
- twitter_title: عنوان تويتر.
- twitter_description: وصف تويتر.`;

      const result = await callGroqWithJSON(
        "أنت خبير في كتابة الإعلانات (Copywriter) وSEO متخصص في زيادة نسبة النقر (CTR).",
        prompt
      );
      return result;
    } catch (error) {
      console.error('Error generating meta tags:', error);
      throw new Error('فشل توليد meta tags');
    }
  }

  /**
   * ترجمة المشروع بالكامل إلى الإنجليزية بطريقة احترافية
   */
  async translateProject(projectData: {
    title: string;
    description: string;
    category: string;
    location: string;
    tags: string[];
    materials: string[];
    client?: string;
  }): Promise<any> {
    try {
      const prompt = `You are a Senior Architectural Translator and SEO Specialist. 
      Your task is to translate this project into High-End, Professional English for the International/Expat market in Saudi Arabia.

      PROJECT DATA (ARABIC):
      - Title: ${projectData.title}
      - Description: ${projectData.description}
      - Category: ${projectData.category}
      - Location: ${projectData.location}
      - Tags: ${projectData.tags.join(', ')}
      - Materials: ${projectData.materials.join(', ')}
      - Client: ${projectData.client || 'Private Client'}

      REQUIREMENTS:
      1. Output MUST be in VALID JSON.
      2. Title: Professional, descriptive, and SEO-friendly.
      3. Description: Expand the description into a professional architectural narrative (300+ words). Describe the design, the materials used, and the benefit to the client (heat reduction, aesthetic value, durability).
      4. Keywords: Translate tags into industry-standard English construction terms.
      5. Tone: Luxury, Professional, and Authoritative.
      6. SEO: Include an English Meta Title and Meta Description.

      JSON STRUCTURE:
      {
        "enMetadata": {
          "title": "English Project Title",
          "description": "Professional English description (300+ words)",
          "metaTitle": "SEO English Title (50-60 chars)",
          "metaDescription": "SEO English Description (150-160 chars)",
          "tags": ["English Tag 1", "English Tag 2"],
          "materials": ["English Material 1", "English Material 2"],
          "location": "English Location Name",
          "client": "English Client Name"
        }
      }`;

      const result = await callGroqWithJSON(
        "You are an expert bilingual architectural consultant specializing in luxury construction projects.",
        prompt
      );
      return result;
    } catch (error) {
      console.error('Error in translateProject:', error);
      return null;
    }
  }

  async clusterKeywords(keywords: string[]): Promise<{
    clusters: {
      cluster_name: string;
      keywords: string[];
      search_intent: string;
      priority_score: number;
      content_ideas: string[];
    }[];
  }> {
    try {
      const prompt = `أنت خبير في تجميع الكلمات المفتاحية (Keyword Clustering). قم بتحليل وتجميع الكلمات التالية:

الكلمات المفتاحية: ${keywords.join(', ')}

قم بتجميعها إلى مجموعات منطقية بصيغة JSON:
- clusters: قائمة بالمجموعات، كل مجموعة تحتوي على:
  * cluster_name: اسم المجموعة
  * keywords: الكلمات المفتاحية في هذه المجموعة
  * search_intent: نية البحث للمجموعة
  * priority_score: درجة الأولوية (1-100)
  * content_ideas: 3-5 أفكار محتوى لهذه المجموعة

جمّع الكلمات المتشابهة في المعنى والنية معاً.`;

      const result = await callGroqWithJSON(
        "أنت خبير في تجميع وتنظيم الكلمات المفتاحية لإنشاء استراتيجية محتوى فعالة.",
        prompt
      );
      return result;
    } catch (error) {
      console.error('Error clustering keywords:', error);
      throw new Error('فشل تجميع الكلمات المفتاحية');
    }
  }

  async generateImageAltText(title: string, content: string, imageUrl: string): Promise<string> {
    try {
      const prompt = `أنت خبير في كتابة نصوص بديلة للصور (Alt Text) محسّنة للـ SEO.

العنوان: ${title}
المحتوى: ${content.substring(0, 300)}
رابط الصورة: ${imageUrl}

اكتب نص بديل (Alt Text) محسّن للصورة يكون:
1. وصفي ودقيق (30-100 حرف)
2. يحتوي على كلمات مفتاحية ذات صلة
3. طبيعي وسلس للقراءة
4. يفيد محركات البحث والمستخدمين ذوي الاحتياجات الخاصة

قدم فقط نص الـ Alt Text بدون أي شرح إضافي.`;

      const altText = await callGroq(
        "أنت خبير في كتابة نصوص بديلة للصور محسّنة لمحركات البحث وإمكانية الوصول.",
        prompt
      );

      return altText.trim().replace(/^["']|["']$/g, '') || `صورة ${title}`;
    } catch (error) {
      console.error('Error generating image alt text:', error);
      return `صورة ${title}`;
    }
  }
}

export const seoAgent = new SEOAgent();
