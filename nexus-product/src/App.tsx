import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductGrid } from './components/ProductGrid';
import { SearchBar } from './components/SearchBar';
import { FilterSidebar } from './components/FilterSidebar';
import { ProductDetail } from './pages/ProductDetail';
import { useProducts } from './hooks/useProducts';
import type { Product, ProductFilters, Category } from './types';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    },
  },
});

// Mock categories for demo
const mockCategories: Category[] = [
  { id: '1', name: 'Electronics', slug: 'electronics' },
  { id: '2', name: 'Clothing', slug: 'clothing' },
  { id: '3', name: 'Home & Garden', slug: 'home-garden' },
  { id: '4', name: 'Sports', slug: 'sports' },
];

function ProductCatalog() {
  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 12,
  });
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const { data, isLoading, error } = useProducts(filters);

  const handleSearch = (query: string) => {
    setFilters({
      ...filters,
      search: query,
      page: 1,
    });
  };

  const handleProductClick = (product: Product) => {
    setSelectedProductId(product.id);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProductId(product.id);
  };

  const handleBack = () => {
    setSelectedProductId(null);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    console.log('Add to cart:', product, quantity);
    // This will be integrated with Zustand store in the host application
  };

  if (selectedProductId) {
    return (
      <ProductDetail
        productId={selectedProductId}
        onBack={handleBack}
        onAddToCart={handleAddToCart}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Products
          </h1>
          <SearchBar
            onSearch={handleSearch}
            onProductSelect={handleProductSelect}
            className="max-w-2xl"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Hidden on mobile, shown in modal or as drawer */}
          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              categories={mockCategories}
            />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {error ? (
              <div className="text-center py-12">
                <p className="text-red-600 mb-4">
                  Failed to load products. Please try again.
                </p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                {data && (
                  <div className="mb-4 text-sm text-gray-600">
                    Showing {data.data.length} of {data.total} products
                  </div>
                )}
                <ProductGrid
                  products={data?.data || []}
                  isLoading={isLoading}
                  onProductClick={handleProductClick}
                />
                
                {/* Pagination */}
                {data && data.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    <button
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) - 1 })}
                      disabled={filters.page === 1}
                      className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2 text-sm text-gray-700">
                      Page {filters.page} of {data.totalPages}
                    </span>
                    <button
                      onClick={() => setFilters({ ...filters, page: (filters.page || 1) + 1 })}
                      disabled={filters.page === data.totalPages}
                      className="px-4 py-2 rounded-md border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ProductCatalog />
    </QueryClientProvider>
  );
}

export default App;
