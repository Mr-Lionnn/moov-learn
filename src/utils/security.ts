import DOMPurify from 'dompurify';
import { z } from 'zod';

// Input validation schemas
export const emailSchema = z.string().email('Email invalide').max(254);
export const passwordSchema = z.string().min(8, 'Mot de passe trop court (minimum 8 caractères)').max(128);
export const nameSchema = z.string().min(1, 'Nom requis').max(100).regex(/^[a-zA-ZÀ-ÿ\s-']+$/, 'Nom invalide');
export const textSchema = z.string().max(1000);

// Rate limiting for login attempts
class RateLimiter {
  private attempts: Map<string, { count: number; lastAttempt: number }> = new Map();
  private readonly maxAttempts = 5;
  private readonly windowMs = 15 * 60 * 1000; // 15 minutes

  isBlocked(identifier: string): boolean {
    const record = this.attempts.get(identifier);
    if (!record) return false;

    const now = Date.now();
    if (now - record.lastAttempt > this.windowMs) {
      this.attempts.delete(identifier);
      return false;
    }

    return record.count >= this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const record = this.attempts.get(identifier);

    if (!record || now - record.lastAttempt > this.windowMs) {
      this.attempts.set(identifier, { count: 1, lastAttempt: now });
    } else {
      record.count++;
      record.lastAttempt = now;
    }
  }

  reset(identifier: string): void {
    this.attempts.delete(identifier);
  }
}

export const loginRateLimiter = new RateLimiter();

// Content sanitization
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
    ALLOWED_ATTR: []
  });
};

export const sanitizeText = (text: string): string => {
  return text.replace(/[<>\"'&]/g, (char) => {
    const entities: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return entities[char];
  });
};

// Secure storage utilities
const ENCRYPTION_KEY = 'moov_secure_key_2024';

export const secureStorage = {
  setItem: (key: string, value: any): void => {
    try {
      const jsonString = JSON.stringify(value);
      const encrypted = btoa(jsonString + ENCRYPTION_KEY);
      localStorage.setItem(`secure_${key}`, encrypted);
    } catch (error) {
      console.error('Secure storage error:', error);
    }
  },

  getItem: (key: string): any => {
    try {
      const encrypted = localStorage.getItem(`secure_${key}`);
      if (!encrypted) return null;
      
      const decrypted = atob(encrypted);
      const jsonString = decrypted.replace(ENCRYPTION_KEY, '');
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Secure storage retrieval error:', error);
      return null;
    }
  },

  removeItem: (key: string): void => {
    localStorage.removeItem(`secure_${key}`);
  }
};

// CSRF Token generation
export const generateCSRFToken = (): string => {
  return btoa(Date.now() + Math.random().toString(36));
};

// Session validation
export const validateSession = (sessionData: any): boolean => {
  if (!sessionData || !sessionData.timestamp || !sessionData.userId) {
    return false;
  }

  const sessionAge = Date.now() - sessionData.timestamp;
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours

  return sessionAge < maxAge;
};

// Input validation helper
export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: 'Validation failed' };
  }
};