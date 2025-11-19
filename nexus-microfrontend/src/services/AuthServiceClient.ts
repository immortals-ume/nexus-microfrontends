import axios, { type AxiosInstance, AxiosError } from 'axios';
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

    this.setupInterceptors();
  }

  /**
   * Set up response interceptors
   * Note: No request interceptor for auth tokens since this service is used to obtain them
   */
  private setupInterceptors(): void {
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
      console.error('Invalid credentials');
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
