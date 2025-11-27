import axios, { type AxiosInstance, AxiosError } from 'axios';
import type { User, Address, UpdateProfileDto } from './types';

/**
 * Customer Service Client
 * Handles all API communication with the customer-service backend
 */
export class CustomerServiceClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_CUSTOMER_SERVICE_URL || 'http://localhost:8083/api/customers',
      timeout: 10000,
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
   * Get current user profile
   */
  async getProfile(): Promise<User> {
    const response = await this.client.get<User>('/profile');
    return response.data;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileDto): Promise<User> {
    const response = await this.client.put<User>('/profile', data);
    return response.data;
  }

  /**
   * Get all addresses for current user
   */
  async getAddresses(): Promise<Address[]> {
    const response = await this.client.get<Address[]>('/addresses');
    return response.data;
  }

  /**
   * Add a new address
   */
  async addAddress(address: Address): Promise<Address> {
    const response = await this.client.post<Address>('/addresses', address);
    return response.data;
  }

  /**
   * Update an existing address
   */
  async updateAddress(id: string, address: Address): Promise<Address> {
    const response = await this.client.put<Address>(`/addresses/${id}`, address);
    return response.data;
  }

  /**
   * Delete an address
   */
  async deleteAddress(id: string): Promise<void> {
    await this.client.delete(`/addresses/${id}`);
  }
}
