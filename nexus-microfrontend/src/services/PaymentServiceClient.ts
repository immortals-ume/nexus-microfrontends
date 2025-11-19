import axios, { type AxiosInstance, AxiosError } from 'axios';
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
