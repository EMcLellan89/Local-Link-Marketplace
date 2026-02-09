import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { DEV_MODE, BYPASS_MODE, MOCK_INTERNAL_TEAM_MEMBER } from '../lib/devMode';

interface TeamMember {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'manager' | 'support' | 'developer' | 'accountant';
  permissions: Record<string, any>;
  is_active: boolean;
}

interface InternalTeamAuthContextType {
  teamMember: TeamMember | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isRole: (...roles: string[]) => boolean;
}

const InternalTeamAuthContext = createContext<InternalTeamAuthContextType | undefined>(undefined);

export function InternalTeamAuthProvider({ children }: { children: ReactNode }) {
  const [teamMember, setTeamMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEV_MODE || BYPASS_MODE) {
      setTeamMember(MOCK_INTERNAL_TEAM_MEMBER);
      setLoading(false);
      return;
    }

    checkTeamMember();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        await loadTeamMember(session.user.email!);
      } else if (event === 'SIGNED_OUT') {
        setTeamMember(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Also check for admin token - admins have access to all team functionality
  useEffect(() => {
    const checkAdminAccess = async () => {
      const adminToken = localStorage.getItem('admin_token');
      if (!adminToken) return;

      try {
        const { data } = await supabase
          .from('admin_sessions')
          .select('admin_user_id, expires_at, admin_users(id, email, full_name)')
          .eq('token', adminToken)
          .maybeSingle();

        if (data && new Date((data as any).expires_at) > new Date()) {
          const adminData = (data as any).admin_users;
          // Give admin full access with admin role
          setTeamMember({
            id: adminData.id,
            email: adminData.email,
            full_name: adminData.full_name,
            role: 'admin',
            permissions: {},
            is_active: true,
          });
        }
      } catch (error) {
        console.error('Error checking admin access for team:', error);
      }
    };

    checkAdminAccess();
  }, []);

  async function checkTeamMember() {
    try {
      // First check if admin is logged in
      const adminToken = localStorage.getItem('admin_token');
      if (adminToken) {
        const { data } = await supabase
          .from('admin_sessions')
          .select('admin_user_id, expires_at, admin_users(id, email, full_name)')
          .eq('token', adminToken)
          .maybeSingle();

        if (data && new Date((data as any).expires_at) > new Date()) {
          const adminData = (data as any).admin_users;
          setTeamMember({
            id: adminData.id,
            email: adminData.email,
            full_name: adminData.full_name,
            role: 'admin',
            permissions: {},
            is_active: true,
          });
          setLoading(false);
          return;
        }
      }

      // Otherwise check for regular team member
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.email) {
        await loadTeamMember(session.user.email);
      }
    } catch (error) {
      console.error('Error checking team member:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadTeamMember(email: string) {
    try {
      const { data, error } = await supabase
        .from('internal_team_members')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (data) {
        setTeamMember(data as TeamMember);

        await supabase
          .from('internal_team_members')
          .update({ last_login: new Date().toISOString() } as any)
          .eq('id', (data as any).id);
      }
    } catch (error) {
      console.error('Error loading team member:', error);
      setTeamMember(null);
    }
  }

  async function signIn(email: string, password: string) {
    if (DEV_MODE || BYPASS_MODE) {
      setTeamMember(MOCK_INTERNAL_TEAM_MEMBER);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
    setTeamMember(null);
  }

  function hasPermission(permission: string): boolean {
    if (!teamMember) return false;
    if (teamMember.role === 'admin') return true;
    return teamMember.permissions?.[permission] === true;
  }

  function isRole(...roles: string[]): boolean {
    if (!teamMember) return false;
    return roles.includes(teamMember.role);
  }

  return (
    <InternalTeamAuthContext.Provider
      value={{
        teamMember,
        loading,
        signIn,
        signOut,
        hasPermission,
        isRole,
      }}
    >
      {children}
    </InternalTeamAuthContext.Provider>
  );
}

export function useInternalTeamAuth() {
  const context = useContext(InternalTeamAuthContext);
  if (context === undefined) {
    throw new Error('useInternalTeamAuth must be used within InternalTeamAuthProvider');
  }
  return context;
}
