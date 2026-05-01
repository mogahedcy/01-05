import ai, { GROQ_MODEL } from './groq-client';

interface TranslationInput {
  title: string;
  description: string;
  category?: string;
  location?: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  tags?: string[];
  materials?: string[];
}

interface TranslationOutput {
  title: string;
  description: string;
  category?: string;
  location?: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tags?: string[];
  materials?: string[];
  seoOptimized: {
    richSnippet: {
      headline: string;
      summary: string;
    };
    imageAltTexts: string[];
    videoDescriptions: string[];
  };
}

/**
 * ترجمة محتوى المشروع من العربية إلى الإنجليزية مع تحسين SEO
 * Translate project content from Arabic to English with SEO optimization
 */
export async function translateProjectToEnglish(
  input: TranslationInput,
  imageCount: number = 0,
  videoCount: number = 0
): Promise<TranslationOutput> {
  try {
    const prompt = `You are a High-End Architectural Copywriter & SEO Specialist specializing in the luxury Saudi Arabian construction market.
Your task is to translate this project from Arabic to Professional, Narrative-style English.

**Arabic Project Details:**
- Title: ${input.title}
- Description: ${input.description}
- Category: ${input.category || 'Construction/Architectural'}
- Location: ${input.location || 'Jeddah, Saudi Arabia'}
- Tags: ${input.tags && input.tags.length > 0 ? input.tags.join(', ') : 'N/A'}
- Materials: ${input.materials && input.materials.length > 0 ? input.materials.join(', ') : 'N/A'}

**Requirements for Professional Output:**
1. **Professional Title**: Create a catchy, authoritative English title (max 60 chars).
2. **Narrative Description**: Expand the description into a professional narrative (300-500 words). Discuss the structural integrity, aesthetic appeal, and functional benefits (e.g., heat insulation, durability against Jeddah's humidity, modern design). Use terms like "state-of-the-art," "premium craftsmanship," "architectural excellence."
3. **Advanced Local SEO**: Naturally integrate Jeddah's upscale neighborhoods (Al-Shatie, Al-Rawdah, Al-Basateen, Obhur Al-Shamaliyah, Al-Hamra, Al-Salamah) to boost local search rankings and Google Maps visibility.
4. **Metadata**: Create a compelling Meta Title and Meta Description that encourages high click-through rates.
5. **Keywords**: Generate 10-15 strategic English keywords including long-tail variations (e.g., "luxury car shades Jeddah," "modern pergolas Saudi Arabia").
6. **Geo-Identifiers**: Every image alt text must include a specific neighborhood or landmark context in Jeddah.
7. **Strict JSON Constraint**: Under NO CIRCUMSTANCES should you output conversational text before or after the JSON.

**JSON STRUCTURE (Return ONLY this JSON, nothing else):**
{
  "title": "translated title",
  "description": "Professional English description (300+ words)",
  "category": "translated category",
  "location": "translated location",
  "metaTitle": "SEO meta title (50-60 chars)",
  "metaDescription": "SEO meta description (150-160 chars)",
  "keywords": ["keyword1", "keyword2", ...],
  "tags": ["English Tag 1", "English Tag 2", ...],
  "materials": ["English Material 1", "English Material 2", ...],
  "enMetadata": {
    "title": "the translated title",
    "description": "the long description",
    "metaTitle": "SEO title",
    "metaDescription": "SEO description",
    "tags": ["Tag 1", "Tag 2"],
    "materials": ["Mat 1", "Mat 2"],
    "location": "Jeddah, Saudi Arabia",
    "client": "Private Client"
  },
  "seoOptimized": {
    "richSnippet": {
      "headline": "compelling headline",
      "summary": "engaging summary"
    },
    "imageAltTexts": ["alt text 1", "alt text 2", ...],
    "videoDescriptions": ["video description 1", ...]
  }
}`;

    const completion = await ai.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a professional SEO and translation expert. Always respond with valid JSON only, no markdown formatting, no code blocks."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for consistent, professional translation
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    
    // Parse the JSON response
    let translation: TranslationOutput;
    try {
      translation = JSON.parse(responseText);
    } catch (parseError) {
      console.warn('⚠️ JSON parse failed. Attempting regex cleanup...', parseError);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          translation = JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('❌ Regex JSON extraction failed:', e);
          translation = createFallbackTranslation(input);
        }
      } else {
        console.error('❌ خطأ في تحليل استجابة الترجمة. لا يوجد كائن JSON.');
        translation = createFallbackTranslation(input);
      }
    }

    // Validate and ensure all required fields exist
    if (!translation.title || !translation.description) {
      console.warn('⚠️ الترجمة غير مكتملة، استخدام الترجمة الاحتياطية');
      translation = {
        ...createFallbackTranslation(input),
        ...translation
      };
    }

    console.log('✅ تمت الترجمة بنجاح:', translation.title);
    return translation;

  } catch (error) {
    console.error('❌ خطأ في ترجمة المشروع:', error);
    // Return fallback translation
    return createFallbackTranslation(input);
  }
}

/**
 * ترجمة المقال من العربية إلى الإنجليزية
 */
export async function translateArticleToEnglish(input: {
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  tags?: string[];
  keywords?: string;
}): Promise<any> {
  try {
    const prompt = `You are a professional bilingual SEO content writer.

Translate the following Arabic article to professional English, optimizing for SEO.

**Arabic Content:**
- Title: ${input.title}
- Category: ${input.category}
- Excerpt: ${input.excerpt || input.content.substring(0, 150)}
- Tags: ${input.tags?.join(', ') || ''}
- Content:
${input.content.substring(0, 3000)} ${input.content.length > 3000 ? '...' : ''}

**Requirements:**
1. Translate the title and content to high-quality, engaging English.
2. Ensure the translated content is formatted in HTML (using <p>, <h2>, <ul>, etc.).
3. Generate an SEO-optimized meta description (150-160 chars).
4. Generate 5-10 SEO keywords in English.

**Output as JSON only:**
{
  "title": "translated title",
  "content": "translated HTML content",
  "excerpt": "short english excerpt",
  "category": "translated category",
  "metaDescription": "SEO optimized meta description",
  "keywords": ["keyword1", "keyword2"]
}`;

    const completion = await ai.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: "You are a professional SEO translator. Return valid JSON only." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content || '{}';
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (e) {
          console.error('Regex parse error:', e);
        }
      }
      return null;
    }
  } catch (error) {
    console.error('❌ خطأ في ترجمة المقال:', error);
    return null;
  }
}

/**
 * إنشاء ترجمة احتياطية بسيطة في حالة فشل AI
 */
function createFallbackTranslation(input: TranslationInput): TranslationOutput {
  const titleEn = `Project: ${input.title}`;
  const categoryEn = input.category || 'Construction Project';
  const locationEn = input.location?.includes('جدة') ? 'Jeddah' : (input.location || 'Saudi Arabia');

  return {
    title: titleEn,
    description: `${categoryEn} project in ${locationEn}. ${input.description.substring(0, 100)}...`,
    category: categoryEn,
    location: locationEn,
    metaTitle: `${titleEn.substring(0, 40)} | Aldeyar Global`,
    metaDescription: `Professional ${categoryEn.toLowerCase()} in ${locationEn}. High-quality construction services by Aldeyar Global Professionals.`,
    keywords: [
      categoryEn.toLowerCase(),
      locationEn.toLowerCase(),
      'jeddah',
      'saudi arabia',
      'construction',
      'professional services',
      'aldeyar global'
    ],
    tags: input.tags || [],
    materials: input.materials || [],
    seoOptimized: {
      richSnippet: {
        headline: `Professional ${categoryEn} in ${locationEn}`,
        summary: `High-quality ${categoryEn.toLowerCase()} project completed in ${locationEn} by Aldeyar Global Professionals.`
      },
      imageAltTexts: [`${categoryEn} in ${locationEn} - Image`],
      videoDescriptions: [`${categoryEn} project video in ${locationEn}`]
    }
  };
}

/**
 * ترجمة مجموعة من النصوص القصيرة (للعناوين، الوسوم، إلخ)
 */
export async function translateBatch(texts: string[]): Promise<string[]> {
  try {
    const prompt = `Translate the following Arabic texts to professional English. Return as JSON array.

Arabic texts: ${JSON.stringify(texts)}

Return only a JSON array of translated strings, no markdown, no explanation.`;

    const completion = await ai.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a professional translator. Always respond with valid JSON array only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 500,
      response_format: { type: "json_object" }
    });

    const responseText = completion.choices[0]?.message?.content || '{"translations": []}';
    const parsed = JSON.parse(responseText);
    
    return parsed.translations || parsed.result || texts;
  } catch (error) {
    console.error('❌ خطأ في الترجمة الجماعية:', error);
    return texts; // Return original on error
  }
}
