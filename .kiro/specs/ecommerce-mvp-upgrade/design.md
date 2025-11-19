# Design Document

## Overview

This design document outlines the architecture and implementation strategy for upgrading the Nexus microfrontend application into a FAANG-level e-commerce MVP. The design maintains the existing Module Federation architecture while introducing modern state management (Zustand), efficient data fetching (React Query), professional styling (Tailwind CSS), and robust backend integration (Axios).

The application will be structured as a host shell that orchestrates dedicated microfrontends, each aligned with a backend microservice:

**Customer-Facing Microfrontends:**
- **Product Microfrontend** (product-mfe) → product-service backend
- **Cart Microfrontend** (cart-mfe) → order-service backend (cart endpoints)
- **Checkout Microfrontend** (checkout-mfe) → order-service + payment-service backends
- **Order Microfrontend** (order-mfe) → order-service backend
- **Customer Microfrontend** (customer-mfe) → customer-service backend
- **Auth Microfrontend** (auth-mfe) → auth-service backend

**Admin Microfrontend:**
- **Admin Microfrontend** (admin-mfe) → product-service, order-service, customer-service, analytics-service backends
  - Combines all admin functionality in one microfrontend
  - Uses multiple backend services as needed

This architecture provides:
- **1:1 mapping** between frontend and backend services
- **Independent deployment** of each microfrontend
- **Team autonomy** - each team owns both frontend and backend for their domain
- **Technology flexibility** - each microfrontend can use different versions or libraries
- **Fault isolation** - failure in one microfrontend doesn't affect others
- **Scalability** - scale frontend and backend services independently

The design emphasizes performance, scalability, type safety, and developer experience while maintaining independent deployability of each microfrontend.

## Architecture

### High-Level Architecture

```
┌───────────────────────────────────────────────────────────────────────────────┐
│                          Host Application (Shell)                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │  Shared Infrastructure Layer                                             │ │
│  │  - Zustand Store (Global State)                                          │ │
│  │  - React Query Client (Data Fetching)                                    │ │
│  │  - Event Bus (Microfrontend Communication)                               │ │
│  │  - Shared UI Components                                                  │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                                │
│  Customer-Facing Microfrontends:                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ Product  │ │   Cart   │ │ Checkout │ │  Order   │ │ Customer │          │
│  │   MFE    │ │   MFE    │ │   MFE    │ │   MFE    │ │   MFE    │          │
│  │          │ │          │ │          │ │          │ │          │          │
│  │ - Browse │ │ - View   │ │ - Ship   │ │ - History│ │ - Profile│          │
│  │ - Search │ │ - Add    │ │ - Payment│ │ - Track  │ │ - Address│          │
│  │ - Filter │ │ - Update │ │ - Review │ │ - Details│ │ - Settings│         │
│  │ - Detail │ │ - Remove │ │ - Confirm│ │          │ │          │          │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │
│       │            │            │            │            │                 │
│  ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐ ┌────┴─────┐          │
│  │  Auth    │ │          │ │          │ │          │ │          │          │
│  │   MFE    │ │          │ │          │ │          │ │          │          │
│  │          │ │          │ │          │ │          │ │          │          │
│  │ - Login  │ │          │ │          │ │          │ │          │          │
│  │ - Register│ │          │ │          │ │          │ │          │          │
│  │ - Forgot │ │          │ │          │ │          │ │          │          │
│  └────┬─────┘ │          │ │          │ │          │ │          │          │
│       │       │          │ │          │ │          │ │          │          │
│                                                                                │
│  Admin Microfrontend:                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        Admin MFE                                     │    │
│  │                                                                       │    │
│  │  - Product Management (Create, Edit, Delete, Inventory)              │    │
│  │  - Order Management (View, Update, Fulfill, Cancel)                  │    │
│  │  - Customer Management (View, Edit, Roles, Support)                  │    │
│  │  - Analytics Dashboard (Dashboard, Reports, Charts, Metrics)         │    │
│  └───────────────────────────┬─────────────────────────────────────────┘    │
└─────────────────────────────┼──────────────────────────────────────────────│
└─────────┼────────────────┼────────────────┼────────────────┼───────────────┘
          │                │                │                │
          ▼                ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Backend Microservices                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │ Product  │ │  Order   │ │ Customer │ │ Payment  │ │   Auth   │         │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │ │ Service  │         │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘         │
│  ┌──────────┐ ┌──────────┐                                                  │
│  │Notification│ │Analytics │                                                 │
│  │ Service  │ │ Service  │                                                  │
│  └──────────┘ └──────────┘                                                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Microfrontend to Backend Service Mapping

| Microfrontend | Backend Service(s) | Port | Responsibilities |
|---------------|-------------------|------|------------------|
| **product-mfe** | product-service | 5173 | Product catalog, search, filters, product details |
| **cart-mfe** | order-service (cart endpoints) | 5174 | Shopping cart management, cart persistence |
| **checkout-mfe** | order-service, payment-service | 5175 | Checkout flow, payment processing, order creation |
| **order-mfe** | order-service | 5176 | Order history, order tracking, order details |
| **customer-mfe** | customer-service | 5177 | User profile, addresses, preferences |
| **auth-mfe** | auth-service | 5178 | Login, registration, password reset, token management |
| **admin-mfe** | product-service, order-service, customer-service, analytics-service | 5179 | All admin functionality: product management, order management, customer management, analytics dashboard |

### Technology Stack

**Frontend Core:**
- React 19.2.0 with TypeScript
- Vite 7.2.2 for build tooling
- Module Federation for microfrontend orchestration

**State Management:**
- Zustand 5.x for global state management
- React Context for localized state

**Data Fetching:**
- React Query (TanStack Query) 5.x for server state
- Axios 1.x for HTTP requests

**Styling:**
- Tailwind CSS 3.x for utility-first styling
- HeadlessUI for accessible components
- Framer Motion for animations

**Additional Libraries:**
- React Router 7.x for routing
- React Hook Form for form management
- Zod for schema validation
- date-fns for date manipulation
- react-hot-toast for notifications

## Components and Interfaces

### Microfrontend Component Breakdown

#### Host Application Components

The host application serves as the shell and provides shared infrastructure:

**Layout Components:**
- `AppShell`: Main application wrapper with routing
- `Header`: Global navigation bar with cart icon, user menu, search bar
- `Footer`: Site-wide footer with links and information
- `Sidebar`: Collapsible navigation sidebar for mobile
- `MobileMenu`: Mobile-specific navigation menu

**Shared Components:**
- `ErrorBoundary`: Catches errors from microfrontends
- `LoadingFallback`: Loading indicator for lazy-loaded microfrontends
- `Toast`: Global toast notification system
- `Modal`: Reusable modal component
- `ProtectedRoute`: Route guard for authentication

**Providers:**
- `QueryClientProvider`: React Query configuration
- `StoreProvider`: Zustand store provider
- `AuthProvider`: Authentication context provider
- `ThemeProvider`: Theme and styling context

#### Dashboard Microfrontend Components

The dashboard handles the customer-facing e-commerce experience:

**Product Catalog Components:**
- `ProductGrid`: Grid layout of product cards
- `ProductCard`: Individual product display with image, name, price, rating
- `ProductDetail`: Full product page with images, description, reviews
- `ProductImageGallery`: Image carousel for product photos
- `ProductReviews`: Customer reviews and ratings section
- `RelatedProducts`: Suggested products based on current product

**Search & Filter Components:**
- `SearchBar`: Product search input with autocomplete
- `FilterSidebar`: Category, price, and attribute filters
- `CategoryFilter`: Category selection component
- `PriceRangeFilter`: Min/max price slider
- `SortDropdown`: Sort options (price, rating, newest)
- `ActiveFilters`: Display and clear active filters
- `SearchResults`: Search results display with highlighting

**Shopping Cart Components:**
- `CartDrawer`: Slide-out cart panel
- `CartIcon`: Header cart icon with item count badge
- `CartItem`: Individual cart item with quantity controls
- `CartSummary`: Cart totals and checkout button
- `EmptyCart`: Empty cart state with CTA
- `MiniCart`: Compact cart preview on hover

**Checkout Components:**
- `CheckoutWizard`: Multi-step checkout flow container
- `ShippingForm`: Shipping address form with validation
- `PaymentForm`: Payment method selection and details
- `OrderReview`: Final order review before submission
- `OrderConfirmation`: Success page with order details
- `CheckoutProgress`: Step indicator for checkout flow

**Order Management Components:**
- `OrderHistory`: List of customer's past orders
- `OrderCard`: Summary card for each order
- `OrderDetail`: Detailed view of a single order
- `OrderStatus`: Visual order status indicator
- `TrackingInfo`: Shipping tracking information

**User Account Components:**
- `LoginForm`: User login form
- `RegisterForm`: New user registration form
- `ProfilePage`: User profile and settings
- `AddressBook`: Saved shipping addresses
- `PaymentMethods`: Saved payment methods
- `WishlistPage`: Saved products for later

#### Admin Microfrontend Components

The admin microfrontend handles product and order management:

**Dashboard Components:**
- `AdminDashboard`: Overview with key metrics
- `MetricsCards`: KPI cards (sales, orders, customers)
- `RecentOrders`: Latest orders table
- `LowStockAlerts`: Products with low inventory

**Product Management Components:**
- `ProductList`: Table of all products with actions
- `ProductForm`: Create/edit product form
- `ProductImageUploader`: Multi-image upload with preview
- `CategoryManager`: Create and manage categories
- `InventoryManager`: Stock level management
- `BulkActions`: Bulk edit/delete products
- `ProductImporter`: CSV import for products

**Order Management Components:**
- `OrdersTable`: Searchable, filterable orders table
- `OrderDetailAdmin`: Admin view of order details
- `OrderStatusUpdater`: Update order status
- `RefundProcessor`: Process refunds
- `ShippingLabelGenerator`: Generate shipping labels

**User Management Components:**
- `UsersTable`: List of all users
- `UserDetail`: View and edit user information
- `RoleManager`: Assign user roles and permissions
- `CustomerSupport`: Customer support ticket system

**Settings Components:**
- `GeneralSettings`: Site-wide settings
- `PaymentSettings`: Payment gateway configuration
- `ShippingSettings`: Shipping methods and rates
- `TaxSettings`: Tax rules configuration
- `EmailTemplates`: Customize email templates

#### Analytics Microfrontend Components

The analytics microfrontend provides business intelligence:

**Dashboard Components:**
- `AnalyticsDashboard`: Main analytics overview
- `DateRangePicker`: Select date range for reports
- `ExportButton`: Export data to CSV/PDF

**Chart Components:**
- `SalesChart`: Line chart of sales over time
- `RevenueChart`: Revenue trends and projections
- `OrdersChart`: Order volume over time
- `ConversionFunnel`: Conversion rate visualization
- `TopProductsChart`: Best-selling products bar chart
- `CategoryBreakdown`: Sales by category pie chart
- `CustomerSegmentation`: Customer demographics charts

**Report Components:**
- `SalesReport`: Detailed sales report
- `ProductPerformance`: Product-level analytics
- `CustomerReport`: Customer behavior analysis
- `TrafficReport`: Site traffic and sources
- `AbandonedCartReport`: Cart abandonment analysis

**Real-time Components:**
- `LiveVisitors`: Current active users
- `RecentTransactions`: Live transaction feed
- `AlertsPanel`: Anomaly detection alerts

### Shared Component Library

Components shared across all microfrontends:

**UI Components:**
- `Button`: Primary, secondary, outline, ghost variants
- `Input`: Text, email, password, number inputs
- `Select`: Dropdown select component
- `Checkbox`: Checkbox with label
- `Radio`: Radio button group
- `Switch`: Toggle switch
- `Textarea`: Multi-line text input
- `Badge`: Status and count badges
- `Avatar`: User avatar with fallback
- `Card`: Container card component
- `Tabs`: Tabbed interface component
- `Accordion`: Collapsible content sections
- `Tooltip`: Hover tooltip
- `Popover`: Click popover menu
- `Dropdown`: Dropdown menu
- `Pagination`: Page navigation
- `Table`: Data table with sorting
- `Skeleton`: Loading skeleton placeholders
- `Spinner`: Loading spinner
- `Progress`: Progress bar
- `Alert`: Alert messages
- `Breadcrumb`: Navigation breadcrumbs
- `Divider`: Visual separator

**Form Components:**
- `FormField`: Form field wrapper with label and error
- `FormError`: Error message display
- `FormLabel`: Form label component
- `FormHelperText`: Helper text for inputs
- `ValidationMessage`: Validation feedback

**Layout Components:**
- `Container`: Max-width container
- `Grid`: Responsive grid layout
- `Flex`: Flexbox layout
- `Stack`: Vertical/horizontal stack
- `Spacer`: Spacing component

### Shared Store Architecture (Zustand)

The application uses Zustand for centralized state management with slices corresponding to each backend service:

```typescript
// Store Structure - Each slice corresponds to a backend microservice
interface AppStore {
  // Auth Slice (auth-service backend)
  auth: {
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
    clearError: () => void;
  };
  
  // Product Slice (product-service backend)
  products: {
    items: Product[];
    selectedProduct: Product | null;
    filters: ProductFilters;
    isLoading: boolean;
    error: string | null;
    setFilters: (filters: ProductFilters) => void;
    setSelectedProduct: (product: Product | null) => void;
    clearError: () => void;
  };
  
  // Cart Slice (order-service backend - cart endpoints)
  cart: {
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
    syncWithBackend: () => Promise<void>;
  };
  
  // Order Slice (order-service backend)
  orders: {
    items: Order[];
    selectedOrder: Order | null;
    isLoading: boolean;
    error: string | null;
    setSelectedOrder: (order: Order | null) => void;
    clearError: () => void;
  };
  
  // Customer Slice (customer-service backend)
  customer: {
    profile: User | null;
    addresses: Address[];
    paymentMethods: PaymentMethod[];
    isLoading: boolean;
    error: string | null;
    updateProfile: (data: UpdateProfileDto) => Promise<void>;
    clearError: () => void;
  };
  
  // Payment Slice (payment-service backend)
  payment: {
    paymentIntent: PaymentIntent | null;
    selectedMethod: PaymentMethod | null;
    isProcessing: boolean;
    error: string | null;
    setSelectedMethod: (method: PaymentMethod | null) => void;
    clearError: () => void;
  };
  
  // Notification Slice (notification-service backend)
  notifications: {
    items: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearError: () => void;
  };
  
  // UI Slice (Frontend-only state)
  ui: {
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
  };
}

// Store Implementation with Slices
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

// Create store with middleware
export const useStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Auth slice implementation
        auth: createAuthSlice(set, get),
        
        // Product slice implementation
        products: createProductSlice(set, get),
        
        // Cart slice implementation
        cart: createCartSlice(set, get),
        
        // Order slice implementation
        orders: createOrderSlice(set, get),
        
        // Customer slice implementation
        customer: createCustomerSlice(set, get),
        
        // Payment slice implementation
        payment: createPaymentSlice(set, get),
        
        // Notification slice implementation
        notifications: createNotificationSlice(set, get),
        
        // UI slice implementation
        ui: createUISlice(set, get),
      }),
      {
        name: 'nexus-ecommerce-store',
        partialize: (state) => ({
          // Only persist certain slices
          auth: {
            token: state.auth.token,
            refreshToken: state.auth.refreshToken,
            user: state.auth.user,
          },
          cart: state.cart,
          ui: {
            theme: state.ui.theme,
          },
        }),
      }
    )
  )
);

// Example: Auth Slice Creator
const createAuthSlice = (set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  
  login: async (credentials) => {
    set((state) => ({ auth: { ...state.auth, isLoading: true, error: null } }));
    try {
      const authService = ApiServiceFactory.getAuthService();
      const response = await authService.login(credentials);
      
      set((state) => ({
        auth: {
          ...state.auth,
          user: response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          isAuthenticated: true,
          isLoading: false,
        },
      }));
      
      // Emit event for other microfrontends
      eventBus.emit('auth:login', { user: response.user });
    } catch (error) {
      set((state) => ({
        auth: {
          ...state.auth,
          isLoading: false,
          error: error.message,
        },
      }));
    }
  },
  
  logout: () => {
    const authService = ApiServiceFactory.getAuthService();
    authService.logout();
    
    set((state) => ({
      auth: {
        ...state.auth,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
      },
    }));
    
    // Clear other slices on logout
    get().cart.clearCart();
    
    // Emit event
    eventBus.emit('auth:logout');
  },
  
  // ... other auth methods
});

// Example: Cart Slice Creator
const createCartSlice = (set, get) => ({
  items: [],
  subtotal: 0,
  tax: 0,
  shipping: 0,
  total: 0,
  itemCount: 0,
  isLoading: false,
  error: null,
  
  addItem: (product, quantity) => {
    set((state) => {
      const existingItem = state.cart.items.find((item) => item.product.id === product.id);
      
      let newItems;
      if (existingItem) {
        newItems = state.cart.items.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.cart.items, { id: generateId(), product, quantity, subtotal: product.price * quantity }];
      }
      
      const subtotal = newItems.reduce((sum, item) => sum + item.subtotal, 0);
      const tax = subtotal * 0.1; // 10% tax
      const shipping = subtotal > 50 ? 0 : 5.99;
      const total = subtotal + tax + shipping;
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
      
      return {
        cart: {
          ...state.cart,
          items: newItems,
          subtotal,
          tax,
          shipping,
          total,
          itemCount,
        },
      };
    });
    
    // Persist to localStorage
    const cart = get().cart;
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Emit event
    eventBus.emit('cart:item-added', { productId: product.id, quantity });
    eventBus.emit('cart:updated', { itemCount: get().cart.itemCount, total: get().cart.total });
  },
  
  // ... other cart methods
});
```

### API Client Configuration (Axios)

Each backend microservice has a corresponding frontend service layer with its own Axios client instance. This provides:
- Service-specific base URLs
- Independent timeout configurations
- Service-specific interceptors
- Isolated error handling

```typescript
// Base Axios Configuration
interface BaseApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

// Service-Specific Axios Clients
class ProductServiceClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_PRODUCT_SERVICE_URL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors() {
    // Request interceptor: Add auth token
    this.client.interceptors.request.use((config) => {
      const token = useStore.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
    
    // Response interceptor: Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      (error) => this.handleError(error)
    );
  }
  
  private handleError(error: AxiosError) {
    if (error.response?.status === 401) {
      // Redirect to login
      useStore.getState().auth.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
}

class OrderServiceClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_ORDER_SERVICE_URL,
      timeout: 15000, // Longer timeout for order processing
      headers: { 'Content-Type': 'application/json' },
    });
    
    this.setupInterceptors();
  }
  
  // Similar interceptor setup
}

class CustomerServiceClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_CUSTOMER_SERVICE_URL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
    
    this.setupInterceptors();
  }
}

class PaymentServiceClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_PAYMENT_SERVICE_URL,
      timeout: 20000, // Longer timeout for payment processing
      headers: { 'Content-Type': 'application/json' },
    });
    
    this.setupInterceptors();
  }
}

class AuthServiceClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_AUTH_SERVICE_URL,
      timeout: 10000,
      headers: { 'Content-Type': 'application/json' },
    });
    
    // Auth service doesn't need auth token in requests
  }
}

class NotificationServiceClient {
  private client: AxiosInstance;
  
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_NOTIFICATION_SERVICE_URL,
      timeout: 5000,
      headers: { 'Content-Type': 'application/json' },
    });
    
    this.setupInterceptors();
  }
}

// API Service Layer - Maps to Backend Microservices
interface ApiServices {
  // Product Service (product-service backend)
  products: {
    getAll: (filters: ProductFilters) => Promise<PaginatedResponse<Product>>;
    getById: (id: string) => Promise<Product>;
    create: (product: CreateProductDto) => Promise<Product>;
    update: (id: string, product: UpdateProductDto) => Promise<Product>;
    delete: (id: string) => Promise<void>;
    search: (query: string) => Promise<Product[]>;
  };
  
  // Order Service (order-service backend)
  orders: {
    getAll: (userId: string) => Promise<Order[]>;
    getById: (id: string) => Promise<Order>;
    create: (order: CreateOrderDto) => Promise<Order>;
    updateStatus: (id: string, status: OrderStatus) => Promise<Order>;
    cancel: (id: string) => Promise<void>;
  };
  
  // Customer Service (customer-service backend)
  customers: {
    getProfile: () => Promise<User>;
    updateProfile: (data: UpdateProfileDto) => Promise<User>;
    getAddresses: () => Promise<Address[]>;
    addAddress: (address: Address) => Promise<Address>;
    updateAddress: (id: string, address: Address) => Promise<Address>;
    deleteAddress: (id: string) => Promise<void>;
  };
  
  // Payment Service (payment-service backend)
  payments: {
    createPaymentIntent: (amount: number) => Promise<PaymentIntent>;
    processPayment: (data: PaymentData) => Promise<PaymentResult>;
    getPaymentMethods: () => Promise<PaymentMethod[]>;
    addPaymentMethod: (method: PaymentMethod) => Promise<PaymentMethod>;
    deletePaymentMethod: (id: string) => Promise<void>;
  };
  
  // Auth Service (auth-service backend)
  auth: {
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    register: (data: RegisterData) => Promise<AuthResponse>;
    logout: () => Promise<void>;
    refreshToken: (refreshToken: string) => Promise<AuthResponse>;
    verifyToken: (token: string) => Promise<boolean>;
  };
  
  // Notification Service (notification-service backend)
  notifications: {
    getAll: () => Promise<Notification[]>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    subscribe: (subscription: PushSubscription) => Promise<void>;
  };
}

// Service Factory
class ApiServiceFactory {
  private static instances: Map<string, any> = new Map();
  
  static getProductService(): ProductServiceClient {
    if (!this.instances.has('product')) {
      this.instances.set('product', new ProductServiceClient());
    }
    return this.instances.get('product');
  }
  
  static getOrderService(): OrderServiceClient {
    if (!this.instances.has('order')) {
      this.instances.set('order', new OrderServiceClient());
    }
    return this.instances.get('order');
  }
  
  static getCustomerService(): CustomerServiceClient {
    if (!this.instances.has('customer')) {
      this.instances.set('customer', new CustomerServiceClient());
    }
    return this.instances.get('customer');
  }
  
  static getPaymentService(): PaymentServiceClient {
    if (!this.instances.has('payment')) {
      this.instances.set('payment', new PaymentServiceClient());
    }
    return this.instances.get('payment');
  }
  
  static getAuthService(): AuthServiceClient {
    if (!this.instances.has('auth')) {
      this.instances.set('auth', new AuthServiceClient());
    }
    return this.instances.get('auth');
  }
  
  static getNotificationService(): NotificationServiceClient {
    if (!this.instances.has('notification')) {
      this.instances.set('notification', new NotificationServiceClient());
    }
    return this.instances.get('notification');
  }
}
```

### React Query Configuration

```typescript
// Query Client Configuration
interface QueryConfig {
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000; // 5 minutes
      cacheTime: 10 * 60 * 1000; // 10 minutes
      retry: 3;
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000);
      refetchOnWindowFocus: true;
      refetchOnReconnect: true;
    };
    mutations: {
      retry: 1;
    };
  };
}

// Query Keys Structure
const queryKeys = {
  products: {
    all: ['products'] as const,
    lists: () => [...queryKeys.products.all, 'list'] as const,
    list: (filters: ProductFilters) => [...queryKeys.products.lists(), filters] as const,
    details: () => [...queryKeys.products.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.products.details(), id] as const,
  },
  cart: ['cart'] as const,
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.orders.all, 'detail', id] as const,
  },
};
```

### Event Bus for Microfrontend Communication

```typescript
// Type-safe Event Bus
interface EventBus {
  on<T>(event: string, handler: (data: T) => void): () => void;
  emit<T>(event: string, data: T): void;
  off(event: string, handler: Function): void;
}

// Event Types
type AppEvents = {
  'cart:updated': { itemCount: number; total: number };
  'cart:item-added': { productId: string; quantity: number };
  'cart:item-removed': { productId: string };
  'auth:login': { user: User };
  'auth:logout': void;
  'auth:token-refreshed': { token: string };
  'product:viewed': { productId: string };
  'product:created': { productId: string };
  'product:updated': { productId: string };
  'product:deleted': { productId: string };
  'order:created': { orderId: string; total: number };
  'order:status-changed': { orderId: string; status: OrderStatus };
  'navigation:change': { path: string };
  'theme:changed': { theme: 'light' | 'dark' };
};
```

### Component Communication Patterns

**Pattern 1: Host → Remote Communication**
The host application shares state and configuration to remotes through:
- Zustand store (accessed via useStore hook)
- React Context providers
- Props passed to remote components
- Event bus for imperative actions

```typescript
// Example: Host provides auth state to remotes
// Remote components access via useStore
const { user, isAuthenticated } = useStore((state) => state.auth);
```

**Pattern 2: Remote → Host Communication**
Remote microfrontends communicate back to host through:
- Event bus emissions
- Zustand store mutations
- Callback props
- URL navigation

```typescript
// Example: Dashboard emits cart update event
eventBus.emit('cart:updated', { itemCount: 5, total: 99.99 });

// Host listens and updates UI
eventBus.on('cart:updated', (data) => {
  // Update cart icon badge
});
```

**Pattern 3: Remote → Remote Communication**
Remotes communicate with each other through:
- Shared Zustand store
- Event bus (preferred for loose coupling)
- Shared React Context (for tightly coupled features)

```typescript
// Example: Admin creates product, Dashboard refreshes catalog
// Admin emits event
eventBus.emit('product:created', { productId: '123' });

// Dashboard listens and invalidates product cache
eventBus.on('product:created', () => {
  queryClient.invalidateQueries(['products']);
});
```

**Pattern 4: Component → API Communication**
All components use React Query hooks for API communication:

```typescript
// Example: Fetch products with caching
const { data, isLoading, error } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => api.products.getAll(filters),
  staleTime: 5 * 60 * 1000,
});

// Example: Create product with optimistic update
const mutation = useMutation({
  mutationFn: (product: Product) => api.products.create(product),
  onMutate: async (newProduct) => {
    // Optimistic update
    await queryClient.cancelQueries(['products']);
    const previous = queryClient.getQueryData(['products']);
    queryClient.setQueryData(['products'], (old) => [...old, newProduct]);
    return { previous };
  },
  onError: (err, newProduct, context) => {
    // Rollback on error
    queryClient.setQueryData(['products'], context.previous);
  },
  onSettled: () => {
    // Refetch after mutation
    queryClient.invalidateQueries(['products']);
  },
});
```

### Module Federation Configuration

Each microfrontend exposes specific components and consumes shared dependencies:

**Host Configuration:**
```typescript
// vite.config.ts - Host
export default defineConfig({
  plugins: [
    federation({
      name: 'host',
      remotes: {
        dashboard: 'http://localhost:5173/assets/remoteEntry.js',
        admin: 'http://localhost:5174/assets/remoteEntry.js',
        analytics: 'http://localhost:5175/assets/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^19.2.0' },
        'react-dom': { singleton: true, requiredVersion: '^19.2.0' },
        'react-router-dom': { singleton: true },
        zustand: { singleton: true },
        '@tanstack/react-query': { singleton: true },
        axios: { singleton: true },
      },
    }),
  ],
});
```

**Dashboard Configuration:**
```typescript
// vite.config.ts - Dashboard
export default defineConfig({
  plugins: [
    federation({
      name: 'dashboard',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
        './ProductCatalog': './src/pages/ProductCatalog.tsx',
        './ProductDetail': './src/pages/ProductDetail.tsx',
        './Cart': './src/components/Cart/CartDrawer.tsx',
        './Checkout': './src/pages/Checkout.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-router-dom': { singleton: true },
        zustand: { singleton: true },
        '@tanstack/react-query': { singleton: true },
        axios: { singleton: true },
      },
    }),
  ],
});
```

**Admin Configuration:**
```typescript
// vite.config.ts - Admin
export default defineConfig({
  plugins: [
    federation({
      name: 'admin',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
        './ProductManagement': './src/pages/ProductManagement.tsx',
        './OrderManagement': './src/pages/OrderManagement.tsx',
        './Dashboard': './src/pages/Dashboard.tsx',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-router-dom': { singleton: true },
        zustand: { singleton: true },
        '@tanstack/react-query': { singleton: true },
        axios: { singleton: true },
      },
    }),
  ],
});
```

**Analytics Configuration:**
```typescript
// vite.config.ts - Analytics
export default defineConfig({
  plugins: [
    federation({
      name: 'analytics',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
        './Dashboard': './src/pages/AnalyticsDashboard.tsx',
        './Reports': './src/pages/Reports.tsx',
        './Charts': './src/components/Charts/index.ts',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-router-dom': { singleton: true },
        zustand: { singleton: true },
        '@tanstack/react-query': { singleton: true },
        axios: { singleton: true },
        recharts: { singleton: true }, // Chart library
      },
    }),
  ],
});
```

## Data Models

### Core Domain Models

```typescript
// User Model
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'customer' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

// Product Model
interface Product {
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

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

// Category Model
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  imageUrl?: string;
}

// Cart Models
interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  itemCount: number;
}

// Order Models
interface Order {
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

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  subtotal: number;
}

type OrderStatus = 
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

interface Address {
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

interface PaymentMethod {
  type: 'credit_card' | 'debit_card' | 'paypal';
  last4?: string;
  brand?: string;
}

// Filter and Search Models
interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

Before defining the correctness properties, I've reviewed all testable criteria to eliminate redundancy:

**Redundancies Identified:**
- Properties 1.2 and 1.3 (state sharing and reactive updates) can be combined into a single comprehensive property about reactive state synchronization
- Properties 3.1 and 3.3 (cart updates and recalculation) both test cart total calculation and can be combined
- Properties 11.2 and 11.3 (cart and auth state propagation) are specific instances of the general event broadcasting property 11.1
- Properties 14.1, 14.2, 14.3, and 14.4 all test analytics event tracking and can be combined into one comprehensive property

**Properties to Combine:**
- Combine 1.2 and 1.3 into: "Reactive state synchronization across microfrontends"
- Combine 3.1 and 3.3 into: "Cart calculations maintain correctness"
- Combine 11.1, 11.2, and 11.3 into: "Event bus broadcasts to all listeners"
- Combine 14.1, 14.2, 14.3, and 14.4 into: "Analytics events are tracked"

### Correctness Properties

Property 1: Reactive state synchronization across microfrontends
*For any* state change in the Zustand store, all components subscribed to that state slice across all microfrontends should re-render with the updated state
**Validates: Requirements 1.2, 1.3**

Property 2: Cart persistence round-trip
*For any* cart modification, the cart state should be persisted to local storage and retrieving from local storage should yield the same cart state
**Validates: Requirements 1.4, 3.6**

Property 3: Authentication state propagation
*For any* authentication state change (login, logout, token refresh), all microfrontends should receive the updated authentication status
**Validates: Requirements 1.5**

Property 4: Product catalog completeness
*For any* product in the catalog, the rendered product card should contain all required fields: image, name, price, and rating
**Validates: Requirements 2.1**

Property 5: Search filter correctness
*For any* search query and product list, all returned products should match the search query in either name, description, or category
**Validates: Requirements 2.2, 15.1**

Property 6: Category filter correctness
*For any* selected category and product list, all returned products should belong to the selected category
**Validates: Requirements 2.3**

Property 7: Sort order invariant
*For any* sort criteria (price, rating, name) and product list, the resulting list should be properly ordered according to that criteria
**Validates: Requirements 2.4**

Property 8: Cart calculations maintain correctness
*For any* cart operation (add, update quantity, remove), the cart total should equal the sum of all item subtotals, and item count should equal the sum of all quantities
**Validates: Requirements 3.1, 3.3**

Property 9: Cart item removal
*For any* cart and item, after removing that item, the cart should not contain that item
**Validates: Requirements 3.4**

Property 10: Cart display completeness
*For any* cart state, the rendered cart should display all items with complete information: product details, quantities, and subtotals
**Validates: Requirements 3.2**

Property 11: Query cache TTL behavior
*For any* successfully fetched data, subsequent requests within the TTL period should be served from cache without making network requests
**Validates: Requirements 4.2**

Property 12: Mutation invalidation
*For any* mutation operation, all related query caches should be invalidated and refetched
**Validates: Requirements 4.4**

Property 13: Request retry with exponential backoff
*For any* failed network request, the system should retry up to 3 times with exponentially increasing delays
**Validates: Requirements 4.5**

Property 14: Authentication header inclusion
*For any* authenticated API request, the request headers should include the Authorization header with the authentication token
**Validates: Requirements 5.2**

Property 15: Network error handling
*For any* network error, a user-friendly error message should be displayed to the user
**Validates: Requirements 5.4**

Property 16: API response transformation
*For any* API response, the transformed data should conform to the application's data model schema
**Validates: Requirements 5.5**

Property 17: Global loading indicator
*For any* time when one or more API requests are pending, the global loading indicator should be visible
**Validates: Requirements 5.6**

Property 18: Session restoration round-trip
*For any* authenticated session, storing the token and restoring from storage should recreate the same authenticated state
**Validates: Requirements 6.4**

Property 19: Protected route authentication guard
*For any* protected route, accessing it without authentication should redirect to the login page
**Validates: Requirements 6.5**

Property 20: Shipping data validation
*For any* shipping information submitted, invalid data should be rejected with validation errors, and valid data should be accepted
**Validates: Requirements 7.2**

Property 21: Order history completeness
*For any* user's order history, all orders should be displayed with complete information: order number, date, and total
**Validates: Requirements 8.1**

Property 22: Order status updates
*For any* order status change, the order display should reflect the new status
**Validates: Requirements 8.3**

Property 23: Responsive layout adaptation
*For any* viewport size, the layout should adapt appropriately using the correct responsive breakpoint styles
**Validates: Requirements 9.2**

Property 24: Form validation state display
*For any* form with validation, inputs should display consistent styling and show validation error states for invalid fields
**Validates: Requirements 9.4**

Property 25: Lazy loading off-screen images
*For any* product image that is off-screen, the image should not load until it is scrolled into the viewport
**Validates: Requirements 10.2**

Property 26: Event bus broadcasting
*For any* event emitted through the event bus, all registered listeners for that event should receive the event data
**Validates: Requirements 11.1, 11.2, 11.3**

Property 27: Error boundary fallback
*For any* error thrown in a component tree, the error boundary should catch it and display the fallback UI
**Validates: Requirements 12.1**

Property 28: API error toast notifications
*For any* API request failure, a toast notification with the error message should be displayed
**Validates: Requirements 12.2**

Property 29: Form validation error display
*For any* invalid form field, an inline error message should be displayed next to that field
**Validates: Requirements 12.3**

Property 30: Network error retry availability
*For any* network error, a retry button should be available to attempt the operation again
**Validates: Requirements 12.4**

Property 31: Error logging
*For any* error that occurs, error details should be logged to the console or logging service
**Validates: Requirements 12.5**

Property 32: Product validation on creation
*For any* product creation attempt, invalid product data should be rejected with validation errors, and valid data should be saved
**Validates: Requirements 13.2**

Property 33: Optimistic product updates
*For any* product update, the UI should update immediately (optimistically), then sync with the server response
**Validates: Requirements 13.3**

Property 34: Product deletion with confirmation
*For any* product deletion that is confirmed, the product should be removed from the catalog
**Validates: Requirements 13.4**

Property 35: Analytics event tracking
*For any* trackable user action (product view, add to cart, purchase), an analytics event with the appropriate data should be tracked
**Validates: Requirements 14.1, 14.2, 14.3, 14.4**

Property 36: Price range filter correctness
*For any* price range filter applied, all returned products should have prices within the specified range
**Validates: Requirements 15.2**

Property 37: Multiple filter AND logic
*For any* combination of filters applied, returned products should match all applied filters (AND logic)
**Validates: Requirements 15.3**

## Error Handling

### Error Boundary Strategy

Each microfrontend will be wrapped in an error boundary to prevent cascading failures:

```typescript
interface ErrorBoundaryProps {
  name: string;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Error boundaries will:
// 1. Catch errors in child component trees
// 2. Log error details for debugging
// 3. Display user-friendly fallback UI
// 4. Provide a reset mechanism to recover
// 5. Prevent errors from crashing the entire application
```

### API Error Handling

```typescript
// Error Response Structure
interface ApiError {
  status: number;
  message: string;
  code: string;
  details?: Record<string, any>;
}

// Error Handling Strategy:
// 1. 401 Unauthorized: Redirect to login, clear auth state
// 2. 403 Forbidden: Show permission denied message
// 3. 404 Not Found: Show resource not found message
// 4. 422 Validation Error: Display field-level validation errors
// 5. 500 Server Error: Show generic error with retry option
// 6. Network Error: Show offline message with retry option
```

### Toast Notification System

```typescript
// Toast Types
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Toast will be used for:
// - Success confirmations (item added to cart, order placed)
// - Error messages (API failures, validation errors)
// - Warning messages (low stock, session expiring)
// - Info messages (background sync, updates available)
```

## Testing Strategy

### Unit Testing

Unit tests will focus on:
- Individual component rendering and behavior
- State management logic (Zustand store slices)
- Utility functions and helpers
- Form validation logic
- Data transformation functions
- Event bus functionality

**Testing Library:** Vitest with React Testing Library

**Example Test Cases:**
- Cart calculations are correct when adding/removing items
- Product filtering returns correct results
- Form validation catches invalid inputs
- Authentication state updates correctly
- Error boundaries catch and display errors

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using **fast-check** library for JavaScript/TypeScript.

**Configuration:**
- Minimum 100 iterations per property test
- Custom generators for domain models (Product, Cart, Order, User)
- Shrinking enabled to find minimal failing cases

**Property Test Requirements:**
- Each property-based test MUST run at least 100 iterations
- Each test MUST be tagged with: `// Feature: ecommerce-mvp-upgrade, Property {number}: {property_text}`
- Each correctness property MUST be implemented by a SINGLE property-based test
- Tests MUST use fast-check generators for input data

**Example Property Tests:**
- Property 8: Cart calculations - Generate random cart operations, verify totals are always correct
- Property 5: Search filter - Generate random search queries and product lists, verify all results match query
- Property 7: Sort order - Generate random product lists and sort criteria, verify proper ordering
- Property 2: Cart persistence - Generate random cart states, verify round-trip through local storage

### Integration Testing

Integration tests will verify:
- Microfrontend communication through event bus
- API integration with mock backend
- React Query cache behavior
- Authentication flow end-to-end
- Checkout process flow
- State synchronization across microfrontends

**Testing Library:** Vitest with MSW (Mock Service Worker) for API mocking

### End-to-End Testing

E2E tests will verify complete user flows:
- Browse products → Add to cart → Checkout → Order confirmation
- User registration → Login → Browse → Purchase
- Admin login → Create product → View in catalog
- Search and filter → View product details → Add to cart

**Testing Library:** Playwright

## Performance Considerations

### Code Splitting

- Each microfrontend is independently bundled and lazy-loaded
- Route-based code splitting within each microfrontend
- Dynamic imports for heavy components (charts, rich text editors)

### Image Optimization

- Use CDN for image delivery (Cloudinary or similar)
- Implement responsive images with srcset
- Lazy load images below the fold
- Use WebP format with fallbacks
- Implement blur-up placeholder technique

### State Management Performance

- Use Zustand's shallow equality check for subscriptions
- Implement selector functions to prevent unnecessary re-renders
- Use React.memo for expensive components
- Implement virtualization for long lists (react-window)

### React Query Optimization

- Configure appropriate stale times based on data volatility
- Use query prefetching for predictable navigation
- Implement optimistic updates for better perceived performance
- Use query cancellation for abandoned requests

## Security Considerations

### Authentication & Authorization

- JWT tokens stored in httpOnly cookies (preferred) or secure localStorage
- Token refresh mechanism before expiration
- CSRF protection for state-changing operations
- Role-based access control for admin features

### API Security

- HTTPS only for all API communication
- API request signing for sensitive operations
- Rate limiting on client side to prevent abuse
- Input sanitization before sending to backend

### XSS Prevention

- React's built-in XSS protection through JSX escaping
- Sanitize user-generated content before rendering
- Use Content Security Policy headers
- Avoid dangerouslySetInnerHTML unless absolutely necessary

## Deployment Strategy

### Build Process

```bash
# Build all microfrontends
npm run build:all

# Individual builds
npm run build:host
npm run build:dashboard
npm run build:admin
npm run build:analytics
```

### Environment Configuration

```typescript
// Environment variables for each environment
interface EnvironmentConfig {
  API_BASE_URL: string;
  CDN_URL: string;
  ANALYTICS_KEY: string;
  STRIPE_PUBLIC_KEY: string;
  ENVIRONMENT: 'development' | 'staging' | 'production';
}
```

### CDN Configuration

- Static assets served from CDN
- Cache-Control headers for optimal caching
- Versioned URLs for cache busting
- Gzip/Brotli compression enabled

### Monitoring & Observability

- Error tracking with Sentry or similar
- Performance monitoring with Web Vitals
- Analytics tracking with custom events
- API response time monitoring
- User session recording for debugging

## Migration Strategy

### Phase 1: Infrastructure Setup
1. Install and configure dependencies (Zustand, React Query, Tailwind, Axios)
2. Set up shared infrastructure layer in host application
3. Configure build tools and development environment
4. Set up testing infrastructure

### Phase 2: Core Features
1. Implement authentication system
2. Create product catalog with search and filtering
3. Build shopping cart functionality
4. Implement checkout flow

### Phase 3: Admin Features
1. Build admin dashboard
2. Implement product management
3. Add order management
4. Create analytics dashboard

### Phase 4: Polish & Optimization
1. Implement error handling and user feedback
2. Add loading states and skeleton loaders
3. Optimize performance (code splitting, lazy loading)
4. Add comprehensive testing

### Phase 5: Production Readiness
1. Security audit and hardening
2. Performance testing and optimization
3. Accessibility audit (WCAG 2.1 AA compliance)
4. Documentation and deployment guides

## Conclusion

This design provides a comprehensive blueprint for upgrading the Nexus microfrontend architecture into a production-ready e-commerce MVP. The architecture emphasizes:

- **Scalability**: Independent microfrontends that can scale separately
- **Performance**: Optimized data fetching, caching, and asset delivery
- **Developer Experience**: Modern tooling, type safety, and clear patterns
- **User Experience**: Responsive design, smooth interactions, clear feedback
- **Maintainability**: Clear separation of concerns, comprehensive testing
- **Production Readiness**: Security, error handling, monitoring, and observability

The implementation will follow the phased migration strategy to ensure incremental progress with working software at each stage.
