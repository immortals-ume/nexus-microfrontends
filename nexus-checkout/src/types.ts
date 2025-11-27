/**
 * Type definitions for Checkout Microfrontend
 */

// Store types
export interface AppStore {
  cart: CartState;
  auth: AuthState;
  payment: PaymentState;
  ui: UIState;
}

export interface CartState {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  clearCart: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: ProductImage[];
  stock: number;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
}

export interface PaymentState {
  paymentIntent: PaymentIntent | null;
  selectedMethod: PaymentMethod | null;
  isProcessing: boolean;
  error: string | null;
  setSelectedMethod: (method: PaymentMethod | null) => void;
  setProcessing: (processing: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed';
  clientSecret: string;
}

export interface PaymentMethod {
  id?: string;
  type: 'credit_card' | 'debit_card' | 'paypal';
  last4?: string;
  brand?: string;
}

export interface UIState {
  isCartOpen: boolean;
  theme: 'light' | 'dark';
  isGlobalLoading: boolean;
  toggleCart: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Address types
export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

// Order types
export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: PaymentMethod;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface CreateOrderDto {
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethodId: string;
}

// Checkout step types
export type CheckoutStep = 'shipping' | 'payment' | 'review';

export interface CheckoutData {
  shippingAddress: Address | null;
  billingAddress: Address | null;
  paymentMethod: PaymentMethod | null;
  sameAsShipping: boolean;
}

// Payment processing types
export interface PaymentData {
  paymentMethodId: string;
  amount: number;
  currency: string;
}

export interface PaymentResult {
  success: boolean;
  paymentIntentId: string;
  status: string;
  error?: string;
}
