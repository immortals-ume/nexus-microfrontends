# React Query Configuration

This directory contains the React Query (TanStack Query) configuration for the Nexus e-commerce application.

## Overview

React Query is used for:
- Server state management and caching
- Data fetching with automatic retries
- Optimistic updates
- Background refetching
- Cache invalidation

## Configuration

### QueryClient (`queryClient.ts`)

The QueryClient is configured with the following defaults:

- **Stale Time**: 5 minutes - Data is considered fresh for 5 minutes
- **Cache Time (gcTime)**: 10 minutes - Unused data is kept in cache for 10 minutes
- **Retry**: 3 attempts with exponential backoff (1s, 2s, 4s, max 30s)
- **Refetch on Window Focus**: Enabled - Refetches when window regains focus
- **Refetch on Reconnect**: Enabled - Refetches when network reconnects

### Query Keys (`queryKeys.ts`)

Query keys are organized hierarchically for easy cache management:

```typescript
// Products
queryKeys.products.all           // ['products']
queryKeys.products.lists()       // ['products', 'list']
queryKeys.products.list(filters) // ['products', 'list', filters]
queryKeys.products.detail(id)    // ['products', 'detail', id]

// Cart
queryKeys.cart.all              // ['cart']
queryKeys.cart.current()        // ['cart', 'current']

// Orders
queryKeys.orders.all            // ['orders']
queryKeys.orders.list(userId)   // ['orders', 'list', userId]
queryKeys.orders.detail(id)     // ['orders', 'detail', id]
```

## Usage

### Basic Query

```typescript
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { ApiServiceFactory } from '@/services';

function ProductList() {
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.products.list({ category: 'electronics' }),
    queryFn: () => ApiServiceFactory.getProductService().getAll({ category: 'electronics' })
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{/* Render products */}</div>;
}
```

### Using Custom Hooks

```typescript
import { useProducts, useCreateProduct } from '@/lib/react-query/hooks';

function ProductList() {
  const { data, isLoading } = useProducts({ category: 'electronics' });
  const createProduct = useCreateProduct();

  const handleCreate = async () => {
    await createProduct.mutateAsync({
      name: 'New Product',
      price: 99.99,
      // ...
    });
  };

  return <div>{/* Render products */}</div>;
}
```

### Mutation with Optimistic Update

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';

function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }) => api.products.update(id, product),
    
    // Optimistic update
    onMutate: async ({ id, product }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.products.detail(id) });
      
      // Snapshot previous value
      const previous = queryClient.getQueryData(queryKeys.products.detail(id));
      
      // Optimistically update
      queryClient.setQueryData(queryKeys.products.detail(id), product);
      
      return { previous };
    },
    
    // Rollback on error
    onError: (err, { id }, context) => {
      queryClient.setQueryData(queryKeys.products.detail(id), context.previous);
    },
    
    // Refetch after mutation
    onSettled: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.detail(id) });
    },
  });
}
```

### Cache Invalidation

```typescript
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';

function MyComponent() {
  const queryClient = useQueryClient();

  // Invalidate all product queries
  queryClient.invalidateQueries({ queryKey: queryKeys.products.all });

  // Invalidate specific product
  queryClient.invalidateQueries({ queryKey: queryKeys.products.detail('123') });

  // Invalidate all product lists
  queryClient.invalidateQueries({ queryKey: queryKeys.products.lists() });
}
```

## Custom Hooks

Pre-built hooks are available in the `hooks/` directory:

### Product Hooks
- `useProducts(filters)` - Fetch products with filters
- `useProduct(id)` - Fetch single product
- `useProductSearch(query)` - Search products
- `useCreateProduct()` - Create product mutation
- `useUpdateProduct()` - Update product mutation
- `useDeleteProduct()` - Delete product mutation

### Order Hooks
- `useOrders(userId)` - Fetch user orders
- `useOrder(id)` - Fetch single order
- `useCreateOrder()` - Create order mutation
- `useUpdateOrderStatus()` - Update order status mutation
- `useCancelOrder()` - Cancel order mutation

### Cart Hooks
- `useCart()` - Fetch current cart
- `useAddToCart()` - Add item to cart mutation
- `useUpdateCartItem()` - Update cart item mutation
- `useRemoveFromCart()` - Remove item from cart mutation
- `useClearCart()` - Clear cart mutation

## Provider Setup

Wrap your application with the `QueryProvider`:

```typescript
import { QueryProvider } from '@/lib/react-query';

function App() {
  return (
    <QueryProvider>
      {/* Your app */}
    </QueryProvider>
  );
}
```

The provider includes React Query Devtools in development mode for debugging.

## Best Practices

1. **Use Query Keys Factory**: Always use the `queryKeys` factory for consistency
2. **Invalidate Related Queries**: After mutations, invalidate related queries
3. **Optimistic Updates**: Use for better UX on mutations
4. **Error Handling**: Handle errors gracefully with error boundaries
5. **Loading States**: Always show loading indicators
6. **Stale Time**: Adjust based on data volatility
7. **Prefetching**: Prefetch data for predictable navigation

## Testing

When testing components that use React Query:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react';

function renderWithQuery(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
}
```

## References

- [React Query Documentation](https://tanstack.com/query/latest)
- [Query Keys Guide](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [Mutations Guide](https://tanstack.com/query/latest/docs/react/guides/mutations)
