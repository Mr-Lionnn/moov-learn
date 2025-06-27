
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const SESSION_KEY = 'moov_learn_session';
const HEARTBEAT_INTERVAL = 5000; // 5 seconds

export const useSessionManager = (enforceStrictMode = false) => {
  const { logout } = useAuth();
  const sessionId = useRef<string>('');
  const heartbeatInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Generate unique session ID
    sessionId.current = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    if (enforceStrictMode) {
      // Check for existing session
      const existingSession = localStorage.getItem(SESSION_KEY);
      if (existingSession && existingSession !== sessionId.current) {
        // Another session exists, force logout
        logout();
        alert('Cette session a été fermée car un quiz est en cours dans un autre onglet.');
        return;
      }

      // Set current session
      localStorage.setItem(SESSION_KEY, sessionId.current);

      // Start heartbeat to maintain session
      const startHeartbeat = () => {
        heartbeatInterval.current = setInterval(() => {
          const currentSession = localStorage.getItem(SESSION_KEY);
          if (currentSession !== sessionId.current) {
            // Session hijacked by another tab
            logout();
            alert('Cette session a été fermée car un quiz est en cours dans un autre onglet.');
            if (heartbeatInterval.current) {
              clearInterval(heartbeatInterval.current);
            }
          } else {
            // Update timestamp to show activity
            localStorage.setItem(SESSION_KEY, sessionId.current);
          }
        }, HEARTBEAT_INTERVAL);
      };

      startHeartbeat();

      // Listen for storage changes (other tabs)
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === SESSION_KEY && e.newValue !== sessionId.current) {
          logout();
          alert('Cette session a été fermée car un quiz est en cours dans un autre onglet.');
          if (heartbeatInterval.current) {
            clearInterval(heartbeatInterval.current);
          }
        }
      };

      // Listen for page visibility changes
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          const currentSession = localStorage.getItem(SESSION_KEY);
          if (currentSession !== sessionId.current) {
            logout();
            alert('Cette session a été fermée car un quiz est en cours dans un autre onglet.');
          }
        }
      };

      window.addEventListener('storage', handleStorageChange);
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Cleanup function
      return () => {
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
        }
        window.removeEventListener('storage', handleStorageChange);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        
        // Only clear session if it's still ours
        const currentSession = localStorage.getItem(SESSION_KEY);
        if (currentSession === sessionId.current) {
          localStorage.removeItem(SESSION_KEY);
        }
      };
    } else {
      // In normal browsing mode, just set a session marker without strict enforcement
      localStorage.setItem(`${SESSION_KEY}_browse`, sessionId.current);
      
      // Simple cleanup for normal mode
      return () => {
        const currentSession = localStorage.getItem(`${SESSION_KEY}_browse`);
        if (currentSession === sessionId.current) {
          localStorage.removeItem(`${SESSION_KEY}_browse`);
        }
      };
    }
  }, [logout, enforceStrictMode]);

  return sessionId.current;
};
