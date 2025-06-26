
import { useAuth } from "@/contexts/AuthContext";
import { useSessionManager } from "@/hooks/useSessionManager";

interface SessionWrapperProps {
  children: React.ReactNode;
}

const SessionWrapper = ({ children }: SessionWrapperProps) => {
  const { isAuthenticated } = useAuth();
  
  // Only manage session if user is authenticated
  if (isAuthenticated) {
    useSessionManager();
  }

  return <>{children}</>;
};

export default SessionWrapper;
