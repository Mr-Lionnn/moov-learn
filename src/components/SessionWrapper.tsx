
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
import { useSessionManager } from "@/hooks/useSessionManager";

interface SessionWrapperProps {
  children: React.ReactNode;
}

const SessionWrapper = ({ children }: SessionWrapperProps) => {
  const { user } = useSupabaseAuth();
  
  // Always call hook (no conditional calling)
  useSessionManager(false); // Use non-strict mode to prevent blank pages

  return <>{children}</>;
};

export default SessionWrapper;
