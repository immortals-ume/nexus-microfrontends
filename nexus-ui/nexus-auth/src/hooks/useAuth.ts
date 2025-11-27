import { useMutation } from '@tanstack/react-query';
import type { LoginCredentials, RegisterData, AuthResponse } from '../types';

/**
 * Get the AuthServiceClient from the host application
 * The host exposes this via window.ApiServiceFactory
 */
const getAuthService = () => {
  if (typeof window !== 'undefined' && (window as any).ApiServiceFactory) {
    return (window as any).ApiServiceFactory.getAuthService();
  }
  throw new Error('AuthServiceClient not available. Ensure host application has loaded.');
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
 * Login mutation hook
 * Integrates with AuthServiceClient, Zustand store, and event bus
 */
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const authService = getAuthService();
      return authService.login(credentials);
    },
    onSuccess: (data: AuthResponse) => {
      // Update Zustand store
      const store = getStore();
      if (store) {
        const state = store.getState();
        if (state.auth) {
          // Use the store's methods to update auth state
          state.auth.setUser(data.user);
          state.auth.setToken(data.token, data.refreshToken);
        }
      }

      // Emit auth event through event bus
      const eventBus = getEventBus();
      if (eventBus) {
        eventBus.publish('auth:login', { user: data.user });
      }

      console.log('Login successful:', data.user.email);
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
      
      // Update error state in store
      const store = getStore();
      if (store) {
        const state = store.getState();
        if (state.auth) {
          state.auth.setError(error.message || 'Login failed');
        }
      }
    },
  });
};

/**
 * Register mutation hook
 * Integrates with AuthServiceClient, Zustand store, and event bus
 */
export const useRegister = () => {
  return useMutation({
    mutationFn: async (data: RegisterData): Promise<AuthResponse> => {
      const authService = getAuthService();
      return authService.register(data);
    },
    onSuccess: (data: AuthResponse) => {
      // Update Zustand store
      const store = getStore();
      if (store) {
        const state = store.getState();
        if (state.auth) {
          // Use the store's methods to update auth state
          state.auth.setUser(data.user);
          state.auth.setToken(data.token, data.refreshToken);
        }
      }

      // Emit auth event through event bus
      const eventBus = getEventBus();
      if (eventBus) {
        eventBus.publish('auth:register', { user: data.user });
      }

      console.log('Registration successful:', data.user.email);
    },
    onError: (error: Error) => {
      console.error('Registration error:', error);
      
      // Update error state in store
      const store = getStore();
      if (store) {
        const state = store.getState();
        if (state.auth) {
          state.auth.setError(error.message || 'Registration failed');
        }
      }
    },
  });
};

/**
 * Forgot password mutation hook
 * Integrates with AuthServiceClient
 */
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: async (email: string): Promise<void> => {
      const authService = getAuthService();
      return authService.requestPasswordReset(email);
    },
    onSuccess: () => {
      console.log('Password reset email sent');
    },
    onError: (error: Error) => {
      console.error('Password reset error:', error);
    },
  });
};
