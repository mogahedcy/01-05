
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { NextRequest } from 'next/server';

// نظام Rate Limiting مخصص للـ Edge Runtime
class EdgeRateLimit {
  private attempts = new Map<string, { count: number; resetTime: number }>();
  private readonly windowMs: number;
  private readonly maxAttempts: number;

  constructor(windowMs: number, maxAttempts: number) {
    this.windowMs = windowMs;
    this.maxAttempts = maxAttempts;
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now > record.resetTime) {
      // إنشاء سجل جديد أو إعادة تعيين
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs
      });
      return {
        allowed: true,
        remaining: this.maxAttempts - 1,
        resetTime: now + this.windowMs
      };
    }

    if (record.count >= this.maxAttempts) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.resetTime
      };
    }

    record.count++;
    return {
      allowed: true,
      remaining: this.maxAttempts - record.count,
      resetTime: record.resetTime
    };
  }

  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.attempts.entries()) {
      if (now > record.resetTime) {
        this.attempts.delete(key);
      }
    }
  }
}

// إنشاء محدد معدل للدخول: 5 محاولات كل 15 دقيقة
export const loginRateLimit = new EdgeRateLimit(15 * 60 * 1000, 5);

// محدد معدل للـ API: 100 طلب كل 15 دقيقة
export const apiRateLimit = new EdgeRateLimit(15 * 60 * 1000, 100);

// تنظيف دوري كل 30 دقيقة
setInterval(() => {
  loginRateLimit.cleanup();
  apiRateLimit.cleanup();
}, 30 * 60 * 1000);

// التحقق من صحة كلمة المرور
export const validatePassword = (password: string): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على حرف صغير واحد على الأقل');
  }

  if (!/\d/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رقم واحد على الأقل');
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// تشفير كلمة المرور المحسن
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 14; // مستوى تشفير عالي للأمان
  return await bcrypt.hash(password, saltRounds);
};

// مقارنة كلمة المرور الآمنة
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

// إنتاج JWT token مع أمان محسن
export const generateToken = (payload: any, expiresIn = '24h'): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign(
    {
      ...payload,
      iat: Math.floor(Date.now() / 1000),
      jti: generateSecureId(), // JWT ID لإلغاء الرموز
    },
    secret,
    {
      expiresIn,
      algorithm: 'HS256',
      issuer: 'aldeyar-jeddah',
      audience: 'aldeyar-admin'
    }
  );
};

// التحقق من JWT token
export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }

  try {
    return jwt.verify(token, secret, {
      issuer: 'aldeyar-jeddah',
      audience: 'aldeyar-admin'
    });
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// إنتاج معرف آمن عشوائي
export const generateSecureId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// تنظيف البيانات المدخلة
export const sanitizeInput = (input: unknown): string => {
  if (typeof input !== 'string') return '';

  return input
    .trim()
    .replace(/[<>\"']/g, '') // إزالة الأحرف الخطيرة
    .replace(/\s+/g, ' ') // تطبيع المسافات
    .slice(0, 1000); // حد الطول
};

// منع SQL injection (للاستعلامات المباشرة)
export const escapeSQL = (input: string): string => {
  if (typeof input !== 'string') return '';
  return input.replace(/'/g, "''");
};

// حماية XSS
export const escapeHtml = (unsafe: string): string => {
  if (typeof unsafe !== 'string') return '';

  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

// إنتاج والتحقق من CSRF token
export const generateCSRFToken = (): string => {
  return generateSecureId();
};

export const validateCSRFToken = (token: string, storedToken: string): boolean => {
  return token === storedToken;
};

// إدارة الجلسات
interface Session {
  id: string;
  adminId: string;
  createdAt: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
}

class SessionManager {
  private sessions = new Map<string, Session>();
  private readonly maxSessions = 5; // أقصى عدد جلسات متزامنة لكل مدير
  private readonly sessionTimeout = 24 * 60 * 60 * 1000; // 24 ساعة

  createSession(adminId: string, ipAddress: string, userAgent: string): string {
    const sessionId = generateSecureId();
    const now = new Date();

    // إزالة الجلسات القديمة لهذا المدير
    this.cleanupAdminSessions(adminId);

    const session: Session = {
      id: sessionId,
      adminId,
      createdAt: now,
      lastActivity: now,
      ipAddress,
      userAgent
    };

    this.sessions.set(sessionId, session);
    return sessionId;
  }

  validateSession(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // فحص انتهاء صلاحية الجلسة
    if (Date.now() - session.lastActivity.getTime() > this.sessionTimeout) {
      this.sessions.delete(sessionId);
      return null;
    }

    // تحديث آخر نشاط
    session.lastActivity = new Date();
    return session;
  }

  destroySession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  destroyAdminSessions(adminId: string): void {
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.adminId === adminId) {
        this.sessions.delete(sessionId);
      }
    }
  }

  private cleanupAdminSessions(adminId: string): void {
    const adminSessions = Array.from(this.sessions.entries())
      .filter(([_, session]) => session.adminId === adminId)
      .sort(([_, a], [__, b]) => b.lastActivity.getTime() - a.lastActivity.getTime());

    // الاحتفاظ بالجلسات الأحدث فقط
    if (adminSessions.length >= this.maxSessions) {
      const sessionsToRemove = adminSessions.slice(this.maxSessions - 1);
      for (const [sessionId] of sessionsToRemove) {
        this.sessions.delete(sessionId);
      }
    }
  }

  cleanupExpiredSessions(): void {
    const now = Date.now();
    for (const [sessionId, session] of this.sessions.entries()) {
      if (now - session.lastActivity.getTime() > this.sessionTimeout) {
        this.sessions.delete(sessionId);
      }
    }
  }
}

export const sessionManager = new SessionManager();

// التحقق من صحة الطلب
export const validateRequest = (request: NextRequest) => {
  const contentType = request.headers.get('content-type');
  const userAgent = request.headers.get('user-agent');

  // التحقق من نوع المحتوى للطلبات POST/PUT
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid content type');
    }
  }

  // التحقق من user agent
  if (!userAgent || userAgent.length < 10) {
    throw new Error('Invalid user agent');
  }
};

// استخراج عنوان IP
export const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const connIP = request.headers.get('x-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (connIP) {
    return connIP;
  }

  return 'unknown';
};

// سجل التدقيق
interface AuditLog {
  timestamp: Date;
  adminId: string;
  action: string;
  resource: string;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  details?: any;
}

class AuditLogger {
  private logs: AuditLog[] = [];
  private readonly maxLogs = 10000;

  log(entry: Omit<AuditLog, 'timestamp'>): void {
    const auditEntry: AuditLog = {
      ...entry,
      timestamp: new Date()
    };

    this.logs.push(auditEntry);

    // الاحتفاظ بالسجلات الحديثة فقط
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // في الإنتاج، يجب حفظ هذا في قاعدة البيانات
    if (process.env.NODE_ENV === 'development') {
      console.log('Audit Log:', auditEntry);
    }
  }

  getLogs(adminId?: string, limit = 100): AuditLog[] {
    let filteredLogs = this.logs;

    if (adminId) {
      filteredLogs = this.logs.filter(log => log.adminId === adminId);
    }

    return filteredLogs
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
}

export const auditLogger = new AuditLogger();

// مساعد التحقق من المصادقة
export const authenticateAdmin = async (request: NextRequest): Promise<any> => {
  const token = request.cookies.get('admin-token')?.value;

  if (!token) {
    throw new Error('No authentication token provided');
  }

  try {
    const decoded = verifyToken(token);

    // التحقق من الجلسة
    const sessionId = request.cookies.get('session-id')?.value;
    if (sessionId) {
      const session = sessionManager.validateSession(sessionId);
      if (!session || session.adminId !== decoded.adminId) {
        throw new Error('Invalid session');
      }
    }

    return decoded;
  } catch (error) {
    throw new Error('Invalid authentication token');
  }
};

// رؤوس الأمان
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self' https:;"
};

export default {
  validatePassword,
  hashPassword,
  comparePassword,
  generateToken,
  verifyToken,
  sanitizeInput,
  escapeHtml,
  sessionManager,
  auditLogger,
  authenticateAdmin,
  securityHeaders,
  getClientIP,
  validateRequest,
  loginRateLimit,
  apiRateLimit
};
