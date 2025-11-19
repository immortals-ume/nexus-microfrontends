import { type StateCreator } from 'zustand';
import type { AppStore, ProductsSlice, Product, ProductFilters } from '../types';

export const createProductsSlice: StateCreator<
  AppStore,
  [],
  [],
  ProductsSlice
> = (set) => ({
  items: [],
  selectedProduct: null,
  filters: {},
  isLoading: false,
  error: null,

  setItems: (items: Product[]) => {
    set((state) => ({
      products: { ...state.products, items },
    }));
  },

  setFilters: (filters: ProductFilters) => {
    set((state) => ({
      products: { ...state.products, filters },
    }));
  },

  setSelectedProduct: (product: Product | null) => {
    set((state) => ({
      products: { ...state.products, selectedProduct: product },
    }));
  },

  setLoading: (isLoading: boolean) => {
    set((state) => ({
      products: { ...state.products, isLoading },
    }));
  },

  setError: (error: string | null) => {
    set((state) => ({
      products: { ...state.products, error },
    }));
  },

  clearError: () => {
    set((state) => ({
      products: { ...state.products, error: null },
    }));
  },
});
