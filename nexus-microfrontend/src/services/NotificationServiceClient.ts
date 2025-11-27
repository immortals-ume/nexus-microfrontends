import axios, { type AxiosInstance } from 'axios';
import { setupInterceptors, setupRetryInterceptor } from './axiosInterceptors';
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

    // Setup centralized interceptors
    setupInterceptors(this.client, 'NotificationService');
    setupRetryInterceptor(this.client, 3, 1000);
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
