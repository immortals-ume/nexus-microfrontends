import React from 'react';
import { ProductCard } from './ProductCard';
import type { Product } from '../types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  onProductClick?: (product: Product) => void;
}

/**
 * Product Card Skeleton Loader
 * Shimmer effect skeleton that matches ProductCard structure
 */
const ProductCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    {/* Image skeleton with shimmer */}
    <div className="relative aspect-square bg-gray-200 overflow-hidden">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
    {/* Content skeleton */}
    <div className="p-4 space-y-3">
      <div className="h-5 bg-gray-200 rounded w-3/4 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="h-6 bg-gray-200 rounded w-1/3 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
        <div className="h-9 bg-gray-200 rounded w-24 relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>
    </div>
  </div>
);

/**
 * ProductGrid Component
 * 
 * Displays products in a responsive grid layout with:
 * - 1 column on mobile (< 640px)
 * - 2 columns on small tablets (640px - 1023px)
 * - 3 columns on desktop (1024px - 1279px)
 * - 4 columns on large screens (>= 1280px)
 * - Skeleton loaders with shimmer effect during loading
 * - Staggered fade-in animation for products
 * 
 * Requirements: 2.1, 2.5, 9.2, 9.6
 */
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  onProductClick,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {[...Array(12)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product, index) => (
        <div
          key={product.id}
          className="animate-fade-in"
          style={{
            animationDelay: `${index * 0.05}s`,
            animationFillMode: 'backwards',
          }}
        >
          <ProductCard
            product={product}
            onClick={onProductClick}
          />
        </div>
      ))}
    </div>
  );
};
