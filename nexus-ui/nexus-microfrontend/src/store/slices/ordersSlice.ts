import type { StateCreator } from 'zustand';
import type { AppStore, OrdersSlice, Order } from '../types';

export const createOrdersSlice: StateCreator<
  AppStore,
  [],
  [],
  OrdersSlice
> = (set) => ({
  items: [],
  selectedOrder: null,
  isLoading: false,
  error: null,

  setItems: (items: Order[]) => {
    set((state) => ({
      orders: { ...state.orders, items },
    }));
  },

  setSelectedOrder: (order: Order | null) => {
    set((state) => ({
      orders: { ...state.orders, selectedOrder: order },
    }));
  },

  setLoading: (isLoading: boolean) => {
    set((state) => ({
      orders: { ...state.orders, isLoading },
    }));
  },

  setError: (error: string | null) => {
    set((state) => ({
      orders: { ...state.orders, error },
    }));
  },

  clearError: () => {
    set((state) => ({
      orders: { ...state.orders, error: null },
    }));
  },
});
