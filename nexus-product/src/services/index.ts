

/**
 * Service clients for the Product Microfrontend
 * 
 * This file re-exports service clients from the host application to avoid duplication.
 * All shared services are defined in the host and consumed by remotes.
 */


import { ApiServiceFactory } from 'host/services';

// Re-export for convenience
export { ApiServiceFactory };

// Convenience function to get product service
export const getProductService = () => {
  return ApiServiceFactory.getProductService();
};
