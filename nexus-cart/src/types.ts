// Re-export types from host application
// These should match the types in nexus-microfrontend/src/store/types.ts

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
  cart: CartSlice;
  ui: UISlice;
  // Other slices omitted for cart microfrontend
}
