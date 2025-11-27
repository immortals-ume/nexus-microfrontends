import axios, { type AxiosInstance } from 'axios';
import { setupInterceptors, setupRetryInterceptor } from './axiosInterceptors';
import type { Order, OrderStatus, CreateOrderDto } from './types';

/**
 * Order Service Client
 * Handles all API communication with the order-service backend
 * Includes cart endpoints and order management
 */
export class OrderServiceClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8082/api/orders',
      timeout: 15000, // Longer timeout for order processing
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup centralized interceptors
    setupInterceptors(this.client, 'OrderService');
    setupRetryInterceptor(this.client, 3, 1000);
  }

  /**
   * Get all orders for a user
   */
  async getAll(userId: string): Promise<Order[]> {
    const response = await this.client.get<Order[]>('/', {
      params: { userId },
    });
    return response.data;
  }

  /**
   * Get a single order by ID
   */
  async getById(id: string): Promise<Order> {
    const response = await this.client.get<Order>(`/${id}`);
    return response.data;
  }

  /**
   * Create a new order
   */
  async create(order: CreateOrderDto): Promise<Order> {
    const response = await this.client.post<Order>('/', order);
    return response.data;
  }

  /**
   * Update order status
   */
  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const response = await this.client.patch<Order>(`/${id}/status`, { status });
    return response.data;
  }

  /**
   * Cancel an order
   */
  async cancel(id: string): Promise<void> {
    await this.client.post(`/${id}/cancel`);
  }

  /**
   * Get cart for current user
   */
  async getCart(): Promise<any> {
    const response = await this.client.get('/cart');
    return response.data;
  }

  /**
   * Sync cart with backend
   */
  async syncCart(cartData: any): Promise<any> {
    const response = await this.client.post('/cart/sync', cartData);
    return response.data;
  }

  /**
   * Add item to cart
   */
  async addToCart(productId: string, quantity: number): Promise<any> {
    const response = await this.client.post('/cart/items', { productId, quantity });
    return response.data;
  }

  /**
   * Update cart item quantity
   */
  async updateCartItem(itemId: string, quantity: number): Promise<any> {
    const response = await this.client.patch(`/cart/items/${itemId}`, { quantity });
    return response.data;
  }

  /**
   * Remove item from cart
   */
  async removeFromCart(itemId: string): Promise<void> {
    await this.client.delete(`/cart/items/${itemId}`);
  }

  /**
   * Clear entire cart
   */
  async clearCart(): Promise<void> {
    await this.client.delete('/cart');
  }
}
