import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';

export async function checkAdminAuth() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin-token')?.value;
    
    if (!token) {
      return null;
    }
    
    const decoded = verifyToken(token) as any;
    return decoded;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}

export async function requireAdminAuth() {
  const admin = await checkAdminAuth();
  if (!admin) {
    throw new Error('Unauthorized');
  }
  return admin;
}
