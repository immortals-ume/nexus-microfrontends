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

**UI Framework & Component Libraries:**
- **Shadcn/ui** - Beautifully designed, accessible components built with Radix UI
- **Radix UI** - Unstyled, accessible component primitives
- **Tailwind CSS 3.x** - Utility-first CSS framework
- **Framer Motion** - Production-ready animation library
- **Lucide React** - Beautiful, consistent icon library
- **Recharts** - Composable charting library for analytics
- **React Table (TanStack Table)** - Headless UI for building powerful tables
- **Embla Carousel** - Lightweight carousel library for image galleries

**Form & Validation:**
- React Hook Form 7.x for performant form management
- Zod for schema validation and type safety
- @hookform/resolvers for React Hook Form + Zod integration

**Additional Libraries:**
- React Router 7.x for routing
- date-fns for date manipulation
- clsx + tailwind-merge for conditional class names
- react-hot-toast / Sonner for toast notifications
- vaul for drawer components
- cmdk for command palette

### UI Framework Architecture

The application uses a layered component architecture combining multiple UI frameworks:

**Layer 1: Primitive Components (Radix UI)**
- Provides unstyled, accessible primitives
- Handles complex accessibility patterns (ARIA, keyboard navigation, focus management)
- Components: Dialog, Dropdown Menu, Popover, Tabs, Accordion, Select, Checkbox, Radio Group, Slider, Switch, Toast, Tooltip, etc.

**Layer 2: Styled Components (Shadcn/ui)**
- Pre-styled components built on Radix UI primitives
- Customizable through Tailwind CSS
- Copy-paste approach - components live in your codebase
- Full control over styling and behavior
- Components include: Button, Card, Input, Label, Select, Dialog, Sheet, Dropdown Menu, Command, Table, Form, Badge, Avatar, Skeleton, etc.

**Layer 3: Composite Components (Custom)**
- Business-specific components built from Shadcn/ui
- Product-specific patterns (ProductCard, CartItem, CheckoutWizard)
- Feature-specific compositions (SearchBar with Command, FilterSidebar with Accordion)

**Layer 4: Page Components**
- Full page layouts combining all layers
- Route-level components
- Microfrontend entry points

**Design System Integration:**

```typescript
// Shadcn/ui Configuration
// components.json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "src/styles/globals.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}

// Tailwind CSS Variables for Theming
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --card: 0 0% 100%;
  --card-foreground: 222.2 84% 4.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 222.2 84% 4.9%;
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  --secondary: 210 40% 96.1%;
  --secondary-foreground: 222.2 47.4% 11.2%;
  --muted: 210 40% 96.1%;
  --muted-foreground: 215.4 16.3% 46.9%;
  --accent: 210 40% 96.1%;
  --accent-foreground: 222.2 47.4% 11.2%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 210 40% 98%;
  --border: 214.3 31.8% 91.4%;
  --input: 214.3 31.8% 91.4%;
  --ring: 221.2 83.2% 53.3%;
  --radius: 0.5rem;
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --card: 222.2 84% 4.9%;
  --card-foreground: 210 40% 98%;
  --popover: 222.2 84% 4.9%;
  --popover-foreground: 210 40% 98%;
  --primary: 217.2 91.2% 59.8%;
  --primary-foreground: 222.2 47.4% 11.2%;
  --secondary: 217.2 32.6% 17.5%;
  --secondary-foreground: 210 40% 98%;
  --muted: 217.2 32.6% 17.5%;
  --muted-foreground: 215 20.2% 65.1%;
  --accent: 217.2 32.6% 17.5%;
  --accent-foreground: 210 40% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 210 40% 98%;
  --border: 217.2 32.6% 17.5%;
  --input: 217.2 32.6% 17.5%;
  --ring: 224.3 76.3% 48%;
}
```

**Component Patterns:**

1. **Container/Presenter Pattern**
```typescript
// Container (Smart Component)
export function ProductListContainer() {
  const { data, isLoading } = useProducts();
  const addToCart = useCartStore((state) => state.addItem);
  
  return (
    <ProductListPresenter 
      products={data} 
      isLoading={isLoading}
      onAddToCart={addToCart}
    />
  );
}

// Presenter (Dumb Component)
export function ProductListPresenter({ products, isLoading, onAddToCart }) {
  if (isLoading) return <ProductGridSkeleton />;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard 
          key={product.id} 
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}
```

2. **Compound Components Pattern**
```typescript
// Accordion compound component from Radix/Shadcn
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Filter by Category</AccordionTrigger>
    <AccordionContent>
      <CategoryFilter />
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Filter by Price</AccordionTrigger>
    <AccordionContent>
      <PriceRangeFilter />
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

3. **Render Props Pattern**
```typescript
// Table with render props
<DataTable
  data={products}
  columns={columns}
  renderRow={(product) => (
    <TableRow key={product.id}>
      <TableCell>{product.name}</TableCell>
      <TableCell>{product.price}</TableCell>
      <TableCell>
        <Button onClick={() => handleEdit(product)}>Edit</Button>
      </TableCell>
    </TableRow>
  )}
/>
```

4. **Higher-Order Components (HOCs)**
```typescript
// withAuth HOC
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    
    useEffect(() => {
      if (!isAuthenticated) {
        navigate('/login');
      }
    }, [isAuthenticated, navigate]);
    
    if (!isAuthenticated) return null;
    
    return <Component {...props} />;
  };
}

// Usage
export const ProtectedDashboard = withAuth(Dashboard);
```

5. **Provider Pattern**
```typescript
// Theme Provider
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
```

6. **Factory Pattern**
```typescript
// Component Factory
export function createFormField(type: 'input' | 'select' | 'textarea') {
  const components = {
    input: Input,
    select: Select,
    textarea: Textarea,
  };
  
  return function FormField({ name, label, ...props }) {
    const Component = components[type];
    return (
      <div className="space-y-2">
        <Label htmlFor={name}>{label}</Label>
        <Component id={name} name={name} {...props} />
      </div>
    );
  };
}

const InputField = createFormField('input');
const SelectField = createFormField('select');
```

7. **State Reducer Pattern**
```typescript
// Complex form state with reducer
type FormAction = 
  | { type: 'SET_FIELD'; field: string; value: any }
  | { type: 'SET_ERROR'; field: string; error: string }
  | { type: 'RESET' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        values: { ...state.values, [action.field]: action.value },
      };
    case 'SET_ERROR':
      return {
        ...state,
        errors: { ...state.errors, [action.field]: action.error },
      };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

export function useFormState() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  return { state, dispatch };
}
```

8. **Command Pattern (Undo/Redo)**
```typescript
// Command pattern for cart operations
interface Command {
  execute(): void;
  undo(): void;
}

class AddToCartCommand implements Command {
  constructor(
    private cartStore: CartStore,
    private product: Product,
    private quantity: number
  ) {}
  
  execute() {
    this.cartStore.addItem(this.product, this.quantity);
  }
  
  undo() {
    this.cartStore.removeItem(this.product.id);
  }
}

// Command Manager
class CommandManager {
  private history: Command[] = [];
  private currentIndex = -1;
  
  execute(command: Command) {
    command.execute();
    this.history = this.history.slice(0, this.currentIndex + 1);
    this.history.push(command);
    this.currentIndex++;
  }
  
  undo() {
    if (this.currentIndex >= 0) {
      this.history[this.currentIndex].undo();
      this.currentIndex--;
    }
  }
  
  redo() {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++;
      this.history[this.currentIndex].execute();
    }
  }
}
```

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

### Shared Component Library (Shadcn/ui + Custom)

Components shared across all microfrontends, organized by category:

**Core UI Components (Shadcn/ui):**
- `Button`: Multiple variants (default, destructive, outline, secondary, ghost, link) with size options
- `Input`: Styled text inputs with focus states and error handling
- `Label`: Accessible form labels
- `Select`: Dropdown select with search and multi-select support
- `Checkbox`: Accessible checkbox with indeterminate state
- `RadioGroup`: Radio button group with proper ARIA
- `Switch`: Toggle switch component
- `Textarea`: Multi-line text input with auto-resize
- `Slider`: Range slider for price filters
- `Badge`: Status badges with variants (default, secondary, destructive, outline)
- `Avatar`: User avatar with fallback and status indicator
- `Card`: Container with header, content, footer sections
- `Separator`: Visual divider component
- `Skeleton`: Loading skeleton with animation

**Navigation Components (Shadcn/ui):**
- `NavigationMenu`: Accessible navigation with dropdowns
- `Breadcrumb`: Navigation breadcrumbs
- `Tabs`: Tabbed interface with keyboard navigation
- `Pagination`: Page navigation with ellipsis

**Overlay Components (Shadcn/ui):**
- `Dialog`: Modal dialog with backdrop
- `Sheet`: Slide-out drawer (for cart, filters)
- `Popover`: Floating popover menu
- `DropdownMenu`: Context menu with submenus
- `Tooltip`: Hover tooltip with delay
- `HoverCard`: Rich hover card with content
- `AlertDialog`: Confirmation dialog
- `Command`: Command palette (⌘K) for search

**Feedback Components (Shadcn/ui):**
- `Alert`: Alert messages with variants
- `Toast` / `Sonner`: Toast notifications
- `Progress`: Progress bar and circular progress
- `Spinner`: Loading spinner

**Data Display Components (Shadcn/ui + TanStack Table):**
- `Table`: Data table with sorting, filtering, pagination
- `DataTable`: Advanced table with column visibility, row selection
- `Accordion`: Collapsible content sections
- `Collapsible`: Simple collapsible component
- `AspectRatio`: Maintain aspect ratio for images

**Form Components (Shadcn/ui + React Hook Form):**
- `Form`: Form wrapper with React Hook Form integration
- `FormField`: Field wrapper with label, input, error
- `FormItem`: Form item container
- `FormLabel`: Accessible form label
- `FormControl`: Form control wrapper
- `FormDescription`: Helper text for inputs
- `FormMessage`: Validation error message
- `Calendar`: Date picker calendar
- `DatePicker`: Date input with calendar popup
- `Combobox`: Searchable select dropdown

**Layout Components (Custom):**
- `Container`: Max-width container with responsive padding
- `Grid`: Responsive grid layout
- `Flex`: Flexbox layout utility
- `Stack`: Vertical/horizontal stack with gap
- `Spacer`: Spacing component
- `ScrollArea`: Custom scrollbar area

**E-commerce Specific Components (Custom):**
- `ProductCard`: Product display card with image, price, rating
- `ProductGrid`: Responsive product grid with skeleton loading
- `ProductImageGallery`: Image carousel with thumbnails (Embla Carousel)
- `PriceDisplay`: Formatted price with currency
- `RatingStars`: Star rating display and input
- `QuantitySelector`: Quantity input with +/- buttons
- `CartItemCard`: Cart item with image, details, quantity controls
- `OrderStatusBadge`: Order status with color coding
- `SearchBar`: Search input with Command integration
- `FilterPanel`: Filter sidebar with Accordion
- `SortDropdown`: Sort options dropdown

**Chart Components (Recharts):**
- `LineChart`: Line chart for trends
- `BarChart`: Bar chart for comparisons
- `PieChart`: Pie chart for distributions
- `AreaChart`: Area chart for cumulative data
- `ComposedChart`: Combined chart types

**Utility Components:**
- `ErrorBoundary`: Error boundary with fallback UI
- `LoadingFallback`: Loading state component
- `EmptyState`: Empty state with illustration and CTA
- `ConfirmDialog`: Reusable confirmation dialog
- `ImageUpload`: Image upload with preview
- `CopyButton`: Copy to clipboard button
- `ThemeToggle`: Light/dark mode toggle

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

## UI/UX Design System

### Design Principles

The e-commerce platform follows these core design principles:

1. **Modern & Premium**: Clean, spacious layouts with subtle shadows and smooth animations
2. **Delightful Interactions**: Micro-interactions that provide feedback and create joy
3. **Accessible**: WCAG 2.1 AA compliant with proper contrast, focus states, and keyboard navigation
4. **Performant**: Optimized animations using CSS transforms and GPU acceleration
5. **Responsive**: Mobile-first approach with fluid layouts across all devices

### Color System

```typescript
// Tailwind CSS Color Palette
const colors = {
  // Primary Brand Colors
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',  // Main primary
    600: '#4f46e5',  // Primary hover
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
  },
  
  // Secondary Colors
  secondary: {
    500: '#a855f7',  // Purple
    600: '#9333ea',
  },
  
  // Accent Colors
  accent: {
    500: '#ec4899',  // Pink
    600: '#db2777',
  },
  
  // Semantic Colors
  success: {
    50: '#f0fdf4',
    500: '#10b981',  // Emerald
    600: '#059669',
  },
  
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',  // Amber
    600: '#d97706',
  },
  
  error: {
    50: '#fef2f2',
    500: '#ef4444',  // Red
    600: '#dc2626',
  },
  
  // Neutral Grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};
```

### Typography System

```typescript
// Font Configuration
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Inter', 'system-ui', 'sans-serif'],
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],      // 12px
    sm: ['0.875rem', { lineHeight: '1.25rem' }],  // 14px
    base: ['1rem', { lineHeight: '1.5rem' }],     // 16px
    lg: ['1.125rem', { lineHeight: '1.75rem' }],  // 18px
    xl: ['1.25rem', { lineHeight: '1.75rem' }],   // 20px
    '2xl': ['1.5rem', { lineHeight: '2rem' }],    // 24px
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
    '5xl': ['3rem', { lineHeight: '1' }],           // 48px
    '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};
```

### Spacing System

```typescript
// 4px base unit spacing scale
const spacing = {
  0: '0px',
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '20px',
  6: '24px',
  8: '32px',
  10: '40px',
  12: '48px',
  16: '64px',
  20: '80px',
  24: '96px',
  32: '128px',
};
```

### Component Design Specifications

#### Button Component

```typescript
// Button Variants with Tailwind Classes
const buttonStyles = {
  // Primary Button
  primary: `
    inline-flex items-center justify-center
    px-6 py-3 rounded-lg
    bg-primary-600 text-white font-semibold
    shadow-md hover:shadow-lg
    hover:bg-primary-700 hover:scale-[1.02]
    active:scale-[0.98]
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
  `,
  
  // Secondary Button
  secondary: `
    inline-flex items-center justify-center
    px-6 py-3 rounded-lg
    bg-white text-primary-600 font-semibold
    border-2 border-primary-600
    hover:bg-primary-50 hover:scale-[1.02]
    active:scale-[0.98]
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  `,
  
  // Ghost Button
  ghost: `
    inline-flex items-center justify-center
    px-6 py-3 rounded-lg
    text-gray-700 font-medium
    hover:bg-gray-100 hover:scale-[1.02]
    active:scale-[0.98]
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
  `,
  
  // Icon Button
  icon: `
    inline-flex items-center justify-center
    w-10 h-10 rounded-full
    text-gray-600 hover:text-primary-600
    hover:bg-gray-100 hover:scale-110
    active:scale-95
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
  `,
};
```

#### Card Component

```typescript
// Product Card Design
const productCardStyles = `
  group relative
  bg-white rounded-xl overflow-hidden
  shadow-sm hover:shadow-xl
  transition-all duration-300 ease-out
  hover:-translate-y-1
  cursor-pointer
`;

const productImageStyles = `
  aspect-square w-full object-cover
  group-hover:scale-105
  transition-transform duration-500 ease-out
`;

const productBadgeStyles = `
  absolute top-3 right-3
  px-3 py-1 rounded-full
  bg-accent-500 text-white text-xs font-semibold
  shadow-md
  animate-pulse
`;
```

#### Input Component

```typescript
// Modern Input with Floating Label
const inputContainerStyles = `
  relative w-full
`;

const inputStyles = `
  peer w-full px-4 py-3 rounded-lg
  border-2 border-gray-300
  bg-white text-gray-900
  placeholder-transparent
  focus:border-primary-500 focus:ring-4 focus:ring-primary-100
  transition-all duration-200 ease-out
  disabled:bg-gray-100 disabled:cursor-not-allowed
`;

const labelStyles = `
  absolute left-4 -top-2.5 px-1
  bg-white text-sm font-medium text-gray-600
  peer-placeholder-shown:text-base peer-placeholder-shown:top-3
  peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-primary-600
  transition-all duration-200 ease-out
  pointer-events-none
`;

const errorStyles = `
  mt-1 text-sm text-error-600
  animate-shake
`;
```

#### Modal/Drawer Component

```typescript
// Modal Overlay
const modalOverlayStyles = `
  fixed inset-0 z-50
  bg-black/50 backdrop-blur-sm
  animate-fade-in
`;

// Modal Content
const modalContentStyles = `
  fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
  w-full max-w-lg max-h-[90vh]
  bg-white rounded-2xl shadow-2xl
  overflow-hidden
  animate-scale-in
`;

// Drawer (Cart)
const drawerStyles = `
  fixed top-0 right-0 bottom-0 z-50
  w-full max-w-md
  bg-white shadow-2xl
  overflow-y-auto
  animate-slide-in-right
`;
```

#### Skeleton Loader

```typescript
// Skeleton with Shimmer Effect
const skeletonStyles = `
  relative overflow-hidden
  bg-gray-200 rounded-lg
  before:absolute before:inset-0
  before:-translate-x-full
  before:animate-shimmer
  before:bg-gradient-to-r
  before:from-transparent before:via-white/60 before:to-transparent
`;
```

### Animation Specifications

```typescript
// Tailwind Animation Extensions
const animations = {
  // Fade In
  'fade-in': {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  
  // Scale In
  'scale-in': {
    '0%': { opacity: '0', transform: 'scale(0.95)' },
    '100%': { opacity: '1', transform: 'scale(1)' },
  },
  
  // Slide In Right
  'slide-in-right': {
    '0%': { transform: 'translateX(100%)' },
    '100%': { transform: 'translateX(0)' },
  },
  
  // Slide In Up
  'slide-in-up': {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
  
  // Shimmer
  'shimmer': {
    '100%': { transform: 'translateX(100%)' },
  },
  
  // Shake (for errors)
  'shake': {
    '0%, 100%': { transform: 'translateX(0)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
  },
  
  // Bounce (for notifications)
  'bounce-in': {
    '0%': { opacity: '0', transform: 'translateY(-20px)' },
    '50%': { transform: 'translateY(5px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' },
  },
};
```

### Page Layout Specifications

#### Product Catalog Page

```typescript
// Hero Section
const heroStyles = `
  relative h-[500px] overflow-hidden
  bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600
`;

const heroContentStyles = `
  relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
  h-full flex flex-col justify-center items-start
  text-white
`;

const heroTitleStyles = `
  text-5xl md:text-6xl lg:text-7xl font-bold
  mb-6 animate-slide-in-up
`;

const heroCTAStyles = `
  inline-flex items-center gap-2
  px-8 py-4 rounded-full
  bg-white text-primary-600 font-bold text-lg
  shadow-xl hover:shadow-2xl
  hover:scale-105 active:scale-95
  transition-all duration-200 ease-out
`;

// Product Grid
const productGridStyles = `
  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
  gap-6 lg:gap-8
  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
  py-12
`;
```

#### Product Detail Page

```typescript
// Image Gallery
const imageGalleryStyles = `
  grid grid-cols-1 lg:grid-cols-2 gap-8
  max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12
`;

const mainImageStyles = `
  aspect-square rounded-2xl overflow-hidden
  shadow-lg
`;

const thumbnailGridStyles = `
  grid grid-cols-4 gap-4 mt-4
`;

const thumbnailStyles = `
  aspect-square rounded-lg overflow-hidden
  border-2 border-transparent
  hover:border-primary-500
  cursor-pointer
  transition-all duration-200
`;

// Product Info
const productInfoStyles = `
  space-y-6
`;

const productTitleStyles = `
  text-4xl font-bold text-gray-900
`;

const productPriceStyles = `
  text-3xl font-bold text-primary-600
`;

const productRatingStyles = `
  flex items-center gap-2
`;

const addToCartButtonStyles = `
  w-full py-4 rounded-xl
  bg-primary-600 text-white font-bold text-lg
  shadow-lg hover:shadow-xl
  hover:bg-primary-700 hover:scale-[1.02]
  active:scale-[0.98]
  transition-all duration-200 ease-out
`;
```

#### Checkout Page

```typescript
// Checkout Container
const checkoutContainerStyles = `
  max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12
  grid grid-cols-1 lg:grid-cols-3 gap-8
`;

// Checkout Form
const checkoutFormStyles = `
  lg:col-span-2 space-y-8
`;

// Step Indicator
const stepIndicatorStyles = `
  flex items-center justify-between mb-8
`;

const stepStyles = `
  flex items-center gap-3
`;

const stepNumberStyles = `
  w-10 h-10 rounded-full
  flex items-center justify-center
  font-bold text-lg
  transition-all duration-300
`;

const stepNumberActiveStyles = `
  bg-primary-600 text-white
  shadow-lg scale-110
`;

const stepNumberCompleteStyles = `
  bg-success-500 text-white
  shadow-md
`;

const stepNumberInactiveStyles = `
  bg-gray-200 text-gray-500
`;

// Order Summary
const orderSummaryStyles = `
  lg:col-span-1
  bg-gray-50 rounded-2xl p-6
  h-fit sticky top-24
  shadow-lg
`;
```

### Micro-interactions

```typescript
// Hover Effects
const hoverEffects = {
  // Card Lift
  cardLift: 'hover:-translate-y-1 hover:shadow-xl transition-all duration-300',
  
  // Button Press
  buttonPress: 'hover:scale-[1.02] active:scale-[0.98] transition-transform duration-150',
  
  // Image Zoom
  imageZoom: 'group-hover:scale-105 transition-transform duration-500',
  
  // Icon Bounce
  iconBounce: 'hover:scale-110 hover:rotate-12 transition-all duration-200',
  
  // Glow Effect
  glow: 'hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-shadow duration-300',
};

// Loading States
const loadingStates = {
  // Spinner
  spinner: 'animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-primary-600',
  
  // Pulse
  pulse: 'animate-pulse bg-gray-200 rounded',
  
  // Progress Bar
  progressBar: 'h-1 bg-primary-600 animate-progress',
};

// Success Feedback
const successFeedback = {
  // Checkmark Animation
  checkmark: 'animate-scale-in text-success-500',
  
  // Success Toast
  toast: 'animate-bounce-in bg-success-50 border-l-4 border-success-500',
};
```

### Responsive Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Wide desktop
  '2xl': '1536px', // Ultra-wide
};

// Usage Examples
const responsiveGrid = `
  grid grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
  xl:grid-cols-5
  gap-4 md:gap-6 lg:gap-8
`;

const responsivePadding = `
  px-4 sm:px-6 lg:px-8
  py-8 sm:py-12 lg:py-16
`;

const responsiveText = `
  text-2xl sm:text-3xl md:text-4xl lg:text-5xl
`;
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

Property 38: Design system color consistency
*For any* component rendered, all colors used should come from the defined design system palette
**Validates: Requirements 31.1**

Property 39: Typography scale consistency
*For any* text element, the font size and line height should match the defined typography scale
**Validates: Requirements 31.2**

Property 40: Spacing system consistency
*For any* spacing applied (padding, margin, gap), the value should be a multiple of the 4px base unit
**Validates: Requirements 31.3**

Property 41: Button interaction feedback
*For any* button interaction (hover, active, focus), appropriate visual feedback should be provided with smooth transitions
**Validates: Requirements 31.4**

Property 42: Card hover effects
*For any* product card hovered, the card should lift with shadow elevation and the image should zoom smoothly
**Validates: Requirements 31.5**

Property 43: Modal animation consistency
*For any* modal opened, it should animate in with scale and fade effects combined with backdrop blur
**Validates: Requirements 31.10**

Property 44: Form validation animation
*For any* form validation error, the error message should animate in with shake effect
**Validates: Requirements 31.8**

Property 45: Image loading placeholder
*For any* image loading, a blur-up placeholder should be displayed with smooth fade-in transition
**Validates: Requirements 31.9**

Property 46: Responsive layout adaptation
*For any* viewport size change, the layout should adapt smoothly using the defined breakpoints without content overflow
**Validates: Requirements 31.7**

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
