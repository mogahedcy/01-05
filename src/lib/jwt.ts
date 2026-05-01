import jwt, { type SignOptions } from 'jsonwebtoken';

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is required but not set');
  }
  
  return secret;
}

export function verifyToken(token: string): any {
  return jwt.verify(token, getJWTSecret());
}

export function signToken(payload: object, expiresIn: string | number = '7d'): string {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, getJWTSecret(), options);
}

export { getJWTSecret };
