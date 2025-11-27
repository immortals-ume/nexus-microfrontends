import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from './index';
import type { Product } from './types';

describe('Zustand Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    const state = useStore.getState();
    state.auth.logout();
    state.cart.clearCart();
    state.products.setItems([]);
    state.orders.setItems([]);
    state.notifications.setItems([]);
  });

  describe('Auth Slice', () => {
    it('should initialize with default state', () => {
      const { auth } = useStore.getState();
      expect(auth.user).toBeNull();
      expect(auth.token).toBeNull();
      expect(auth.isAuthenticated).toBe(false);
      expect(auth.isLoading).toBe(false);
      expect(auth.error).toBeNull();
    });

    it('should set user directly using setUser', () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { auth } = useStore.getState();
      auth.setUser(mockUser);

      const state = useStore.getState();
      expect(state.auth.user).toEqual(mockUser);
      expect(state.auth.isAuthenticated).toBe(true);
    });

    it('should set token directly using setToken', () => {
      const { auth } = useStore.getState();
      auth.setToken('test-token', 'test-refresh-token');

      const state = useStore.getState();
      expect(state.auth.token).toBe('test-token');
      expect(state.auth.refreshToken).toBe('test-refresh-token');
    });

    it('should clear state on logout without API call', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { auth } = useStore.getState();
      auth.setUser(mockUser);
      auth.setToken('test-token', 'test-refresh-token');

      // Verify user is set
      let state = useStore.getState();
      expect(state.auth.isAuthenticated).toBe(true);

      // Now logout (this will try to call API but will handle error gracefully)
      await auth.logout();

      state = useStore.getState();
      expect(state.auth.user).toBeNull();
      expect(state.auth.token).toBeNull();
      expect(state.auth.isAuthenticated).toBe(false);
    });

    it('should set and clear error', () => {
      const { auth } = useStore.getState();
      auth.setError('Test error');

      let state = useStore.getState();
      expect(state.auth.error).toBe('Test error');

      auth.clearError();
      state = useStore.getState();
      expect(state.auth.error).toBeNull();
    });
  });

  describe('Products Slice', () => {
    it('should initialize with empty products', () => {
      const { products } = useStore.getState();
      expect(products.items).toEqual([]);
      expect(products.selectedProduct).toBeNull();
      expect(products.filters).toEqual({});
    });

    it('should set products', () => {
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Test Product',
          description: 'Test Description',
          price: 99.99,
          images: [],
          category: { id: '1', name: 'Test', slug: 'test' },
          tags: [],
          rating: 4.5,
          reviewCount: 10,
          stock: 100,
          sku: 'TEST-001',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const { products } = useStore.getState();
      products.setItems(mockProducts);

      const state = useStore.getState();
      expect(state.products.items).toEqual(mockProducts);
    });

    it('should set filters', () => {
      const filters = { search: 'test', minPrice: 10, maxPrice: 100 };
      const { products } = useStore.getState();
      products.setFilters(filters);

      const state = useStore.getState();
      expect(state.products.filters).toEqual(filters);
    });
  });

  describe('Cart Slice', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Test Product',
      description: 'Test Description',
      price: 50,
      images: [],
      category: { id: '1', name: 'Test', slug: 'test' },
      tags: [],
      rating: 4.5,
      reviewCount: 10,
      stock: 100,
      sku: 'TEST-001',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    it('should initialize with empty cart', () => {
      const { cart } = useStore.getState();
      expect(cart.items).toEqual([]);
      expect(cart.subtotal).toBe(0);
      expect(cart.total).toBe(0);
      expect(cart.itemCount).toBe(0);
    });

    it('should add item to cart', () => {
      const { cart } = useStore.getState();
      cart.addItem(mockProduct, 2);

      const state = useStore.getState();
      expect(state.cart.items).toHaveLength(1);
      expect(state.cart.items[0].product.id).toBe('1');
      expect(state.cart.items[0].quantity).toBe(2);
      expect(state.cart.itemCount).toBe(2);
    });

    it('should calculate cart totals correctly', () => {
      const { cart } = useStore.getState();
      cart.addItem(mockProduct, 2); // 2 * $50 = $100

      const state = useStore.getState();
      expect(state.cart.subtotal).toBe(100);
      expect(state.cart.tax).toBe(10); // 10% of $100
      expect(state.cart.shipping).toBe(0); // Free shipping over $50
      expect(state.cart.total).toBe(110); // $100 + $10 + $0
    });

    it('should update item quantity', () => {
      const { cart } = useStore.getState();
      cart.addItem(mockProduct, 2);
      cart.updateQuantity('1', 5);

      const state = useStore.getState();
      expect(state.cart.items[0].quantity).toBe(5);
      expect(state.cart.itemCount).toBe(5);
    });

    it('should remove item from cart', () => {
      const { cart } = useStore.getState();
      cart.addItem(mockProduct, 2);
      cart.removeItem('1');

      const state = useStore.getState();
      expect(state.cart.items).toHaveLength(0);
      expect(state.cart.itemCount).toBe(0);
    });

    it('should clear cart', () => {
      const { cart } = useStore.getState();
      cart.addItem(mockProduct, 2);
      cart.clearCart();

      const state = useStore.getState();
      expect(state.cart.items).toEqual([]);
      expect(state.cart.subtotal).toBe(0);
      expect(state.cart.total).toBe(0);
      expect(state.cart.itemCount).toBe(0);
    });

    it('should increment quantity when adding existing item', () => {
      const { cart } = useStore.getState();
      cart.addItem(mockProduct, 2);
      cart.addItem(mockProduct, 3);

      const state = useStore.getState();
      expect(state.cart.items).toHaveLength(1);
      expect(state.cart.items[0].quantity).toBe(5);
      expect(state.cart.itemCount).toBe(5);
    });
  });

  describe('Orders Slice', () => {
    it('should initialize with empty orders', () => {
      const { orders } = useStore.getState();
      expect(orders.items).toEqual([]);
      expect(orders.selectedOrder).toBeNull();
    });

    it('should set orders', () => {
      const mockOrders = [
        {
          id: '1',
          orderNumber: 'ORD-001',
          userId: 'user-1',
          items: [],
          subtotal: 100,
          tax: 10,
          shipping: 5,
          total: 115,
          status: 'pending' as const,
          shippingAddress: {} as any,
          billingAddress: {} as any,
          paymentMethod: { type: 'credit_card' as const },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const { orders } = useStore.getState();
      orders.setItems(mockOrders);

      const state = useStore.getState();
      expect(state.orders.items).toEqual(mockOrders);
    });
  });

  describe('Customer Slice', () => {
    it('should initialize with null profile', () => {
      const { customer } = useStore.getState();
      expect(customer.profile).toBeNull();
      expect(customer.addresses).toEqual([]);
      expect(customer.paymentMethods).toEqual([]);
    });

    it('should set profile', () => {
      const mockProfile = {
        id: '1',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const { customer } = useStore.getState();
      customer.setProfile(mockProfile);

      const state = useStore.getState();
      expect(state.customer.profile).toEqual(mockProfile);
    });
  });

  describe('Payment Slice', () => {
    it('should initialize with null payment intent', () => {
      const { payment } = useStore.getState();
      expect(payment.paymentIntent).toBeNull();
      expect(payment.selectedMethod).toBeNull();
      expect(payment.isProcessing).toBe(false);
    });

    it('should set selected payment method', () => {
      const mockMethod = {
        type: 'credit_card' as const,
        last4: '4242',
        brand: 'visa',
      };

      const { payment } = useStore.getState();
      payment.setSelectedMethod(mockMethod);

      const state = useStore.getState();
      expect(state.payment.selectedMethod).toEqual(mockMethod);
    });
  });

  describe('Notifications Slice', () => {
    it('should initialize with empty notifications', () => {
      const { notifications } = useStore.getState();
      expect(notifications.items).toEqual([]);
      expect(notifications.unreadCount).toBe(0);
    });

    it('should calculate unread count correctly', () => {
      const mockNotifications = [
        {
          id: '1',
          type: 'info' as const,
          title: 'Test 1',
          message: 'Message 1',
          read: false,
          createdAt: new Date(),
        },
        {
          id: '2',
          type: 'success' as const,
          title: 'Test 2',
          message: 'Message 2',
          read: true,
          createdAt: new Date(),
        },
        {
          id: '3',
          type: 'warning' as const,
          title: 'Test 3',
          message: 'Message 3',
          read: false,
          createdAt: new Date(),
        },
      ];

      const { notifications } = useStore.getState();
      notifications.setItems(mockNotifications);

      const state = useStore.getState();
      expect(state.notifications.unreadCount).toBe(2);
    });

    it('should mark notification as read', () => {
      const mockNotifications = [
        {
          id: '1',
          type: 'info' as const,
          title: 'Test',
          message: 'Message',
          read: false,
          createdAt: new Date(),
        },
      ];

      const { notifications } = useStore.getState();
      notifications.setItems(mockNotifications);
      notifications.markAsRead('1');

      const state = useStore.getState();
      expect(state.notifications.items[0].read).toBe(true);
      expect(state.notifications.unreadCount).toBe(0);
    });

    it('should mark all notifications as read', () => {
      const mockNotifications = [
        {
          id: '1',
          type: 'info' as const,
          title: 'Test 1',
          message: 'Message 1',
          read: false,
          createdAt: new Date(),
        },
        {
          id: '2',
          type: 'info' as const,
          title: 'Test 2',
          message: 'Message 2',
          read: false,
          createdAt: new Date(),
        },
      ];

      const { notifications } = useStore.getState();
      notifications.setItems(mockNotifications);
      notifications.markAllAsRead();

      const state = useStore.getState();
      expect(state.notifications.items.every((n) => n.read)).toBe(true);
      expect(state.notifications.unreadCount).toBe(0);
    });
  });

  describe('UI Slice', () => {
    it('should initialize with default UI state', () => {
      const { ui } = useStore.getState();
      expect(ui.isSidebarOpen).toBe(false);
      expect(ui.isCartOpen).toBe(false);
      expect(ui.isMobileMenuOpen).toBe(false);
      expect(ui.theme).toBe('light');
      expect(ui.isGlobalLoading).toBe(false);
      expect(ui.activeRequests).toBe(0);
    });

    it('should toggle sidebar', () => {
      const { ui } = useStore.getState();
      ui.toggleSidebar();

      let state = useStore.getState();
      expect(state.ui.isSidebarOpen).toBe(true);

      ui.toggleSidebar();
      state = useStore.getState();
      expect(state.ui.isSidebarOpen).toBe(false);
    });

    it('should toggle cart', () => {
      const { ui } = useStore.getState();
      ui.toggleCart();

      const state = useStore.getState();
      expect(state.ui.isCartOpen).toBe(true);
    });

    it('should set theme', () => {
      const { ui } = useStore.getState();
      ui.setTheme('dark');

      const state = useStore.getState();
      expect(state.ui.theme).toBe('dark');
    });

    it('should track active requests', () => {
      const { ui } = useStore.getState();
      ui.incrementRequests();
      ui.incrementRequests();

      let state = useStore.getState();
      expect(state.ui.activeRequests).toBe(2);
      expect(state.ui.isGlobalLoading).toBe(true);

      ui.decrementRequests();
      state = useStore.getState();
      expect(state.ui.activeRequests).toBe(1);
      expect(state.ui.isGlobalLoading).toBe(true);

      ui.decrementRequests();
      state = useStore.getState();
      expect(state.ui.activeRequests).toBe(0);
      expect(state.ui.isGlobalLoading).toBe(false);
    });
  });
});
