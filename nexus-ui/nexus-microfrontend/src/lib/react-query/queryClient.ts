import { QueryClient } from '@tanstack/react-query';

/**
 * React Query Client Configuration
 * 
 * Configures the QueryClient with default options for:
 * - Stale time: 5 minutes (data considered fresh for 5 minutes)
 * - Cache time: 10 minutes (unused data kept in cache for 10 minutes)
 * - Retry logic: 3 attempts with exponential backoff
 * - Refetch on window focus and reconnect
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000, // 5 minutes
      
      // Unused data is kept in cache for 10 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      
      // Retry failed requests up to 3 times
      retry: 3,
      
      // Exponential backoff: 1s, 2s, 4s, max 30s
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch when window regains focus
      refetchOnWindowFocus: true,
      
      // Refetch when network reconnects
      refetchOnReconnect: true,
      
      // Don't refetch on mount if data is fresh
      refetchOnMount: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
    },
  },
});
