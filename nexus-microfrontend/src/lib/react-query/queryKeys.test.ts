import { describe, it, expect } from 'vitest';
import { queryKeys } from './queryKeys';

describe('Query Keys Factory', () => {
  describe('products', () => {
    it('should generate correct base key', () => {
      expect(queryKeys.products.all).toEqual(['products']);
    });

    it('should generate correct list keys', () => {
      expect(queryKeys.products.lists()).toEqual(['products', 'list']);
      expect(queryKeys.products.list()).toEqual(['products', 'list', undefined]);
      expect(queryKeys.products.list({ category: 'electronics' })).toEqual([
        'products',
        'list',
        { category: 'electronics' },
      ]);
    });

    it('should generate correct detail keys', () => {
      expect(queryKeys.products.details()).toEqual(['products', 'detail']);
      expect(queryKeys.products.detail('123')).toEqual(['products', 'detail', '123']);
    });

    it('should generate correct search keys', () => {
      expect(queryKeys.products.search('laptop')).toEqual(['products', 'search', 'laptop']);
    });
  });

  describe('cart', () => {
    it('should generate correct cart keys', () => {
      expect(queryKeys.cart.all).toEqual(['cart']);
      expect(queryKeys.cart.current()).toEqual(['cart', 'current']);
      expect(queryKeys.cart.items()).toEqual(['cart', 'items']);
    });
  });

  describe('orders', () => {
    it('should generate correct order keys', () => {
      expect(queryKeys.orders.all).toEqual(['orders']);
      expect(queryKeys.orders.lists()).toEqual(['orders', 'list']);
      expect(queryKeys.orders.list('user123')).toEqual(['orders', 'list', 'user123']);
      expect(queryKeys.orders.details()).toEqual(['orders', 'detail']);
      expect(queryKeys.orders.detail('order123')).toEqual(['orders', 'detail', 'order123']);
    });
  });

  describe('customer', () => {
    it('should generate correct customer keys', () => {
      expect(queryKeys.customer.all).toEqual(['customer']);
      expect(queryKeys.customer.profile()).toEqual(['customer', 'profile']);
      expect(queryKeys.customer.addresses()).toEqual(['customer', 'addresses']);
      expect(queryKeys.customer.address('addr123')).toEqual(['customer', 'addresses', 'addr123']);
      expect(queryKeys.customer.paymentMethods()).toEqual(['customer', 'payment-methods']);
      expect(queryKeys.customer.paymentMethod('pm123')).toEqual(['customer', 'payment-methods', 'pm123']);
    });
  });

  describe('notifications', () => {
    it('should generate correct notification keys', () => {
      expect(queryKeys.notifications.all).toEqual(['notifications']);
      expect(queryKeys.notifications.list()).toEqual(['notifications', 'list']);
      expect(queryKeys.notifications.unreadCount()).toEqual(['notifications', 'unread-count']);
    });
  });

  describe('analytics', () => {
    it('should generate correct analytics keys', () => {
      expect(queryKeys.analytics.all).toEqual(['analytics']);
      expect(queryKeys.analytics.dashboard()).toEqual(['analytics', 'dashboard']);
      expect(queryKeys.analytics.sales()).toEqual(['analytics', 'sales', { startDate: undefined, endDate: undefined }]);
      expect(queryKeys.analytics.sales('2024-01-01', '2024-12-31')).toEqual([
        'analytics',
        'sales',
        { startDate: '2024-01-01', endDate: '2024-12-31' },
      ]);
      expect(queryKeys.analytics.productPerformance()).toEqual(['analytics', 'product-performance']);
    });
  });
});
