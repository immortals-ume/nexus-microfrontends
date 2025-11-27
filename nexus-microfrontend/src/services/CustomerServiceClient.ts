import axios, { type AxiosInstance } from 'axios';
import { setupInterceptors, setupRetryInterceptor } from './axiosInterceptors';
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

    // Setup centralized interceptors
    setupInterceptors(this.client, 'CustomerService');
    setupRetryInterceptor(this.client, 3, 1000);
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
