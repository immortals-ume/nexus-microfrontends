import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { ApiServiceFactory } from '../../../services/ApiServiceFactory';

/**
 * Hook to fetch the current user's cart
 */
export function useCart() {
  const orderService = ApiServiceFactory.getOrderService();
  
  return useQuery({
    queryKey: queryKeys.cart.current(),
    queryFn: () => orderService.getCart(),
  });
}

/**
 * Hook to add an item to cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();
  const orderService = ApiServiceFactory.getOrderService();
  
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      orderService.addToCart(productId, quantity),
    onSuccess: () => {
      // Invalidate cart queries to refetch updated cart
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

/**
 * Hook to update cart item quantity
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  const orderService = ApiServiceFactory.getOrderService();
  
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      orderService.updateCartItem(itemId, quantity),
    onSuccess: () => {
      // Invalidate cart queries to refetch updated cart
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

/**
 * Hook to remove an item from cart
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const orderService = ApiServiceFactory.getOrderService();
  
  return useMutation({
    mutationFn: (itemId: string) => orderService.removeFromCart(itemId),
    onSuccess: () => {
      // Invalidate cart queries to refetch updated cart
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}

/**
 * Hook to clear the entire cart
 */
export function useClearCart() {
  const queryClient = useQueryClient();
  const orderService = ApiServiceFactory.getOrderService();
  
  return useMutation({
    mutationFn: () => orderService.clearCart(),
    onSuccess: () => {
      // Invalidate cart queries to refetch empty cart
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
    },
  });
}
