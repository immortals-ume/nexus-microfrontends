import axios, { type AxiosInstance } from 'axios';
import { setupResponseInterceptor, setupRetryInterceptor } from './axiosInterceptors';
import type { LoginCredentials, RegisterData, AuthResponse } from './types';

/**
 * Auth Service Client
 * Handles all API communication with the auth-service backend
 * Note: This service does NOT add auth tokens to requests (it's used to obtain them)
 */
export class AuthServiceClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:8085/api/auth',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Setup response interceptor only (no auth token needed for auth service)
    setupResponseInterceptor(this.client, 'AuthService');
    setupRetryInterceptor(this.client, 2, 1000); // Fewer retries for auth operations
  }

  /**
   * Login with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/login', credentials);
    return response.data;
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/register', data);
    return response.data;
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    // Get token for logout request
    const storedState = localStorage.getItem('nexus-ecommerce-store');
    let token = null;
    if (storedState) {
      try {
        const state = JSON.parse(storedState);
        token = state?.state?.auth?.token;
      } catch (error) {
        console.error('Failed to parse stored state:', error);
      }
    }

    await this.client.post(
      '/logout',
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
  }

  /**
   * Refresh authentication token
   */
  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    const response = await this.client.post<AuthResponse>('/refresh', {
      refreshToken,
    });
    return response.data;
  }

  /**
   * Verify if a token is valid
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      const response = await this.client.post<{ valid: boolean }>('/verify', {
        token,
      });
      return response.data.valid;
    } catch (error) {
      return false;
    }
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<void> {
    await this.client.post('/password-reset/request', { email });
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    await this.client.post('/password-reset/confirm', {
      token,
      newPassword,
    });
  }
}
