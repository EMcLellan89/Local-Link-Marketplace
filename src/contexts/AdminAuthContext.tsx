import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { AdminUser, AdminSession } from '../lib/database-extended.types';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';
const BYPASS_MODE = import.meta.env.VITE_BYPASS_MODE === 'true';

interface AdminAuthContextType {
  adminUser: AdminUser | null;
  admin: AdminUser | null; // Alias for compatibility
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const MOCK_ADMIN: AdminUser = {
  id: 'dev-admin-mock-id',
  email: 'admin@local-link.com',
  full_name: 'Dev Admin',
};

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEV_MODE || BYPASS_MODE) {
      console.warn('🚨 DEV MODE ENABLED - Admin auth is bypassed!');
      setAdminUser(MOCK_ADMIN);
      setLoading(false);
      return;
    }
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('admin_sessions')
        .select('admin_user_id, expires_at, admin_users(id, email, full_name)')
        .eq('token', token)
        .maybeSingle();

      if (error || !data) {
        localStorage.removeItem('admin_token');
        setLoading(false);
        return;
      }

      const sessionData = data as unknown as AdminSession;

      if (new Date(sessionData.expires_at) < new Date()) {
        localStorage.removeItem('admin_token');
        setLoading(false);
        return;
      }

      const adminData = sessionData.admin_users;
      if (adminData) {
        setAdminUser(adminData);
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
      localStorage.removeItem('admin_token');
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (DEV_MODE || BYPASS_MODE) {
      console.log('DEV MODE: Admin sign in bypassed');
      setAdminUser(MOCK_ADMIN);
      return;
    }

    const { data: adminData, error: adminError } = await supabase
      .from('admin_users')
      .select('id, email, full_name, password_hash')
      .eq('email', email)
      .maybeSingle();

    if (adminError || !adminData) {
      throw new Error('Invalid credentials');
    }

    const user = adminData as unknown as AdminUser & { password_hash: string };

    const passwordMatch = password === user.password_hash;

    if (!passwordMatch) {
      throw new Error('Invalid credentials');
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const { error: sessionError } = await supabase
      .from('admin_sessions')
      .insert({
        admin_user_id: user.id,
        token,
        expires_at: expiresAt.toISOString()
      } as any);

    if (sessionError) {
      throw new Error('Failed to create session');
    }

    localStorage.setItem('admin_token', token);
    setAdminUser({
      id: user.id,
      email: user.email,
      full_name: user.full_name
    });
  };

  const signOut = async () => {
    if (DEV_MODE || BYPASS_MODE) {
      console.log('DEV MODE: Admin sign out bypassed');
      return;
    }

    const token = localStorage.getItem('admin_token');
    if (token) {
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('token', token);
    }
    localStorage.removeItem('admin_token');
    setAdminUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ adminUser, admin: adminUser, loading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
