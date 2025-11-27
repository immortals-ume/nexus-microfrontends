import { useQuery } from '@tanstack/react-query';
import { mockOrderApi } from '../services/mockOrderService';
import type { Order } from '../types';

// Query keys
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (userId: string) => [...orderKeys.lists(), userId] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: string) => [...orderKeys.details(), id] as const,
};

/**
 * Hook to fetch all orders for a user
 * Validates: Requirements 8.1 - Display order history
 */
export function useOrders(userId: string) {
  return useQuery<Order[], Error>({
    queryKey: orderKeys.list(userId),
    queryFn: () => mockOrderApi.getAll(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!userId, // Only fetch if userId is provided
  });
}
