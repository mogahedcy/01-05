import DOMPurify from 'isomorphic-dompurify';

interface SafeHtmlContentProps {
  content: string;
  className?: string;
}

export default function SafeHtmlContent({ content, className = "" }: SafeHtmlContentProps) {
  // التحقق من وجود المحتوى وأنه نص صالح
  if (!content || typeof content !== 'string') {
    console.warn('SafeHtmlContent: محتوى غير صالح تم تمريره');
    return <div className={className}>محتوى غير متوفر</div>;
  }

  // تنظيف المحتوى من أي عناصر ضارة مع إعدادات أمان محسنة
  const cleanContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li', 'a', 'br', 'hr', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'blockquote', 'code', 'pre'],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel', 'id'],
    ALLOWED_SCHEMES: ['http', 'https', 'mailto', 'tel'],
    ALLOW_DATA_ATTR: false,
    FORBID_ATTR: ['style', 'onclick', 'onload', 'onerror'],
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'iframe'],
    KEEP_CONTENT: true,
    RETURN_DOM: false,
    RETURN_DOM_FRAGMENT: false,
    SANITIZE_DOM: true
  });

  // التحقق من نجاح التنظيف
  if (!cleanContent) {
    console.warn('SafeHtmlContent: فشل في تنظيف المحتوى');
    return <div className={className}>محتوى غير صالح</div>;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
}
