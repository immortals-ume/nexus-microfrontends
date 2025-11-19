import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { useStore } from '../store';

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

/**
 * ThemeProvider Component
 * 
 * Provides theme management context to the entire application.
 * Wraps Zustand UI slice theme state with React Context.
 * 
 * Features:
 * - Manages light/dark theme
 * - Persists theme preference to localStorage
 * - Applies theme class to document root
 * - Provides theme toggle functionality
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useStore((state) => state.ui.theme);
  const setTheme = useStore((state) => state.ui.setTheme);

  // Apply theme class to document root
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Also set data attribute for CSS selectors
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextValue = {
    theme,
    setTheme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * useTheme Hook
 * 
 * Custom hook to access theme context.
 * Throws error if used outside ThemeProvider.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
