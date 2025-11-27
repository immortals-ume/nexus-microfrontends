import React, { useState, useEffect, useRef } from 'react';
import { useProductSearch } from '../hooks/useProducts';
import type { Product } from '../types';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onProductSelect?: (product: Product) => void;
  placeholder?: string;
  className?: string;
}

/**
 * SearchBar Component
 * 
 * Features:
 * - Real-time search with autocomplete
 * - Debounced search to reduce API calls
 * - Keyboard navigation for autocomplete results
 * - Click outside to close autocomplete
 * 
 * Requirements: 2.2, 15.1
 */
export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onProductSelect,
  placeholder = 'Search products...',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch autocomplete results
  const { data: searchResults = [], isLoading } = useProductSearch(
    debouncedQuery,
    debouncedQuery.length >= 2
  );

  // Show autocomplete when we have results
  useEffect(() => {
    setShowAutocomplete(searchResults.length > 0 && query.length >= 2);
    setSelectedIndex(-1);
  }, [searchResults, query]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowAutocomplete(false);
      inputRef.current?.blur();
    }
  };

  const handleProductClick = (product: Product) => {
    setQuery('');
    setShowAutocomplete(false);
    if (onProductSelect) {
      onProductSelect(product);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showAutocomplete || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          handleProductClick(searchResults[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        setShowAutocomplete(false);
        setSelectedIndex(-1);
        break;
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            aria-label="Search products"
            aria-autocomplete="list"
            aria-controls="search-autocomplete"
            aria-expanded={showAutocomplete}
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-5 w-5 animate-spin text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>
      </form>

      {/* Autocomplete Dropdown */}
      {showAutocomplete && (
        <div
          id="search-autocomplete"
          className="absolute z-10 mt-1 w-full rounded-lg bg-white shadow-lg border border-gray-200 max-h-96 overflow-auto"
          role="listbox"
        >
          {searchResults.map((product, index) => {
            const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
            return (
              <div
                key={product.id}
                onClick={() => handleProductClick(product)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-primary-50'
                    : 'hover:bg-gray-50'
                }`}
                role="option"
                aria-selected={index === selectedIndex}
              >
                {primaryImage && (
                  <img
                    src={primaryImage.url}
                    alt={product.name}
                    className="h-12 w-12 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
