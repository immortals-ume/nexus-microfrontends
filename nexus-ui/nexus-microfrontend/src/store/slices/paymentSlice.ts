import type { StateCreator } from 'zustand';
import type { AppStore, PaymentSlice, PaymentIntent, PaymentMethod } from '../types';

export const createPaymentSlice: StateCreator<
  AppStore,
  [],
  [],
  PaymentSlice
> = (set) => ({
  paymentIntent: null,
  selectedMethod: null,
  isProcessing: false,
  error: null,

  setPaymentIntent: (intent: PaymentIntent | null) => {
    set((state) => ({
      payment: { ...state.payment, paymentIntent: intent },
    }));
  },

  setSelectedMethod: (method: PaymentMethod | null) => {
    set((state) => ({
      payment: { ...state.payment, selectedMethod: method },
    }));
  },

  setProcessing: (isProcessing: boolean) => {
    set((state) => ({
      payment: { ...state.payment, isProcessing },
    }));
  },

  setError: (error: string | null) => {
    set((state) => ({
      payment: { ...state.payment, error },
    }));
  },

  clearError: () => {
    set((state) => ({
      payment: { ...state.payment, error: null },
    }));
  },
});
