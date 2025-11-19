import { ProductServiceClient } from './ProductServiceClient';
import { OrderServiceClient } from './OrderServiceClient';
import { CustomerServiceClient } from './CustomerServiceClient';
import { PaymentServiceClient } from './PaymentServiceClient';
import { AuthServiceClient } from './AuthServiceClient';
import { NotificationServiceClient } from './NotificationServiceClient';

/**
 * API Service Factory
 * Provides singleton instances of all service clients
 * 
 * This factory ensures that only one instance of each service client exists,
 * which is important for:
 * - Consistent interceptor behavior
 * - Efficient memory usage
 * - Shared request/response handling
 */
export class ApiServiceFactory {
  private static instances: Map<string, any> = new Map();

  /**
   * Get Product Service instance
   */
  static getProductService(): ProductServiceClient {
    if (!this.instances.has('product')) {
      this.instances.set('product', new ProductServiceClient());
    }
    return this.instances.get('product')!;
  }

  /**
   * Get Order Service instance
   */
  static getOrderService(): OrderServiceClient {
    if (!this.instances.has('order')) {
      this.instances.set('order', new OrderServiceClient());
    }
    return this.instances.get('order')!;
  }

  /**
   * Get Customer Service instance
   */
  static getCustomerService(): CustomerServiceClient {
    if (!this.instances.has('customer')) {
      this.instances.set('customer', new CustomerServiceClient());
    }
    return this.instances.get('customer')!;
  }

  /**
   * Get Payment Service instance
   */
  static getPaymentService(): PaymentServiceClient {
    if (!this.instances.has('payment')) {
      this.instances.set('payment', new PaymentServiceClient());
    }
    return this.instances.get('payment')!;
  }

  /**
   * Get Auth Service instance
   */
  static getAuthService(): AuthServiceClient {
    if (!this.instances.has('auth')) {
      this.instances.set('auth', new AuthServiceClient());
    }
    return this.instances.get('auth')!;
  }

  /**
   * Get Notification Service instance
   */
  static getNotificationService(): NotificationServiceClient {
    if (!this.instances.has('notification')) {
      this.instances.set('notification', new NotificationServiceClient());
    }
    return this.instances.get('notification')!;
  }

  /**
   * Clear all service instances (useful for testing)
   */
  static clearInstances(): void {
    this.instances.clear();
  }

  /**
   * Get all service instances (useful for debugging)
   */
  static getAllInstances(): Map<string, any> {
    return new Map(this.instances);
  }
}
