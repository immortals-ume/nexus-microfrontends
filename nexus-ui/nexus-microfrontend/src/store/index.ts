import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import type { AppStore } from './types';
import { createAuthSlice } from './slices/authSlice';
import { createProductsSlice } from './slices/productsSlice';
import { createCartSlice } from './slices/cartSlice';
import { createOrdersSlice } from './slices/ordersSlice';
import { createCustomerSlice } from './slices/customerSlice';
import { createPaymentSlice } from './slices/paymentSlice';
import { createNotificationsSlice } from './slices/notificationsSlice';
import { createUISlice } from './slices/uiSlice';

/**
 * Main application store combining all slices
 * 
 * Store Structure:
 * - auth: Authentication state (persisted)
 * - products: Product catalog state
 * - cart: Shopping cart state (persisted)
 * - orders: Order management state
 * - customer: Customer profile state
 * - payment: Payment processing state
 * - notifications: Notification state
 * - ui: UI state (theme persisted)
 */
export const useStore = create<AppStore>()(
  devtools(
    persist(
      (...args) => ({
        auth: createAuthSlice(...args),
        products: createProductsSlice(...args),
        cart: createCartSlice(...args),
        orders: createOrdersSlice(...args),
        customer: createCustomerSlice(...args),
        payment: createPaymentSlice(...args),
        notifications: createNotificationsSlice(...args),
        ui: createUISlice(...args),
      }),
      {
        name: 'nexus-ecommerce-store',
        // Only persist specific slices to localStorage
        partialize: (state) => ({
          auth: {
            token: state.auth.token,
            refreshToken: state.auth.refreshToken,
            user: state.auth.user,
            isAuthenticated: state.auth.isAuthenticated,
          },
          cart: {
            items: state.cart.items,
            subtotal: state.cart.subtotal,
            tax: state.cart.tax,
            shipping: state.cart.shipping,
            total: state.cart.total,
            itemCount: state.cart.itemCount,
          },
          ui: {
            theme: state.ui.theme,
          },
        }),
      }
    ),
    {
      name: 'NexusEcommerceStore',
    }
  )
);

// Export types for convenience
export type { AppStore } from './types';
export * from './types';
