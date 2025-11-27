import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { User, Address, PaymentMethod, UpdateProfileDto } from '../types';

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Get the CustomerServiceClient from the host application
 * The host exposes this via window.ApiServiceFactory
 */
const getCustomerService = () => {
  if (typeof window !== 'undefined' && (window as any).ApiServiceFactory) {
    return (window as any).ApiServiceFactory.getCustomerService();
  }
  throw new Error('CustomerServiceClient not available. Ensure host application has loaded.');
};

/**
 * Get the Zustand store from the host application
 * The host exposes this via window.useStore
 */
const getStore = () => {
  if (typeof window !== 'undefined' && (window as any).useStore) {
    return (window as any).useStore;
  }
  return null;
};

/**
 * Get the event bus from the host application
 * The host exposes this via window.eventBus
 */
const getEventBus = () => {
  if (typeof window !== 'undefined' && (window as any).eventBus) {
    return (window as any).eventBus;
  }
  return null;
};

/**
 * Query hook for fetching user profile
 */
export const useProfile = () => {
  return useQuery({
    queryKey: ['customer', 'profile'],
    queryFn: async (): Promise<User> => {
      const customerService = getCustomerService();
      return customerService.getProfile();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Mutation hook for updating user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProfileDto): Promise<User> => {
      const customerService = getCustomerService();
      return customerService.updateProfile(data);
    },
    onSuccess: (updatedUser: User) => {
      // Update React Query cache
      queryClient.setQueryData(['customer', 'profile'], updatedUser);

      // Update Zustand store
      const store = getStore();
      if (store) {
        const state = store.getState();
        if (state.customer) {
          state.customer.setProfile(updatedUser);
        }
      }

      // Emit event through event bus
      const eventBus = getEventBus();
      if (eventBus) {
        eventBus.publish('customer:profile-updated', { user: updatedUser });
      }

      console.log('Profile updated successfully:', updatedUser.email);
    },
    onError: (error: Error) => {
      console.error('Profile update error:', error);

      // Update error state in store
      const store = getStore();
      if (store) {
        const state = store.getState();
        if (state.customer) {
          state.customer.setError(error.message || 'Profile update failed');
        }
      }
    },
  });
};

/**
 * Query hook for fetching addresses
 */
export const useAddresses = () => {
  return useQuery({
    queryKey: ['customer', 'addresses'],
    queryFn: async (): Promise<Address[]> => {
      const customerService = getCustomerService();
      return customerService.getAddresses();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

/**
 * Mutation hook for adding a new address
 */
export const useAddAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (address: Address): Promise<Address> => {
      const customerService = getCustomerService();
      return customerService.addAddress(address);
    },
    onSuccess: (newAddress: Address) => {
      // Invalidate and refetch addresses
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] });

      // Update Zustand store
      const store = getStore();
      if (store) {
        const state = store.getState();
        if (state.customer) {
          const currentAddresses = state.customer.addresses;
          state.customer.setAddresses([...currentAddresses, newAddress]);
        }
      }

      // Emit event through event bus
      const eventBus = getEventBus();
      if (eventBus) {
        eventBus.publish('customer:address-added', { address: newAddress });
      }

      console.log('Address added successfully');
    },
    onError: (error: Error) => {
      console.error('Add address error:', error);

      // Update error state in store
      const store = getStore();
      if (store) {
        const state = store.getState();
        if (state.customer) {
          state.customer.setError(error.message || 'Failed to add address');
        }
      }
    },
  });
};

/**
 * Mutation hook for updating an existing address
 */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, address }: { id: string; address: Address }): Promise<Address> => {
      const customerService = getCustomerService();
      return customerService.updateAddress(id, address);
    },
    onSuccess: (updatedAddress: Address) => {
      // Invalidate and refetch addresses
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] });

      // Update Zustand store
      const store = getStore();
      if (store) {
        const state = store.getState();
        if (state.customer) {
          const currentAddresses = state.customer.addresses;
          const updatedAddresses = currentAddresses.map((addr: Address) =>
            addr.id === updatedAddress.id ? updatedAddress : addr
          );
          state.customer.setAddresses(updatedAddresses);
        }
      }

      // Emit event through event bus
      const eventBus = getEventBus();
      if (eventBus) {
        eventBus.publish('customer:address-updated', { address: updatedAddress });
      }

      console.log('Address updated successfully');
    },
    onError: (error: Error) => {
      console.error('Update address error:', error);

      // Update error state in store
      const store = getStore();
      if (store) {
        const state = store.getState();
        if (state.customer) {
          state.customer.setError(error.message || 'Failed to update address');
        }
      }
    },
  });
};

/**
 * Mutation hook for deleting an address
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const customerService = getCustomerService();
      return customerService.deleteAddress(id);
    },
    onSuccess: (_, deletedId: string) => {
      // Invalidate and refetch addresses
      queryClient.invalidateQueries({ queryKey: ['customer', 'addresses'] });

      // Update Zustand store
      const store = getStore();
      if (store) {
        const state = store.getState();
        if (state.customer) {
          const currentAddresses = state.customer.addresses;
          const updatedAddresses = currentAddresses.filter((addr: Address) => addr.id !== deletedId);
          state.customer.setAddresses(updatedAddresses);
        }
      }

      // Emit event through event bus
      const eventBus = getEventBus();
      if (eventBus) {
        eventBus.publish('customer:address-deleted', { addressId: deletedId });
      }

      console.log('Address deleted successfully');
    },
    onError: (error: Error) => {
      console.error('Delete address error:', error);

      // Update error state in store
      const store = getStore();
      if (store) {
        const state = store.getState();
        if (state.customer) {
          state.customer.setError(error.message || 'Failed to delete address');
        }
      }
    },
  });
};

/**
 * Query hook for fetching payment methods
 */
export const usePaymentMethods = () => {
  return useQuery({
    queryKey: ['customer', 'payment-methods'],
    queryFn: async (): Promise<PaymentMethod[]> => {
      // Mock implementation - will be replaced with actual API call
      return Promise.resolve([]);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};
