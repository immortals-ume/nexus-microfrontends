import axios, { type AxiosInstance, AxiosError } from 'axios';
import type {
  Product,
  ProductFilters,
  PaginatedResponse,
  CreateProductDto,
  UpdateProductDto,
} from './types';

/**
 * Product Service Client
 * Handles all API communication with the product-service backend
 */
export class ProductServiceClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:8081/api/products',
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
   * Get all products with optional filters
   */
  async getAll(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const response = await this.client.get<PaginatedResponse<Product>>('/', {
      params: filters,
    });
    return response.data;
  }

  /**
   * Get a single product by ID
   */
  async getById(id: string): Promise<Product> {
    const response = await this.client.get<Product>(`/${id}`);
    return response.data;
  }

  /**
   * Create a new product
   */
  async create(product: CreateProductDto): Promise<Product> {
    const response = await this.client.post<Product>('/', product);
    return response.data;
  }

  /**
   * Update an existing product
   */
  async update(id: string, product: UpdateProductDto): Promise<Product> {
    const response = await this.client.put<Product>(`/${id}`, product);
    return response.data;
  }

  /**
   * Delete a product
   */
  async delete(id: string): Promise<void> {
    await this.client.delete(`/${id}`);
  }

  /**
   * Search products by query
   */
  async search(query: string): Promise<Product[]> {
    const response = await this.client.get<Product[]>('/search', {
      params: { q: query },
    });
    return response.data;
  }
}
