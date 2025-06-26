
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'team_chief' | 'team_responsible' | 'team_member' | 'assistant' | 'employee';
  department?: string;
  teamId?: number;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  canAccessFiles: () => boolean;
  canManageUsers: () => boolean;
  canAssignTasks: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define role permissions
const rolePermissions = {
  admin: ['manage_users', 'manage_files', 'assign_tasks', 'view_analytics', 'manage_system'],
  team_chief: ['manage_team', 'assign_tasks', 'view_files', 'view_analytics', 'manage_employees'],
  team_responsible: ['assign_tasks', 'view_files', 'manage_team_members'],
  team_member: ['view_files', 'upload_files', 'view_tasks'],
  assistant: ['view_files', 'edit_limited', 'support_tasks'],
  employee: ['view_files', 'download_files']
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is stored in localStorage on app load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
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

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated, 
      hasPermission, 
      canAccessFiles, 
      canManageUsers, 
      canAssignTasks 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
