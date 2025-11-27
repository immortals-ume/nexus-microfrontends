import "@module-federation/runtime";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './utils/eventBus'
import { QueryProvider } from './lib/react-query/QueryProvider'
import { AuthProvider, ThemeProvider } from './providers'
import { useStore } from './store'
import { ApiServiceFactory } from './services/ApiServiceFactory'


/**
 * Application Entry Point
 * 
 * Provider hierarchy (outer to inner):
 * 1. StrictMode - React development checks
 * 2. QueryProvider - React Query for data fetching
 * 3. ThemeProvider - Theme management
 * 4. AuthProvider - Authentication context
 * 5. App - Main application component
 * 
 * Note: Zustand store is accessed directly via useStore hook,
 * no provider needed as it's a singleton.
 */

// Expose store and services globally for microfrontends
if (typeof window !== 'undefined') {
  (window as any).useStore = useStore;
  (window as any).ApiServiceFactory = ApiServiceFactory;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </QueryProvider>
  </StrictMode>,
)
