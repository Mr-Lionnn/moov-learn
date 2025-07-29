import { ReactNode } from 'react';
import { useAuth } from "@/hooks/useAuthCompatibility";

interface RoleBasedAccessProps {
  children: ReactNode;
  allowedRoles?: ('admin' | 'team_chief' | 'team_responsible' | 'team_member' | 'assistant' | 'employee' | 'instructor')[];
  requiredPermissions?: string[];
  fallback?: ReactNode;
  requireAll?: boolean; // If true, user must have ALL permissions. If false, ANY permission is enough
}

const RoleBasedAccess = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  fallback = null,
  requireAll = false
}: RoleBasedAccessProps) => {
  const { user, hasPermission } = useAuth();

  // If user is not authenticated, don't render
  if (!user) {
    return <>{fallback}</>;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll
      ? requiredPermissions.every(permission => hasPermission(permission))
      : requiredPermissions.some(permission => hasPermission(permission));

    if (!hasAccess) {
      return <>{fallback}</>;
    }
  }

  return <>{children}</>;
};

// Convenience components for common access patterns
export const AdminOnly = ({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) => (
  <RoleBasedAccess allowedRoles={['admin']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const ManagementOnly = ({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) => (
  <RoleBasedAccess allowedRoles={['admin', 'team_chief', 'team_responsible']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const FileAccessOnly = ({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) => (
  <RoleBasedAccess requiredPermissions={['view_files', 'manage_files']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export const TaskManagementOnly = ({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) => (
  <RoleBasedAccess requiredPermissions={['assign_tasks']} fallback={fallback}>
    {children}
  </RoleBasedAccess>
);

export default RoleBasedAccess;