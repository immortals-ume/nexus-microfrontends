import { useQuery } from '@tanstack/react-query';
import { mockOrderApi } from '../services/mockOrderService';
import type { Order } from '../types';
import { orderKeys } from './useOrders';

/**
 * Hook to fetch a single order by ID
 * Validates: Requirements 8.2 - Display detailed order information
 */
export function useOrderDetail(orderId: string | undefined) {
  return useQuery<Order, Error>({
    queryKey: orderKeys.detail(orderId || ''),
    queryFn: () => {
      if (!orderId) {
        throw new Error('Order ID is required');
      }
      return mockOrderApi.getById(orderId);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: !!orderId, // Only fetch if orderId is provided
  });
}
