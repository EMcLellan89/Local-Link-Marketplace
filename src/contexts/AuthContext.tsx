import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, UserRole } from '../lib/supabase';
import { getDevRole } from '../lib/devMode';

const DEV_MODE = import.meta.env.VITE_DEV_MODE === 'true';
const BYPASS_MODE = import.meta.env.VITE_BYPASS_MODE === 'true';

interface Profile {
  id: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getMockUser(): User {
  return {
    id: 'dev-user-mock-id',
    email: 'dev@local-link.com',
    app_metadata: {},
    user_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
  } as User;
}

function getMockProfile(): Profile {
  const devRole = getDevRole();
  const roleNames = {
    customer: { first: 'Dev', last: 'Customer' },
    merchant: { first: 'Dev', last: 'Merchant' },
    partner: { first: 'Dev', last: 'Partner' },
    admin: { first: 'Dev', last: 'Admin' }
  };

  const names = roleNames[devRole];

  return {
    id: 'dev-user-mock-id',
    role: devRole as UserRole,
    first_name: names.first,
    last_name: names.last,
    phone: '555-0100',
    avatar_url: null,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  };

  const refreshProfile = async () => {
    if (!user) return;
    const profileData = await fetchProfile(user.id);
    setProfile(profileData);
  };

  useEffect(() => {
    if (DEV_MODE || BYPASS_MODE) {
      console.warn('🚨 BYPASS MODE ENABLED - Auth is bypassed! Disable before going live.');
      setUser(getMockUser());
      setProfile(getMockProfile());
      setLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        }

        setLoading(false);
      })();
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const profileData = await fetchProfile(session.user.id);
          setProfile(profileData);
        } else {
          setProfile(null);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (DEV_MODE || BYPASS_MODE) {
      console.log('BYPASS MODE: Sign in bypassed - You are automatically logged in!');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string, role: UserRole = 'customer') => {
    if (DEV_MODE || BYPASS_MODE) {
      console.log('BYPASS MODE: Sign up bypassed - You are automatically logged in!');
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
        },
      },
    });

    if (error) throw error;

    if (role !== 'customer') {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from('profiles')
          .update({ role } as any)
          .eq('id', user.id);
      }
    }
  };

  const signOut = async () => {
    if (DEV_MODE || BYPASS_MODE) {
      console.log('BYPASS MODE: Sign out bypassed');
      return;
    }

    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        loading,
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
