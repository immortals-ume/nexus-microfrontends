import type { Order, OrderStatus } from '../types';

// Mock orders data for development
export const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-2024-001',
    userId: 'user-1',
    items: [
      {
        id: 'item-1',
        productId: 'prod-1',
        productName: 'Wireless Headphones',
        productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        quantity: 1,
        price: 99.99,
        subtotal: 99.99,
      },
      {
        id: 'item-2',
        productId: 'prod-2',
        productName: 'Smart Watch',
        productImage: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        quantity: 1,
        price: 299.99,
        subtotal: 299.99,
      },
    ],
    subtotal: 399.98,
    tax: 40.00,
    shipping: 0,
    total: 439.98,
    status: 'delivered',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'USA',
      phone: '+1 (555) 123-4567',
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'USA',
      phone: '+1 (555) 123-4567',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
      brand: 'Visa',
    },
    trackingNumber: '1Z999AA10123456784',
    trackingUrl: 'https://www.ups.com/track?tracknum=1Z999AA10123456784',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-18T14:20:00'),
  },
  {
    id: '2',
    orderNumber: 'ORD-2024-002',
    userId: 'user-1',
    items: [
      {
        id: 'item-3',
        productId: 'prod-3',
        productName: 'Laptop Stand',
        productImage: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
        quantity: 2,
        price: 49.99,
        subtotal: 99.98,
      },
    ],
    subtotal: 99.98,
    tax: 10.00,
    shipping: 5.99,
    total: 115.97,
    status: 'shipped',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'USA',
      phone: '+1 (555) 123-4567',
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'USA',
      phone: '+1 (555) 123-4567',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
      brand: 'Visa',
    },
    trackingNumber: '1Z999AA10123456785',
    trackingUrl: 'https://www.ups.com/track?tracknum=1Z999AA10123456785',
    createdAt: new Date('2024-01-20T09:15:00'),
    updatedAt: new Date('2024-01-21T16:45:00'),
  },
  {
    id: '3',
    orderNumber: 'ORD-2024-003',
    userId: 'user-1',
    items: [
      {
        id: 'item-4',
        productId: 'prod-4',
        productName: 'Mechanical Keyboard',
        productImage: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
        quantity: 1,
        price: 149.99,
        subtotal: 149.99,
      },
    ],
    subtotal: 149.99,
    tax: 15.00,
    shipping: 0,
    total: 164.99,
    status: 'processing',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'USA',
      phone: '+1 (555) 123-4567',
    },
    billingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      addressLine1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postalCode: '94102',
      country: 'USA',
      phone: '+1 (555) 123-4567',
    },
    paymentMethod: {
      type: 'credit_card',
      last4: '4242',
      brand: 'Visa',
    },
    createdAt: new Date('2024-01-25T11:00:00'),
    updatedAt: new Date('2024-01-25T11:00:00'),
  },
];

// Mock API functions
export const mockOrderApi = {
  getAll: async (userId: string): Promise<Order[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return mockOrders.filter((order) => order.userId === userId);
  },

  getById: async (id: string): Promise<Order> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    const order = mockOrders.find((o) => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  },

  updateStatus: async (id: string, status: OrderStatus): Promise<Order> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    const order = mockOrders.find((o) => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
    return { ...order, status, updatedAt: new Date() };
  },

  cancel: async (id: string): Promise<void> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 400));
    const order = mockOrders.find((o) => o.id === id);
    if (!order) {
      throw new Error('Order not found');
    }
  },
};
