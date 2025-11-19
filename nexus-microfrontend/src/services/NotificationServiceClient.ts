import axios, { type AxiosInstance, type AxiosError } from 'axios';
import type { Notification } from './types';

/**
 * Notification Service Client
 * Handles all API communication with the notification-service backend
 */
export class NotificationServiceClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:8086/api/notifications',
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Set up request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor: Add auth token
    this.client.interceptors.request.use(
      (config) => {
        // Get token from localStorage (persisted by Zustand)
        const storedState = localStorage.getItem('nexus-ecommerce-store');
        if (storedState) {
          try {
            const state = JSON.parse(storedState);
            const token = state?.state?.auth?.token;
            if (token) {
              config.headers.Authorization = `Bearer ${token}`;
            }
          } catch (error) {
            console.error('Failed to parse stored state:', error);
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor: Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => this.handleError(error)
    );
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): Promise<never> {
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      console.error('Unauthorized access - redirecting to login');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.error('Forbidden - insufficient permissions');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 422) {
      console.error('Validation error:', error.response.data);
    } else if (error.response?.status && error.response.status >= 500) {
      console.error('Server error:', error.message);
    } else if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    } else if (!error.response) {
      console.error('Network error - please check your connection');
    }

    return Promise.reject(error);
  }

  /**
   * Get all notifications for current user
   */
  async getAll(): Promise<Notification[]> {
    const response = await this.client.get<Notification[]>('/');
    return response.data;
  }

  /**
   * Mark a notification as read
   */
  async markAsRead(id: string): Promise<void> {
    await this.client.patch(`/${id}/read`);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    await this.client.patch('/read-all');
  }

  /**
   * Delete a notification
   */
  async delete(id: string): Promise<void> {
    await this.client.delete(`/${id}`);
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(subscription: PushSubscription): Promise<void> {
    await this.client.post('/subscribe', subscription);
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<void> {
    await this.client.post('/unsubscribe');
  }
}
