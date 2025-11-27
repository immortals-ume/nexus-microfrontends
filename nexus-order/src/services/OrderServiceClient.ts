import axios, { AxiosInstance, AxiosError } from 'axios';
import type { Order } from '../types';

class OrderServiceClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:3002/api',
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor: Add auth token
    this.client.interceptors.request.use((config) => {
      // In a real app, get token from Zustand store
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Response interceptor: Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }

  private handleError(error: AxiosError) {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }

  // Get all orders for a user
  async getAll(userId: string): Promise<Order[]> {
    const response = await this.client.get<Order[]>(`/orders`, {
      params: { userId },
    });
    return response.data;
  }

  // Get a single order by ID
  async getById(id: string): Promise<Order> {
    const response = await this.client.get<Order>(`/orders/${id}`);
    return response.data;
  }

  // Update order status (admin only)
  async updateStatus(id: string, status: string): Promise<Order> {
    const response = await this.client.patch<Order>(`/orders/${id}/status`, {
      status,
    });
    return response.data;
  }

  // Cancel an order
  async cancel(id: string): Promise<void> {
    await this.client.post(`/orders/${id}/cancel`);
  }
}

// Singleton instance
let instance: OrderServiceClient | null = null;

export const getOrderServiceClient = (): OrderServiceClient => {
  if (!instance) {
    instance = new OrderServiceClient();
  }
  return instance;
};

export default OrderServiceClient;
