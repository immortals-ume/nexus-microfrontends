import { type StateCreator } from 'zustand';
import type { AppStore, AuthSlice, LoginCredentials, RegisterData, User } from '../types';
import { ApiServiceFactory } from '../../services/ApiServiceFactory';
import { eventBus } from '../../utils/eventBus';

export const createAuthSlice: StateCreator<
  AppStore,
  [],
  [],
  AuthSlice
> = (set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials: LoginCredentials) => {
    set((state) => ({
      auth: { ...state.auth, isLoading: true, error: null },
    }));

    try {
      const authService = ApiServiceFactory.getAuthService();
      const response = await authService.login(credentials);

      set((state) => ({
        auth: {
          ...state.auth,
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      }));

      // Emit auth event through event bus
      eventBus.publish('auth:login', { user: response.user });
    } catch (error) {
      set((state) => ({
        auth: {
          ...state.auth,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Login failed',
        },
      }));
      throw error;
    }
  },

  logout: async () => {
    try {
      const authService = ApiServiceFactory.getAuthService();
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }

    set((state) => ({
      auth: {
        ...state.auth,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        error: null,
      },
    }));

    // Clear cart on logout
    get().cart.clearCart();

    // Emit auth event through event bus
    eventBus.publish('auth:logout', undefined);
  },

  register: async (data: RegisterData) => {
    set((state) => ({
      auth: { ...state.auth, isLoading: true, error: null },
    }));

    try {
      const authService = ApiServiceFactory.getAuthService();
      const response = await authService.register(data);

      set((state) => ({
        auth: {
          ...state.auth,
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        },
      }));

      // Emit auth event through event bus
      eventBus.publish('auth:register', { user: response.user });
    } catch (error) {
      set((state) => ({
        auth: {
          ...state.auth,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Registration failed',
        },
      }));
      throw error;
    }
  },

  refreshAuthToken: async () => {
    const currentRefreshToken = get().auth.refreshToken;
    if (!currentRefreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const authService = ApiServiceFactory.getAuthService();
      const response = await authService.refreshToken(currentRefreshToken);

      set((state) => ({
        auth: {
          ...state.auth,
          token: response.token,
          refreshToken: response.refreshToken,
        },
      }));

      // Emit token refresh event
      eventBus.publish('auth:token-refreshed', { token: response.token });
    } catch (error) {
      // If refresh fails, logout the user
      get().auth.logout();
      throw error;
    }
  },

  setUser: (user: User | null) => {
    set((state) => ({
      auth: {
        ...state.auth,
        user,
        isAuthenticated: user !== null,
      },
    }));
  },

  setToken: (token: string | null, refreshToken: string | null) => {
    set((state) => ({
      auth: {
        ...state.auth,
        token,
        refreshToken,
      },
    }));
  },

  setError: (error: string | null) => {
    set((state) => ({
      auth: { ...state.auth, error },
    }));
  },

  clearError: () => {
    set((state) => ({
      auth: { ...state.auth, error: null },
    }));
  },
});
