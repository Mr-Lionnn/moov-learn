
import { useAuth } from "@/contexts/AuthContext";
import { useSessionManager } from "@/hooks/useSessionManager";

interface SessionWrapperProps {
  children: React.ReactNode;
}

const SessionWrapper = ({ children }: SessionWrapperProps) => {
  const { isAuthenticated } = useAuth();
  
  // Only enforce strict session management if user is authenticated
  // For now, we'll set isQuizActive to false by default to prevent session conflicts
  if (isAuthenticated) {
    useSessionManager(false); // Always use non-strict mode to prevent blank pages
  }

  return <>{children}</>;
};

export default SessionWrapper;
