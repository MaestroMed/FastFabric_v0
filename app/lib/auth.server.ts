/**
 * Authentication utilities for admin access
 * Uses Supabase Auth for secure session management
 */

import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig, hasSupabase, getAppConfig } from './env.server';

// Types
export interface AuthUser {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Create authenticated Supabase client
function getSupabaseClient() {
  const config = getSupabaseConfig();
  if (!config.url || !config.anonKey) {
    return null;
  }
  return createClient(config.url, config.anonKey);
}

function getSupabaseAdmin() {
  const config = getSupabaseConfig();
  if (!config.url || !config.serviceKey) {
    return null;
  }
  return createClient(config.url, config.serviceKey);
}

// Cookie name for session
const SESSION_COOKIE = 'ff_session';

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string): Promise<{
  success: boolean;
  session?: AuthSession;
  error?: string;
}> {
  const supabase = getSupabaseClient();
  
  if (!supabase) {
    // Demo mode: allow hardcoded admin login
    if (email === 'admin@fastfabric.fr' && password === 'admin123') {
      return {
        success: true,
        session: {
          user: { id: 'demo-admin', email, role: 'admin' },
          accessToken: 'demo-token',
          refreshToken: 'demo-refresh',
          expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24h
        },
      };
    }
    return { success: false, error: 'Email ou mot de passe incorrect' };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.session) {
    return { success: false, error: error?.message || 'Erreur de connexion' };
  }

  return {
    success: true,
    session: {
      user: {
        id: data.user.id,
        email: data.user.email!,
        role: 'admin', // All authenticated users are admins for now
      },
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at! * 1000,
    },
  };
}

/**
 * Sign out and clear session
 */
export async function signOut(): Promise<void> {
  const supabase = getSupabaseClient();
  if (supabase) {
    await supabase.auth.signOut();
  }
}

/**
 * Verify and refresh session from cookies
 */
export async function getSession(request: Request): Promise<AuthSession | null> {
  const cookieHeader = request.headers.get('Cookie');
  if (!cookieHeader) return null;

  // Parse cookies
  const cookies = Object.fromEntries(
    cookieHeader.split('; ').map(c => {
      const [key, ...v] = c.split('=');
      return [key, v.join('=')];
    })
  );

  const sessionData = cookies[SESSION_COOKIE];
  if (!sessionData) return null;

  try {
    const session = JSON.parse(decodeURIComponent(sessionData)) as AuthSession;
    
    // Check if expired
    if (session.expiresAt < Date.now()) {
      // Try to refresh
      const supabase = getSupabaseClient();
      if (supabase && session.refreshToken !== 'demo-refresh') {
        const { data, error } = await supabase.auth.refreshSession({
          refresh_token: session.refreshToken,
        });
        
        if (error || !data.session) {
          return null;
        }
        
        return {
          user: session.user,
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at! * 1000,
        };
      }
      
      // Demo mode: extend session
      if (session.refreshToken === 'demo-refresh') {
        return {
          ...session,
          expiresAt: Date.now() + 24 * 60 * 60 * 1000,
        };
      }
      
      return null;
    }
    
    return session;
  } catch {
    return null;
  }
}

/**
 * Create session cookie header
 */
export function createSessionCookie(session: AuthSession): string {
  const value = encodeURIComponent(JSON.stringify(session));
  const maxAge = Math.floor((session.expiresAt - Date.now()) / 1000);
  const secure = getAppConfig().isProduction ? '; Secure' : '';
  
  return `${SESSION_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

/**
 * Create logout cookie header (clears session)
 */
export function createLogoutCookie(): string {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

/**
 * Require authentication - throws redirect if not authenticated
 */
export async function requireAuth(request: Request): Promise<AuthSession> {
  const session = await getSession(request);
  
  if (!session) {
    throw new Response(null, {
      status: 302,
      headers: {
        Location: '/admin/login',
      },
    });
  }
  
  return session;
}

/**
 * Check if user is authenticated (doesn't throw)
 */
export async function isAuthenticated(request: Request): Promise<boolean> {
  const session = await getSession(request);
  return session !== null;
}


