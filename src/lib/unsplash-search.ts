interface UnsplashImage {
  id: string;
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
  alt_description: string | null;
  description: string | null;
  width: number;
  height: number;
  user: {
    name: string;
    username: string;
  };
  links: {
    html: string;
  };
}

interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashImage[];
}

export class UnsplashSearch {
  private baseUrl = 'https://api.unsplash.com';
  private sourceUrl = 'https://source.unsplash.com';
  
  /**
   * البحث عن صور من Unsplash باستخدام Source API (مجاني، لا يحتاج API key)
   */
  async searchImages(
    query: string,
    options: {
      count?: number;
      orientation?: 'landscape' | 'portrait' | 'squarish';
    } = {}
  ): Promise<Array<{
    url: string;
    title: string;
    width: number;
    height: number;
    thumbnailUrl: string;
    source: string;
    sourceLink: string;
  }>> {
    try {
      const count = options.count || 3;
      const images: Array<{
        url: string;
        title: string;
        width: number;
        height: number;
        thumbnailUrl: string;
        source: string;
        sourceLink: string;
      }> = [];

      console.log(`🔍 البحث في Unsplash عن: "${query}"`);

      // استخدام Source API للحصول على صور عشوائية مرتبطة بالموضوع
      // هذا لا يحتاج API key ومجاني تماماً
      for (let i = 0; i < count; i++) {
        const orientation = options.orientation || 'landscape';
        const imageUrl = `${this.sourceUrl}/1600x900/?${encodeURIComponent(query)},${orientation}`;
        const thumbnailUrl = `${this.sourceUrl}/400x300/?${encodeURIComponent(query)},${orientation}`;
        
        images.push({
          url: imageUrl,
          title: query,
          width: 1600,
          height: 900,
          thumbnailUrl: thumbnailUrl,
          source: 'Unsplash',
          sourceLink: `https://unsplash.com/s/photos/${encodeURIComponent(query)}`
        });
      }

      console.log(`✅ تم العثور على ${images.length} صورة من Unsplash`);
      return images;
    } catch (error) {
      console.error('❌ خطأ في البحث عن الصور من Unsplash:', error);
      return [];
    }
  }

  /**
   * تحميل ورفع الصورة إلى Cloudinary
   */
  async downloadAndUploadImage(imageUrl: string, title: string): Promise<string | null> {
    try {
      console.log(`📥 جاري تحميل الصورة من Unsplash: ${title}`);

      // تحميل الصورة
      const response = await fetch(imageUrl);
      if (!response.ok) {
        console.error(`❌ فشل تحميل الصورة: ${response.statusText}`);
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // رفع إلى Cloudinary
      const cloudinaryModule = await import('./cloudinary');
      const cloudinary = cloudinaryModule.default;
      
      const publicId = title.replace(/[^a-z0-9]/gi, '-').toLowerCase().substring(0, 50);
      
      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: 'articles',
            public_id: publicId,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });

      console.log(`✅ تم رفع الصورة من Unsplash إلى Cloudinary: ${uploadResult.secure_url}`);
      return uploadResult.secure_url;
    } catch (error) {
      console.error('❌ خطأ في تحميل ورفع الصورة من Unsplash:', error);
      return null;
    }
  }

  /**
   * الحصول على صورة واحدة مباشرة (بدون تحميل)
   */
  getDirectImageUrl(query: string, width = 1600, height = 900): string {
    return `${this.sourceUrl}/${width}x${height}/?${encodeURIComponent(query)}`;
  }
}

export const unsplashSearch = new UnsplashSearch();
