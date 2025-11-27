/**
 * Type declarations for Module Federation imports from host
 */

declare module 'host/types' {
  export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    images: ProductImage[];
    category: Category;
    tags: string[];
    rating: number;
    reviewCount: number;
    stock: number;
    sku: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface ProductImage {
    id: string;
    url: string;
    alt: string;
    isPrimary: boolean;
  }

  export interface Category {
    id: string;
    name: string;
    slug: string;
    description?: string;
    parentId?: string;
    imageUrl?: string;
  }

  export interface ProductFilters {
    search?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
    page?: number;
    limit?: number;
  }

  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }
}

declare module 'host/services' {
  export class ProductServiceClient {
    getAll(filters?: import('host/types').ProductFilters): Promise<import('host/types').PaginatedResponse<import('host/types').Product>>;
    getById(id: string): Promise<import('host/types').Product>;
    search(query: string): Promise<import('host/types').Product[]>;
  }

  export class ApiServiceFactory {
    static getProductService(): ProductServiceClient;
  }
}
