import axios, { type AxiosInstance } from 'axios';
import { setupInterceptors, setupRetryInterceptor } from './axiosInterceptors';
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

    // Setup centralized interceptors
    setupInterceptors(this.client, 'ProductService');
    setupRetryInterceptor(this.client, 3, 1000);
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
