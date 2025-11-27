/**
 * Type definitions for the Product Microfrontend
 * 
 * This file re-exports types from the host application to avoid duplication.
 * All shared types are defined in the host and consumed by remotes.
 */

// @ts-ignore - Module Federation remote import
export type {
  Product,
  ProductImage,
  Category,
  ProductFilters,
  PaginatedResponse,
} from 'host/types';

// Product-specific types that are not in the host
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: Date;
  verified: boolean;
}
