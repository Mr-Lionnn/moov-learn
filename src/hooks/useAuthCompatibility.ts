import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';

// Temporary compatibility wrapper to avoid breaking changes
export const useAuth = () => {
  const { user: supabaseUser, profile, session, loading, signOut } = useSupabaseAuth();
  
  // Create a user object that matches the old interface  
  const user = profile ? {
    id: parseInt(profile.user_id) || 1, // Convert to number for compatibility
    email: profile.email || '',
    name: profile.full_name || '',
    role: profile.role as 'admin' | 'team_chief' | 'team_responsible' | 'team_member' | 'assistant' | 'employee' | 'instructor',
    department: profile.department,
    teamId: profile.team ? parseInt(profile.team) : undefined
  } : null;

  return {
    user,
    profile,
    isAuthenticated: !!supabaseUser,
    login: () => {}, // Deprecated - use signIn instead
    logout: signOut,
    hasPermission: (permission: string) => {
      // Basic permission check based on role
      const rolePermissions = {
        admin: ['manage_users', 'manage_files', 'assign_tasks', 'view_analytics', 'manage_system', 'create_content', 'grade_assessments', 'view_files', 'download_files'],
        team_chief: ['manage_team', 'assign_tasks', 'view_files', 'view_analytics', 'manage_employees', 'download_files'],
        team_responsible: ['assign_tasks', 'view_files', 'manage_team_members', 'download_files'],
        team_member: ['view_files', 'upload_files', 'view_tasks', 'download_files'],
        assistant: ['view_files', 'edit_limited', 'support_tasks', 'download_files'],
        employee: ['view_files', 'download_files'],
        instructor: ['create_content', 'grade_assessments', 'view_analytics', 'view_files', 'download_files', 'manage_students']
      };
      
      if (!user) return false;
      return rolePermissions[user.role]?.includes(permission) || false;
    },
    canAccessFiles: () => {
      if (!user) return false;
      const filePermissions = ['view_files', 'manage_files'];
      const rolePermissions = {
        admin: ['manage_users', 'manage_files', 'assign_tasks', 'view_analytics', 'manage_system', 'create_content', 'grade_assessments', 'view_files', 'download_files'],
        team_chief: ['manage_team', 'assign_tasks', 'view_files', 'view_analytics', 'manage_employees', 'download_files'],
        team_responsible: ['assign_tasks', 'view_files', 'manage_team_members', 'download_files'],
        team_member: ['view_files', 'upload_files', 'view_tasks', 'download_files'],
        assistant: ['view_files', 'edit_limited', 'support_tasks', 'download_files'],
        employee: ['view_files', 'download_files'],
        instructor: ['create_content', 'grade_assessments', 'view_analytics', 'view_files', 'download_files', 'manage_students']
      };
      return rolePermissions[user.role]?.some(p => filePermissions.includes(p)) || false;
    },
    canManageUsers: () => {
      if (!user) return false;
      const userPermissions = ['manage_users', 'manage_employees'];
      const rolePermissions = {
        admin: ['manage_users', 'manage_files', 'assign_tasks', 'view_analytics', 'manage_system', 'create_content', 'grade_assessments', 'view_files', 'download_files'],
        team_chief: ['manage_team', 'assign_tasks', 'view_files', 'view_analytics', 'manage_employees', 'download_files'],
        team_responsible: ['assign_tasks', 'view_files', 'manage_team_members', 'download_files'],
        team_member: ['view_files', 'upload_files', 'view_tasks', 'download_files'],
        assistant: ['view_files', 'edit_limited', 'support_tasks', 'download_files'],
        employee: ['view_files', 'download_files'],
        instructor: ['create_content', 'grade_assessments', 'view_analytics', 'view_files', 'download_files', 'manage_students']
      };
      return rolePermissions[user.role]?.some(p => userPermissions.includes(p)) || false;
    },
    canAssignTasks: () => {
      if (!user) return false;
      const rolePermissions = {
        admin: ['manage_users', 'manage_files', 'assign_tasks', 'view_analytics', 'manage_system', 'create_content', 'grade_assessments', 'view_files', 'download_files'],
        team_chief: ['manage_team', 'assign_tasks', 'view_files', 'view_analytics', 'manage_employees', 'download_files'],
        team_responsible: ['assign_tasks', 'view_files', 'manage_team_members', 'download_files'],
        team_member: ['view_files', 'upload_files', 'view_tasks', 'download_files'],
        assistant: ['view_files', 'edit_limited', 'support_tasks', 'download_files'],
        employee: ['view_files', 'download_files'],
        instructor: ['create_content', 'grade_assessments', 'view_analytics', 'view_files', 'download_files', 'manage_students']
      };
      return rolePermissions[user.role]?.includes('assign_tasks') || false;
    },
    convertRole: (role: string | undefined): 'admin' | 'student' => {
      if (role === 'admin' || role === 'team_chief') {
        return 'admin';
      }
      return 'student';
    },
    getRoleDisplayName: (role: 'admin' | 'student'): string => {
      return role === 'admin' ? 'Administrateur' : 'Étudiant';
    },
    // Deprecated methods from old context
    notifications: [],
    addNotification: () => {},
    markNotificationRead: () => {},
    setModuleDeadline: (moduleId: string, deadline: string, teamMembers: string[]) => {
      // Implement with Supabase notifications via edge function
      console.log('setModuleDeadline called:', { moduleId, deadline, teamMembers });
      
      // Call Supabase edge function for notifications
      fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'deadline',
          moduleId,
          deadline,
          recipients: teamMembers
        })
      }).catch(err => console.error('Failed to send notifications:', err));
    }
  };
};