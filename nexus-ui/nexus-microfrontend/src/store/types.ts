// Core Domain Models

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

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

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Address {
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

export interface PaymentMethod {
  id?: string;
  type: 'credit_card' | 'debit_card' | 'paypal';
  last4?: string;
  brand?: string;
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

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
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

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  email?: string;
}

// Store Slice Types

export interface AuthSlice {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegisterData) => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  setUser: (user: User | null) => void;
  setToken: (token: string | null, refreshToken: string | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface ProductsSlice {
  items: Product[];
  selectedProduct: Product | null;
  filters: ProductFilters;
  isLoading: boolean;
  error: string | null;
  setItems: (items: Product[]) => void;
  setFilters: (filters: ProductFilters) => void;
  setSelectedProduct: (product: Product | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface CartSlice {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
  isLoading: boolean;
  error: string | null;
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface OrdersSlice {
  items: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  setItems: (items: Order[]) => void;
  setSelectedOrder: (order: Order | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface CustomerSlice {
  profile: User | null;
  addresses: Address[];
  paymentMethods: PaymentMethod[];
  isLoading: boolean;
  error: string | null;
  setProfile: (profile: User | null) => void;
  setAddresses: (addresses: Address[]) => void;
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  updateProfile: (data: UpdateProfileDto) => Promise<void>;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface PaymentSlice {
  paymentIntent: PaymentIntent | null;
  selectedMethod: PaymentMethod | null;
  isProcessing: boolean;
  error: string | null;
  setPaymentIntent: (intent: PaymentIntent | null) => void;
  setSelectedMethod: (method: PaymentMethod | null) => void;
  setProcessing: (isProcessing: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface NotificationsSlice {
  items: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  setItems: (items: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export interface UISlice {
  isSidebarOpen: boolean;
  isCartOpen: boolean;
  isMobileMenuOpen: boolean;
  theme: 'light' | 'dark';
  isGlobalLoading: boolean;
  activeRequests: number;
  toggleSidebar: () => void;
  toggleCart: () => void;
  toggleMobileMenu: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  incrementRequests: () => void;
  decrementRequests: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  setCartOpen: (isOpen: boolean) => void;
  setMobileMenuOpen: (isOpen: boolean) => void;
}

export interface AppStore {
  auth: AuthSlice;
  products: ProductsSlice;
  cart: CartSlice;
  orders: OrdersSlice;
  customer: CustomerSlice;
  payment: PaymentSlice;
  notifications: NotificationsSlice;
  ui: UISlice;
}
