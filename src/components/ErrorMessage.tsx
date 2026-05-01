'use client';

import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

interface ErrorMessageProps {
  type?: 'error' | 'success' | 'warning' | 'info';
  message: string;
  details?: string;
  onClose?: () => void;
  className?: string;
}

const errorMessages: Record<string, string> = {
  'Failed to fetch': 'فشل في تحميل البيانات. يرجى التحقق من اتصالك بالإنترنت.',
  'Network error': 'خطأ في الشبكة. يرجى المحاولة مرة أخرى.',
  'Not found': 'لم يتم العثور على الصفحة المطلوبة.',
  'Unauthorized': 'يجب تسجيل الدخول للوصول إلى هذه الصفحة.',
  'Server error': 'حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً.',
  'Validation error': 'خطأ في التحقق من البيانات. يرجى مراجعة المعلومات المدخلة.',
  'Timeout': 'انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.',
  'Invalid input': 'البيانات المدخلة غير صحيحة.',
  'Permission denied': 'ليس لديك صلاحية للوصول إلى هذا المحتوى.',
};

export default function ErrorMessage({
  type = 'error',
  message,
  details,
  onClose,
  className = ''
}: ErrorMessageProps) {
  const arabicMessage = errorMessages[message] || message;

  const icons = {
    error: <XCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />,
    success: <CheckCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />,
    warning: <AlertCircle className="w-5 h-5 flex-shrink-0" aria-hidden="true" />,
    info: <Info className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
  };

  const styles = {
    error: 'error-message',
    success: 'success-message',
    warning: 'text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm font-medium',
    info: 'info-message'
  };

  return (
    <div 
      className={`${styles[type]} ${className} flex items-start gap-3`}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="mt-0.5">{icons[type]}</div>
      <div className="flex-1">
        <p className="font-semibold">{arabicMessage}</p>
        {details && (
          <p className="mt-1 text-xs opacity-80">{details}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="text-current hover:opacity-70 transition-opacity focus-visible-ring"
          aria-label="إغلاق الرسالة"
        >
          <XCircle className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

export function ErrorBoundaryFallback({ error, resetErrorBoundary }: { 
  error: Error; 
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <ErrorMessage
          type="error"
          message={error.message}
          details="حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
        />
        <button
          onClick={resetErrorBoundary}
          className="mt-4 w-full py-3 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium focus-visible-ring"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );
}
