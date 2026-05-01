
export default function cloudinaryLoader({ src, width, quality }) {
  // إذا كان الرابط يحتوي على cloudinary بالفعل، استخدمه كما هو
  if (src.includes('cloudinary.com')) {
    return src;
  }

  // إذا كان رابط محلي، استخدمه كما هو
  if (src.startsWith('/') || src.startsWith('./')) {
    return src;
  }

  // للروابط الخارجية، استخدمها كما هي
  return src;
}
