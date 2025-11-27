import { useQuery } from '@tanstack/react-query';
import { getProductService } from '../services';
import type { ProductFilters, PaginatedResponse, Product } from '../types';

/**
 * Query key factory for products
 */
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters?: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

/**
 * Hook to fetch products with filters
 * 
 * Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching on window focus
 * - Retry on failure with exponential backoff
 * 
 * @param filters - Optional filters for products
 * @returns Query result with products data
 */
export const useProducts = (filters?: ProductFilters) => {
  const productService = getProductService();

  return useQuery<PaginatedResponse<Product>, Error>({
    queryKey: productKeys.list(filters),
    queryFn: () => productService.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

/**
 * Hook to search products
 * 
 * @param query - Search query string
 * @param enabled - Whether the query should run
 * @returns Query result with search results
 */
export const useProductSearch = (query: string, enabled: boolean = true) => {
  const productService = getProductService();

  return useQuery<Product[], Error>({
    queryKey: productKeys.search(query),
    queryFn: () => productService.search(query),
    enabled: enabled && query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    gcTime: 5 * 60 * 1000,
  });
};
