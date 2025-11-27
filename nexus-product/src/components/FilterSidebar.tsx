import React, { useState } from 'react';
import type { ProductFilters, Category } from '../types';

interface FilterSidebarProps {
  filters: ProductFilters;
  onFiltersChange: (filters: ProductFilters) => void;
  categories?: Category[];
  className?: string;
}

/**
 * FilterSidebar Component
 * 
 * Features:
 * - Category filter
 * - Price range filter
 * - Sort options
 * - Clear all filters
 * 
 * Requirements: 2.3, 2.4, 15.2, 15.3
 */
export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFiltersChange,
  categories = [],
  className = '',
}) => {
  const [minPrice, setMinPrice] = useState(filters.minPrice?.toString() || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice?.toString() || '');

  const handleCategoryChange = (categoryId: string) => {
    onFiltersChange({
      ...filters,
      categoryId: filters.categoryId === categoryId ? undefined : categoryId,
      page: 1, // Reset to first page
    });
  };

  const handlePriceChange = () => {
    const min = minPrice ? parseFloat(minPrice) : undefined;
    const max = maxPrice ? parseFloat(maxPrice) : undefined;

    if (min !== undefined && max !== undefined && min > max) {
      return; // Invalid range
    }

    onFiltersChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
      page: 1,
    });
  };

  const handleSortChange = (sortBy: ProductFilters['sortBy']) => {
    onFiltersChange({
      ...filters,
      sortBy,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    setMinPrice('');
    setMaxPrice('');
    onFiltersChange({
      page: 1,
      limit: filters.limit,
    });
  };

  const hasActiveFilters =
    filters.categoryId ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    filters.sortBy;

  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      {categories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={filters.categoryId === category.id}
                  onChange={() => handleCategoryChange(category.id)}
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                  {category.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
        <div className="space-y-3">
          <div>
            <label htmlFor="min-price" className="sr-only">
              Minimum price
            </label>
            <input
              id="min-price"
              type="number"
              min="0"
              step="0.01"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
            />
          </div>
          <div>
            <label htmlFor="max-price" className="sr-only">
              Maximum price
            </label>
            <input
              id="max-price"
              type="number"
              min="0"
              step="0.01"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
            />
          </div>
          <button
            onClick={handlePriceChange}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Sort By */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
        <div className="space-y-2">
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="sort"
              checked={!filters.sortBy || filters.sortBy === 'newest'}
              onChange={() => handleSortChange('newest')}
              className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
              Newest
            </span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="sort"
              checked={filters.sortBy === 'price_asc'}
              onChange={() => handleSortChange('price_asc')}
              className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
              Price: Low to High
            </span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="sort"
              checked={filters.sortBy === 'price_desc'}
              onChange={() => handleSortChange('price_desc')}
              className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
              Price: High to Low
            </span>
          </label>
          <label className="flex items-center cursor-pointer group">
            <input
              type="radio"
              name="sort"
              checked={filters.sortBy === 'rating'}
              onChange={() => handleSortChange('rating')}
              className="h-4 w-4 border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
              Highest Rated
            </span>
          </label>
        </div>
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Active Filters
          </h3>
          <div className="flex flex-wrap gap-2">
            {filters.categoryId && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                {categories.find((c) => c.id === filters.categoryId)?.name}
                <button
                  onClick={() => handleCategoryChange(filters.categoryId!)}
                  className="hover:text-primary-900"
                  aria-label="Remove category filter"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            )}
            {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                <button
                  onClick={() => {
                    setMinPrice('');
                    setMaxPrice('');
                    onFiltersChange({
                      ...filters,
                      minPrice: undefined,
                      maxPrice: undefined,
                    });
                  }}
                  className="hover:text-primary-900"
                  aria-label="Remove price filter"
                >
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
