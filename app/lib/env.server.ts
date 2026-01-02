/**
 * Environment variables validation and configuration
 * This file ensures all required environment variables are present
 * and provides type-safe access to them
 */

import { z } from 'zod';

const envSchema = z.object({
  // Supabase
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  
  // Stripe
  STRIPE_PUBLIC_KEY: z.string().startsWith('pk_').optional(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_').optional(),
  STRIPE_WEBHOOK_SECRET: z.string().startsWith('whsec_').optional(),
  
  // Email (Resend)
  RESEND_API_KEY: z.string().startsWith('re_').optional(),
  EMAIL_FROM: z.string().optional().default('FastFabric <noreply@fastfabric.fr>'),
  ADMIN_EMAIL: z.string().email().optional().default('admin@fastfabric.fr'),
  
  // Gemini AI
  GEMINI_API_KEY: z.string().optional(),
  
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_URL: z.string().url().optional().default('http://localhost:5173'),
  
  // Security
  SESSION_SECRET: z.string().min(32).optional(),
});

type Env = z.infer<typeof envSchema>;

let env: Env | null = null;

export function getEnv(): Env {
  if (env) return env;
  
  const parsed = envSchema.safeParse(process.env);
  
  if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.flatten().fieldErrors);
    // In development, continue with defaults
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Invalid environment variables');
    }
  }
  
  env = parsed.success ? parsed.data : (envSchema.parse({}) as Env);
  return env;
}

// Feature flags based on available configuration
export function hasSupabase(): boolean {
  const e = getEnv();
  return Boolean(e.SUPABASE_URL && e.SUPABASE_ANON_KEY);
}

export function hasStripe(): boolean {
  const e = getEnv();
  return Boolean(e.STRIPE_PUBLIC_KEY && e.STRIPE_SECRET_KEY);
}

export function hasEmail(): boolean {
  const e = getEnv();
  return Boolean(e.RESEND_API_KEY);
}

export function hasGemini(): boolean {
  const e = getEnv();
  return Boolean(e.GEMINI_API_KEY);
}

export function isProduction(): boolean {
  return getEnv().NODE_ENV === 'production';
}

// Export individual env vars for convenience
export function getSupabaseConfig() {
  const e = getEnv();
  return {
    url: e.SUPABASE_URL || '',
    anonKey: e.SUPABASE_ANON_KEY || '',
    serviceKey: e.SUPABASE_SERVICE_ROLE_KEY || '',
  };
}

export function getStripeConfig() {
  const e = getEnv();
  return {
    publicKey: e.STRIPE_PUBLIC_KEY || '',
    secretKey: e.STRIPE_SECRET_KEY || '',
    webhookSecret: e.STRIPE_WEBHOOK_SECRET || '',
  };
}

export function getEmailConfig() {
  const e = getEnv();
  return {
    apiKey: e.RESEND_API_KEY || '',
    from: e.EMAIL_FROM || 'FastFabric <noreply@fastfabric.fr>',
    adminEmail: e.ADMIN_EMAIL || 'admin@fastfabric.fr',
  };
}

export function getAppConfig() {
  const e = getEnv();
  return {
    url: e.APP_URL || 'http://localhost:5173',
    isProduction: e.NODE_ENV === 'production',
    sessionSecret: e.SESSION_SECRET || 'dev-secret-change-in-production-min-32-chars',
  };
}


