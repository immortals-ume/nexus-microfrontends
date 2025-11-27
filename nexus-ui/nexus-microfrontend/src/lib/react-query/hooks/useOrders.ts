import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { ApiServiceFactory } from '../../../services/ApiServiceFactory';
import type { CreateOrderDto, OrderStatus } from '../../../services/types';

/**
 * Hook to fetch all orders for a user
 */
export function useOrders(userId: string) {
  const orderService = ApiServiceFactory.getOrderService();
  
  return useQuery({
    queryKey: queryKeys.orders.list(userId),
    queryFn: () => orderService.getAll(userId),
    enabled: !!userId, // Only fetch if userId is provided
  });
}

/**
 * Hook to fetch a single order by ID
 */
export function useOrder(id: string) {
  const orderService = ApiServiceFactory.getOrderService();
  
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderService.getById(id),
    enabled: !!id, // Only fetch if ID is provided
  });
}

/**
 * Hook to create a new order
 */
export function useCreateOrder() {
  const queryClient = useQueryClient();
  const orderService = ApiServiceFactory.getOrderService();
  
  return useMutation({
    mutationFn: (order: CreateOrderDto) => orderService.create(order),
    onSuccess: () => {
      // Invalidate all order lists to refetch with new order
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
      // Invalidate cart since order was created from cart
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

/**
 * Hook to update order status
 */
export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  const orderService = ApiServiceFactory.getOrderService();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      orderService.updateStatus(id, status),
    onSuccess: (data) => {
      // Invalidate the specific order detail
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(data.id) });
      // Invalidate all order lists
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
}

/**
 * Hook to cancel an order
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();
  const orderService = ApiServiceFactory.getOrderService();
  
  return useMutation({
    mutationFn: (id: string) => orderService.cancel(id),
    onSuccess: (_, id) => {
      // Invalidate the specific order detail
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      // Invalidate all order lists
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.lists() });
    },
  });
}
