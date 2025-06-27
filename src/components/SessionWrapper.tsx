
import { useAuth } from "@/contexts/AuthContext";
import { useSessionManager } from "@/hooks/useSessionManager";
import { useQuizManager } from "@/hooks/useQuizManager";

interface SessionWrapperProps {
  children: React.ReactNode;
}

const SessionWrapper = ({ children }: SessionWrapperProps) => {
  const { isAuthenticated } = useAuth();
  const { isQuizActive } = useQuizManager();
  
  // Only enforce strict session management if user is authenticated AND actively taking a quiz
  if (isAuthenticated) {
    useSessionManager(isQuizActive);
  }

  return <>{children}</>;
};

export default SessionWrapper;
