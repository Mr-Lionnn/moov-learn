
import React, { createContext, useContext, useState, useEffect } from 'react';
import { secureStorage, validateSession } from '@/utils/security';

interface User {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'team_chief' | 'team_responsible' | 'team_member' | 'assistant' | 'employee';
  department?: string;
  teamId?: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'deadline' | 'info' | 'warning';
  timestamp: Date;
  read: boolean;
  moduleId?: string;
  deadline?: string;
}

interface AuthContextType {
  user: User | null;
  notifications: Notification[];
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  canAccessFiles: () => boolean;
  canManageUsers: () => boolean;
  canAssignTasks: () => boolean;
  convertRole: (role: string | undefined) => 'admin' | 'student';
  getRoleDisplayName: (role: 'admin' | 'student') => string;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  setModuleDeadline: (moduleId: string, deadline: string, teamMembers: string[]) => void;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Check if user is stored in secure storage on app load
    const storedUser = secureStorage.getItem('user');
    const storedNotifications = secureStorage.getItem('notifications');
    const sessionData = secureStorage.getItem('session');
    
    // Validate session before restoring user
    if (storedUser && sessionData && validateSession(sessionData)) {
      setUser(storedUser);
    } else {
      // Clear invalid session data
      secureStorage.removeItem('user');
      secureStorage.removeItem('session');
    }
    
    if (storedNotifications) {
      setNotifications(storedNotifications);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    const sessionData = {
      userId: userData.id,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };
    secureStorage.setItem('user', userData);
    secureStorage.setItem('session', sessionData);
  };

  const logout = () => {
    setUser(null);
    setNotifications([]);
    secureStorage.removeItem('user');
    secureStorage.removeItem('session');
    secureStorage.removeItem('notifications');
    localStorage.removeItem('moov_learn_session');
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false
    };
    
    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    secureStorage.setItem('notifications', updatedNotifications);
  };

  const markNotificationRead = (id: string) => {
    const updatedNotifications = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    setNotifications(updatedNotifications);
    secureStorage.setItem('notifications', updatedNotifications);
  };

  const setModuleDeadline = (moduleId: string, deadline: string, teamMembers: string[]) => {
    const moduleNames: { [key: string]: string } = {
      'tcp-ip': 'Fondamentaux des Réseaux TCP/IP',
      'security': 'Sécurité Informatique Avancée',
      'linux-admin': 'Administration Système Linux',
      'cloud-basics': 'Introduction au Cloud Computing'
    };

    const moduleName = moduleNames[moduleId] || moduleId;
    const deadlineDate = new Date(deadline);

    // Add notification for each team member
    teamMembers.forEach(() => {
      addNotification({
        title: 'Nouveau Délai de Formation',
        message: `Vous devez terminer le module "${moduleName}" avant le ${deadlineDate.toLocaleDateString('fr-FR')} à ${deadlineDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        type: 'deadline',
        moduleId,
        deadline
      });
    });
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

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ 
      user, 
      notifications,
      login, 
      logout, 
      isAuthenticated, 
      hasPermission, 
      canAccessFiles, 
      canManageUsers, 
      canAssignTasks,
      convertRole,
      getRoleDisplayName,
      addNotification,
      markNotificationRead,
      setModuleDeadline
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
