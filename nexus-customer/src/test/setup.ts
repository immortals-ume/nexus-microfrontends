/* eslint-disable @typescript-eslint/no-explicit-any */
import '@testing-library/jest-dom';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window objects that would be provided by the host
(globalThis as any).window = {
  ...(globalThis as any).window,
  ApiServiceFactory: {
    getCustomerService: vi.fn(() => ({
      getProfile: vi.fn(),
      updateProfile: vi.fn(),
      getAddresses: vi.fn(),
      addAddress: vi.fn(),
      updateAddress: vi.fn(),
      deleteAddress: vi.fn(),
    })),
  },
  useStore: vi.fn(() => ({
    getState: vi.fn(() => ({
      customer: {
        profile: null,
        addresses: [],
        paymentMethods: [],
        isLoading: false,
        error: null,
        setProfile: vi.fn(),
        setAddresses: vi.fn(),
        setPaymentMethods: vi.fn(),
        updateProfile: vi.fn(),
        setLoading: vi.fn(),
        setError: vi.fn(),
        clearError: vi.fn(),
      },
    })),
  })),
  eventBus: {
    publish: vi.fn(),
    subscribe: vi.fn(),
  },
};
