import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  role: string;
  team: string | null;
  site: string | null;
  department: string | null;
  created_at: string;
  updated_at: string;
}

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'team_chief' | 'team_responsible' | 'team_member' | 'assistant' | 'employee' | 'instructor';
  department?: string;
  teamId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  canAccessFiles: () => boolean;
  canManageUsers: () => boolean;
  canAssignTasks: () => boolean;
  convertRole: (role: string | undefined) => 'admin' | 'student';
  getRoleDisplayName: (role: 'admin' | 'student') => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define role permissions
const rolePermissions = {
  admin: ['manage_users', 'manage_files', 'assign_tasks', 'view_analytics', 'manage_system', 'create_content', 'grade_assessments', 'view_files', 'download_files'],
  team_chief: ['manage_team', 'assign_tasks', 'view_files', 'view_analytics', 'manage_employees', 'download_files'],
  team_responsible: ['assign_tasks', 'view_files', 'manage_team_members', 'download_files'],
  team_member: ['view_files', 'upload_files', 'view_tasks', 'download_files'],
  assistant: ['view_files', 'edit_limited', 'support_tasks', 'download_files'],
  employee: ['view_files', 'download_files'],
  instructor: ['create_content', 'grade_assessments', 'view_analytics', 'view_files', 'download_files', 'manage_students']
};

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from database
          setTimeout(async () => {
            await fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUser(null);
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        setTimeout(async () => {
          await fetchUserProfile(session.user.id);
        }, 0);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }

      if (profileData) {
        setProfile(profileData);
        setUser({
          id: profileData.user_id,
          email: profileData.email || '',
          name: profileData.full_name || '',
          role: profileData.role as AuthUser['role'],
          department: profileData.department || undefined,
          teamId: profileData.team || undefined,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: userData.fullName,
          phone: userData.phone,
          date_of_birth: userData.dateOfBirth,
          role: userData.role,
          team: userData.team,
          site: userData.site,
          department: userData.department,
        }
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return rolePermissions[user.role]?.includes(permission) || false;
  };

  const canAccessFiles = (): boolean => {
    return hasPermission('view_files') || hasPermission('manage_files');
  };

  const canManageUsers = (): boolean => {
    return hasPermission('manage_users') || hasPermission('manage_employees');
  };

  const canAssignTasks = (): boolean => {
    return hasPermission('assign_tasks');
  };

  const convertRole = (role: string | undefined): 'admin' | 'student' => {
    if (role === 'admin' || role === 'team_chief') {
      return 'admin';
    }
    return 'student';
  };

  const getRoleDisplayName = (role: 'admin' | 'student'): string => {
    return role === 'admin' ? 'Administrateur' : 'Étudiant';
  };

  const isAuthenticated = !!session && !!user;

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      isAuthenticated,
      hasPermission,
      canAccessFiles,
      canManageUsers,
      canAssignTasks,
      convertRole,
      getRoleDisplayName,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};