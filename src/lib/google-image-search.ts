interface GoogleImageResult {
  title: string;
  link: string;
  displayLink: string;
  snippet: string;
  mime: string;
  image: {
    contextLink: string;
    height: number;
    width: number;
    byteSize: number;
    thumbnailLink: string;
    thumbnailHeight: number;
    thumbnailWidth: number;
  };
}

interface GoogleSearchResponse {
  items?: GoogleImageResult[];
  error?: {
    code: number;
    message: string;
  };
}

export class GoogleImageSearch {
  private apiKey: string;
  private searchEngineId: string;
  private baseUrl = 'https://www.googleapis.com/customsearch/v1';

  constructor() {
    this.apiKey = process.env.GOOGLE_CUSTOM_SEARCH_API_KEY || process.env.GOOGLE_API_KEY || '';
    this.searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || '';

    if (!this.apiKey || !this.searchEngineId) {
      console.warn('⚠️ Google Image Search: Not configured. Using fallback mode. To enable, set GOOGLE_CUSTOM_SEARCH_API_KEY and GOOGLE_SEARCH_ENGINE_ID');
    }
  }

  async searchImages(
    query: string,
    options: {
      num?: number;
      imageSize?: 'huge' | 'large' | 'medium' | 'small';
      imageType?: 'clipart' | 'face' | 'lineart' | 'stock' | 'photo' | 'animated';
      safe?: 'active' | 'off';
      rights?: string | null;
    } = {}
  ): Promise<Array<{
    url: string;
    title: string;
    width: number;
    height: number;
    thumbnailUrl: string;
    source: string;
  }>> {
    if (!this.apiKey || !this.searchEngineId) {
      console.error('❌ Google Image Search not configured');
      return [];
    }

    try {
      const baseParams: Record<string, string> = {
        key: this.apiKey,
        cx: this.searchEngineId,
        q: query,
        searchType: 'image',
        num: String(options.num || 3),
        safe: options.safe || 'active',
      };

      if (options.rights === undefined) {
        baseParams.rights = 'cc_publicdomain,cc_attribute';
      } else if (options.rights !== null && options.rights !== '') {
        baseParams.rights = options.rights;
      }

      if (options.imageSize) {
        baseParams.imgSize = options.imageSize;
      }
      if (options.imageType) {
        baseParams.imgType = options.imageType;
      }
      
      const params = new URLSearchParams(baseParams);

      const url = `${this.baseUrl}?${params.toString()}`;
      
      console.log(`🔍 البحث عن صور: "${query}"`);

      const response = await fetch(url);
      const data: GoogleSearchResponse = await response.json();

      if (data.error) {
        console.error('❌ خطأ في Google Image Search:', data.error.message);
        return [];
      }

      if (!data.items || data.items.length === 0) {
        console.warn(`⚠️ لم يتم العثور على صور لـ: "${query}"`);
        return [];
      }

      console.log(`✅ تم العثور على ${data.items.length} صورة`);

      return data.items.map(item => ({
        url: item.link,
        title: item.title,
        width: item.image.width,
        height: item.image.height,
        thumbnailUrl: item.image.thumbnailLink,
        source: item.displayLink,
      }));
    } catch (error) {
      console.error('❌ خطأ في البحث عن الصور:', error);
      return [];
    }
  }

  async downloadAndUploadImage(imageUrl: string, title: string): Promise<string | null> {
    try {
      console.log(`📥 جاري تحميل الصورة: ${title}`);

      const response = await fetch(imageUrl);
      if (!response.ok) {
        console.error(`❌ فشل تحميل الصورة: ${response.statusText}`);
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

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

      console.log(`✅ تم رفع الصورة إلى Cloudinary: ${uploadResult.secure_url}`);
      return uploadResult.secure_url;
    } catch (error) {
      console.error('❌ خطأ في تحميل ورفع الصورة:', error);
      return null;
    }
  }
}

export const googleImageSearch = new GoogleImageSearch();
