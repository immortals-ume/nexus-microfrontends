import type { StateCreator } from 'zustand';
import type { AppStore, UISlice } from '../types';

export const createUISlice: StateCreator<
  AppStore,
  [],
  [],
  UISlice
> = (set) => ({
  isSidebarOpen: false,
  isCartOpen: false,
  isMobileMenuOpen: false,
  theme: 'light',
  isGlobalLoading: false,
  activeRequests: 0,

  toggleSidebar: () => {
    set((state) => ({
      ui: { ...state.ui, isSidebarOpen: !state.ui.isSidebarOpen },
    }));
  },

  toggleCart: () => {
    set((state) => ({
      ui: { ...state.ui, isCartOpen: !state.ui.isCartOpen },
    }));
  },

  toggleMobileMenu: () => {
    set((state) => ({
      ui: { ...state.ui, isMobileMenuOpen: !state.ui.isMobileMenuOpen },
    }));
  },

  setTheme: (theme: 'light' | 'dark') => {
    set((state) => ({
      ui: { ...state.ui, theme },
    }));

    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Event bus emission will be added when event bus is integrated
  },

  incrementRequests: () => {
    set((state) => {
      const activeRequests = state.ui.activeRequests + 1;
      return {
        ui: {
          ...state.ui,
          activeRequests,
          isGlobalLoading: activeRequests > 0,
        },
      };
    });
  },

  decrementRequests: () => {
    set((state) => {
      const activeRequests = Math.max(0, state.ui.activeRequests - 1);
      return {
        ui: {
          ...state.ui,
          activeRequests,
          isGlobalLoading: activeRequests > 0,
        },
      };
    });
  },

  setSidebarOpen: (isOpen: boolean) => {
    set((state) => ({
      ui: { ...state.ui, isSidebarOpen: isOpen },
    }));
  },

  setCartOpen: (isOpen: boolean) => {
    set((state) => ({
      ui: { ...state.ui, isCartOpen: isOpen },
    }));
  },

  setMobileMenuOpen: (isOpen: boolean) => {
    set((state) => ({
      ui: { ...state.ui, isMobileMenuOpen: isOpen },
    }));
  },
});
