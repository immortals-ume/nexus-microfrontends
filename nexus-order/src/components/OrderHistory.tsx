import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useOrders, orderKeys } from '../hooks/useOrders';
import { OrderCard } from './OrderCard';
import { Package } from 'lucide-react';
import { onOrderStatusChanged } from '../lib/eventBus';
import type { Order } from '../types';

interface OrderHistoryProps {
  userId: string;
  onOrderClick?: (order: Order) => void;
}

/**
 * OrderHistory component - List of customer's past orders
 * Validates: Requirements 8.1 - Display order history with all past orders
 * Validates: Requirements 8.3 - Update order display when status changes
 * Validates: Requirements 8.4 - Display message when no orders exist
 */
export function OrderHistory({ userId, onOrderClick }: OrderHistoryProps) {
  const queryClient = useQueryClient();
  const { data: orders, isLoading, error } = useOrders(userId);

  // Listen for order status change events
  useEffect(() => {
    const unsubscribe = onOrderStatusChanged((event) => {
      // Invalidate orders query to refetch updated data
      queryClient.invalidateQueries({ queryKey: orderKeys.list(userId) });
      // Also invalidate the specific order detail
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(event.orderId) });
    });

    return unsubscribe;
  }, [userId, queryClient]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 animate-pulse"
            style={{
              animationDelay: `${i * 0.1}s`,
              animationFillMode: 'backwards',
            }}
          >
            {/* Header skeleton */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-32 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 relative overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
              </div>
              <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded-full w-24 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
            {/* Items skeleton */}
            <div className="space-y-2 mb-4">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
            {/* Footer skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-28 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-32 relative overflow-hidden">
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 font-medium">Failed to load orders</p>
        <p className="text-sm text-red-500 mt-1">{error.message}</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-600 mb-6">
          You haven't placed any orders yet. Start shopping to see your orders here.
        </p>
        <button className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors">
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
          Order History
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </p>
      </div>
      {orders.map((order, index) => (
        <div
          key={order.id}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 0.05}s`,
            animationFillMode: 'backwards',
          }}
        >
          <OrderCard order={order} onClick={onOrderClick} />
        </div>
      ))}
    </div>
  );
}
