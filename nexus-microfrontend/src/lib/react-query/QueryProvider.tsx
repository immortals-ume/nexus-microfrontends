import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './queryClient';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * QueryProvider Component
 * 
 * Wraps the application with QueryClientProvider to enable React Query
 * throughout the component tree. Also includes React Query Devtools
 * in development mode for debugging.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}
