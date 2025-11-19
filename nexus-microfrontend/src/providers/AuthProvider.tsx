import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useStore } from '../store';

interface AuthContextValue {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
  register: (data: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider Component
 * 
 * Provides authentication context to the entire application.
 * Wraps Zustand auth slice with React Context for easier consumption.
 * 
 * Features:
 * - Exposes auth state and methods via context
 * - Automatically restores session on mount
 * - Provides type-safe auth context
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useStore((state) => state.auth);

  // Restore session on mount if token exists
  useEffect(() => {
    if (auth.token && !auth.user) {
      // Token exists but user not loaded - attempt to restore session
      auth.refreshAuthToken?.().catch(() => {
        // If refresh fails, clear auth state
        auth.logout();
      });
    }
  }, []);

  const value: AuthContextValue = {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    login: auth.login,
    logout: auth.logout,
    register: auth.register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth Hook
 * 
 * Custom hook to access authentication context.
 * Throws error if used outside AuthProvider.
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
