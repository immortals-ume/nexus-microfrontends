import axios, { type AxiosInstance } from 'axios';
import { setupInterceptors, setupRetryInterceptor } from './axiosInterceptors';
import type {
  PaymentIntent,
  PaymentData,
  PaymentResult,
  PaymentMethod,
} from './types';

/**
 * Payment Service Client
 * Handles all API communication with the payment-service backend
 */
export class PaymentServiceClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8084/api/payments',
      timeout: 20000, // Longer timeout for payment processing
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup centralized interceptors
    setupInterceptors(this.client, 'PaymentService');
    setupRetryInterceptor(this.client, 2, 1500); // Fewer retries for payment operations
  }

  /**
   * Create a payment intent
   */
  async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<PaymentIntent> {
    const response = await this.client.post<PaymentIntent>('/intents', {
      amount,
      currency,
    });
    return response.data;
  }

  /**
   * Process a payment
   */
  async processPayment(data: PaymentData): Promise<PaymentResult> {
    const response = await this.client.post<PaymentResult>('/process', data);
    return response.data;
  }

  /**
   * Get all payment methods for current user
   */
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await this.client.get<PaymentMethod[]>('/methods');
    return response.data;
  }

  /**
   * Add a new payment method
   */
  async addPaymentMethod(method: PaymentMethod): Promise<PaymentMethod> {
    const response = await this.client.post<PaymentMethod>('/methods', method);
    return response.data;
  }

  /**
   * Delete a payment method
   */
  async deletePaymentMethod(id: string): Promise<void> {
    await this.client.delete(`/methods/${id}`);
  }
}
