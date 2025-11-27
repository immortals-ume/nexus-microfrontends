/**
 * API Services
 * 
 * This module provides service clients for all backend microservices.
 * Each service client handles API communication with its corresponding backend service.
 * 
 * Usage:
 * ```typescript
 * import { ApiServiceFactory } from '@/services';
 * 
 * const productService = ApiServiceFactory.getProductService();
 * const products = await productService.getAll();
 * ```
 */

export { ProductServiceClient } from './ProductServiceClient';
export { OrderServiceClient } from './OrderServiceClient';
export { CustomerServiceClient } from './CustomerServiceClient';
export { PaymentServiceClient } from './PaymentServiceClient';
export { AuthServiceClient } from './AuthServiceClient';
export { NotificationServiceClient } from './NotificationServiceClient';
export { ApiServiceFactory } from './ApiServiceFactory';

// Export types
export type * from './types';
