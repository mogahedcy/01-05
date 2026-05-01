'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, AlertCircle, CheckCircle, Loader2, Shield, User, Lock } from 'lucide-react';

// تقييم قوة كلمة المرور
const getPasswordStrength = (password: string): number => {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  return score;
};

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...formData,
          rememberMe
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'تم تسجيل الدخول بنجاح! جاري التحويل...' });

        // انتظار قصير قبل التوجيه
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh();
        }, 1500);
      } else {
        setMessage({ 
          type: 'error', 
          text: data.error || 'فشل في تسجيل الدخول. يرجى التحقق من البيانات.' 
        });
      }
    } catch (error) {
      console.error('خطأ في تسجيل الدخول:', error);
      setMessage({ 
        type: 'error', 
        text: 'حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // إخفاء رسائل الخطأ عند الكتابة
    if (message.type === 'error') {
      setMessage({ type: '', text: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {/* Username Field */}
      <div className="space-y-2">
        <label htmlFor="username" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <User className="w-4 h-4 text-gray-500" />
          اسم المستخدم
        </label>
        <div className="relative group">
          <Input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
            value={formData.username}
            onChange={handleInputChange}
            onFocus={() => setFocusedField('username')}
            onBlur={() => setFocusedField(null)}
            placeholder="أدخل اسم المستخدم"
            className={`w-full transition-all duration-200 pr-12 pl-4 py-3 text-base
              ${focusedField === 'username' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'}
              ${formData.username ? 'border-green-300 bg-green-50/30' : ''}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300`}
            disabled={isLoading}
          />
          <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity duration-200
            ${focusedField === 'username' || formData.username ? 'opacity-100' : 'opacity-50'}`}>
            <User className="w-5 h-5 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Lock className="w-4 h-4 text-gray-500" />
          كلمة المرور
        </label>
        <div className="relative group">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            value={formData.password}
            onChange={handleInputChange}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
            placeholder="أدخل كلمة المرور"
            className={`w-full transition-all duration-200 pr-12 pl-12 py-3 text-base
              ${focusedField === 'password' ? 'ring-2 ring-blue-500 border-blue-500' : 'border-gray-200'}
              ${formData.password ? 'border-green-300 bg-green-50/30' : ''}
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-300`}
            disabled={isLoading}
          />
          <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-opacity duration-200
            ${focusedField === 'password' || formData.password ? 'opacity-100' : 'opacity-50'}`}>
            <Lock className="w-5 h-5 text-gray-400" />
          </div>
          <button
            type="button"
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 transition-all duration-200
              ${focusedField === 'password' ? 'text-blue-500' : 'text-gray-400'}
              hover:text-blue-600 focus:outline-none focus:text-blue-600`}
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[...Array(4)].map((_, i) => {
                const strength = getPasswordStrength(formData.password);
                return (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded transition-all duration-300
                      ${i < strength ? 
                        strength === 1 ? 'bg-red-400' :
                        strength === 2 ? 'bg-yellow-400' :
                        strength === 3 ? 'bg-blue-400' : 'bg-green-400'
                      : 'bg-gray-200'}`}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-300 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
          )}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      {/* Remember Me & Forgot Password */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <input 
              id="remember" 
              type="checkbox" 
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="sr-only" 
              disabled={isLoading} 
            />
            <label 
              htmlFor="remember" 
              className={`flex items-center gap-2 cursor-pointer select-none transition-all duration-200
                ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'}`}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
                ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-gray-300 hover:border-blue-400'}`}>
                {rememberMe && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className="font-medium text-gray-700">تذكرني لمدة 30 يوماً</span>
            </label>
          </div>
        </div>
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1"
          disabled={isLoading}
        >
          نسيت كلمة المرور؟
        </button>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className={`w-full py-4 text-base font-semibold transition-all duration-200
          ${isLoading ? 'bg-blue-400' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}
          disabled:opacity-50 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]`}
        disabled={isLoading || !formData.username || !formData.password}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            <span>جاري التحقق من البيانات...</span>
          </>
        ) : (
          <>
            <Shield className="ml-2 h-5 w-5" />
            <span>دخول آمن إلى لوحة التحكم</span>
          </>
        )}
      </Button>
    </form>
  );
}