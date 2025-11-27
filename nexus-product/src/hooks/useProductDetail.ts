import { useQuery } from '@tanstack/react-query';
import { getProductService } from '../services';
import type { Product } from '../types';
import { productKeys } from './useProducts';

/**
 * Hook to fetch a single product by ID
 * 
 * Features:
 * - Automatic caching with 5-minute stale time
 * - Background refetching on window focus
 * - Retry on failure with exponential backoff
 * 
 * @param id - Product ID
 * @returns Query result with product data
 */
export const useProductDetail = (id: string) => {
  const productService = getProductService();

  return useQuery<Product, Error>({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
