import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '../queryKeys';
import { ApiServiceFactory } from '../../../services/ApiServiceFactory';
import type { ProductFilters, CreateProductDto, UpdateProductDto } from '../../../services/types';

/**
 * Hook to fetch products with filters
 */
export function useProducts(filters?: ProductFilters) {
  const productService = ApiServiceFactory.getProductService();
  
  return useQuery({
    queryKey: queryKeys.products.list(filters),
    queryFn: () => productService.getAll(filters),
  });
}

/**
 * Hook to fetch a single product by ID
 */
export function useProduct(id: string) {
  const productService = ApiServiceFactory.getProductService();
  
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id, // Only fetch if ID is provided
  });
}

/**
 * Hook to search products
 */
export function useProductSearch(query: string) {
  const productService = ApiServiceFactory.getProductService();
  
  return useQuery({
    queryKey: queryKeys.products.search(query),
    queryFn: () => productService.search(query),
    enabled: query.length > 0, // Only search if query is not empty
  });
}

/**
 * Hook to create a new product
 */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const productService = ApiServiceFactory.getProductService();
  
  return useMutation({
    mutationFn: (product: CreateProductDto) => productService.create(product),
    onSuccess: () => {
      // Invalidate all product lists to refetch with new product
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}

/**
 * Hook to update a product
 */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const productService = ApiServiceFactory.getProductService();
  
  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: UpdateProductDto }) =>
      productService.update(id, product),
    onSuccess: (data) => {
      // Invalidate the specific product detail
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(data.id) });
      // Invalidate all product lists
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}

/**
 * Hook to delete a product
 */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const productService = ApiServiceFactory.getProductService();
  
  return useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: (_, id) => {
      // Remove the product from cache
      queryClient.removeQueries({ queryKey: queryKeys.products.detail(id) });
      // Invalidate all product lists
      queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
    },
  });
}
