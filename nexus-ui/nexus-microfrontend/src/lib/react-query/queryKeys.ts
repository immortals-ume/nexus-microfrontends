/**
 * Query Key Factory
 * 
 * Provides a centralized, type-safe way to generate query keys for React Query.
 * This ensures consistency across the application and makes it easier to
 * invalidate related queries.
 * 
 * Pattern:
 * - Base keys: ['products'], ['orders'], ['cart']
 * - List keys: ['products', 'list', filters]
 * - Detail keys: ['products', 'detail', id]
 */

import type { ProductFilters } from '../../services/types';

export const queryKeys = {
  /**
   * Product query keys
   */
  products: {
    // Base key for all product queries
    all: ['products'] as const,
    
    // Keys for product lists
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters?: ProductFilters) => [...queryKeys.products.lists(), filters] as const,
    
    // Keys for product details
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
    
    // Keys for product search
    search: (query: string) => [...queryKeys.products.all, 'search', query] as const,
  },
  
  /**
   * Cart query keys
   */
  cart: {
    // Base key for cart
    all: ['cart'] as const,
    
    // Current user's cart
    current: () => [...queryKeys.cart.all, 'current'] as const,
    
    // Cart items
    items: () => [...queryKeys.cart.all, 'items'] as const,
  },
  
  /**
   * Order query keys
   */
  orders: {
    // Base key for all order queries
    all: ['orders'] as const,
    
    // Keys for order lists
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (userId?: string) => [...queryKeys.orders.lists(), userId] as const,
    
    // Keys for order details
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
  },
  
  /**
   * Customer query keys
   */
  customer: {
    // Base key for customer data
    all: ['customer'] as const,
    
    // Customer profile
    profile: () => [...queryKeys.customer.all, 'profile'] as const,
    
    // Customer addresses
    addresses: () => [...queryKeys.customer.all, 'addresses'] as const,
    address: (id: string) => [...queryKeys.customer.addresses(), id] as const,
    
    // Customer payment methods
    paymentMethods: () => [...queryKeys.customer.all, 'payment-methods'] as const,
    paymentMethod: (id: string) => [...queryKeys.customer.paymentMethods(), id] as const,
  },
  
  /**
   * Notification query keys
   */
  notifications: {
    // Base key for notifications
    all: ['notifications'] as const,
    
    // Notification list
    list: () => [...queryKeys.notifications.all, 'list'] as const,
    
    // Unread count
    unreadCount: () => [...queryKeys.notifications.all, 'unread-count'] as const,
  },
  
  /**
   * Analytics query keys
   */
  analytics: {
    // Base key for analytics
    all: ['analytics'] as const,
    
    // Dashboard metrics
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    
    // Sales data
    sales: (startDate?: string, endDate?: string) => 
      [...queryKeys.analytics.all, 'sales', { startDate, endDate }] as const,
    
    // Product performance
    productPerformance: () => [...queryKeys.analytics.all, 'product-performance'] as const,
  },
} as const;

/**
 * Helper type to extract query key types
 */
export type QueryKeys = typeof queryKeys;

/**
 * Example usage:
 * 
 * // Fetch products with filters
 * useQuery({
 *   queryKey: queryKeys.products.list({ category: 'electronics' }),
 *   queryFn: () => api.products.getAll({ category: 'electronics' })
 * })
 * 
 * // Invalidate all product queries
 * queryClient.invalidateQueries({ queryKey: queryKeys.products.all })
 * 
 * // Invalidate specific product detail
 * queryClient.invalidateQueries({ queryKey: queryKeys.products.detail('123') })
 */
