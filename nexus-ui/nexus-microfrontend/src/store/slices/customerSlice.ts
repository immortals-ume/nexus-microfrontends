import type { StateCreator } from 'zustand';
import type { AppStore, CustomerSlice, User, Address, PaymentMethod, UpdateProfileDto } from '../types';

export const createCustomerSlice: StateCreator<
  AppStore,
  [],
  [],
  CustomerSlice
> = (set) => ({
  profile: null,
  addresses: [],
  paymentMethods: [],
  isLoading: false,
  error: null,

  setProfile: (profile: User | null) => {
    set((state) => ({
      customer: { ...state.customer, profile },
    }));
  },

  setAddresses: (addresses: Address[]) => {
    set((state) => ({
      customer: { ...state.customer, addresses },
    }));
  },

  setPaymentMethods: (methods: PaymentMethod[]) => {
    set((state) => ({
      customer: { ...state.customer, paymentMethods: methods },
    }));
  },

  updateProfile: async (data: UpdateProfileDto) => {
    set((state) => ({
      customer: { ...state.customer, isLoading: true, error: null },
    }));

    try {
      // This will be replaced with actual API call in later tasks
      set((state) => {
        const updatedProfile = state.customer.profile
          ? { ...state.customer.profile, ...data }
          : null;

        return {
          customer: {
            ...state.customer,
            profile: updatedProfile,
            isLoading: false,
            error: null,
          },
        };
      });
    } catch (error) {
      set((state) => ({
        customer: {
          ...state.customer,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Profile update failed',
        },
      }));
      throw error;
    }
  },

  setLoading: (isLoading: boolean) => {
    set((state) => ({
      customer: { ...state.customer, isLoading },
    }));
  },

  setError: (error: string | null) => {
    set((state) => ({
      customer: { ...state.customer, error },
    }));
  },

  clearError: () => {
    set((state) => ({
      customer: { ...state.customer, error: null },
    }));
  },
});
