# Nexus E-Commerce Microfrontend Platform

A e-commerce application built with React, TypeScript, and Module Federation. Features modern state management, responsive design, and a scalable microfrontend architecture.
## 🚀 Features

- **Microfrontend Architecture** - Independent, deployable modules using Module Federation
- **Modern State Management** - Zustand for global state with persistence
- **Efficient Data Fetching** - React Query with caching and optimistic updates
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Smooth Animations** - Framer Motion for delightful user experiences
- **Loading States** - Skeleton loaders with shimmer effects
- **Type Safety** - Full TypeScript coverage
- **Testing** - Vitest + React Testing Library + Property-Based Testing

## 📦 Microfrontends

| Microfrontend | Port | Description |
|---------------|------|-------------|
| **Host** | 5173 | Main shell application |
| **Product** | 5174 | Product catalog, search, and filters |
| **Cart** | 5175 | Shopping cart management |
| **Checkout** | 5176 | Multi-step checkout flow |
| **Order** | 5177 | Order history and tracking |
| **Customer** | 5178 | User profile and settings |
| **Auth** | 5179 | Authentication and registration |
| **Admin** | 5180 | Product and order management |

## 🛠️ Tech Stack

### Core
- **React 19.2** - UI library
- **TypeScript** - Type safety
- **Vite 7.2** - Build tool
- **Module Federation** - Microfrontend orchestration

### State & Data
- **Zustand 5.x** - State management
- **React Query 5.x** - Server state & caching
- **Axios 1.x** - HTTP client

### UI & Styling
- **Tailwind CSS 4.x** - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Radix UI** - Accessible primitives

### Testing
- **Vitest** - Unit testing
- **React Testing Library** - Component testing
- **fast-check** - Property-based testing

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/immortals-ume/nexus-microfrontends.git
cd nexus-ui

# Install dependencies for all microfrontends
npm install --prefix nexus-microfrontend
npm install --prefix nexus-product
npm install --prefix nexus-cart
npm install --prefix nexus-order
npm install --prefix nexus-customer
npm install --prefix nexus-auth
npm install --prefix nexus-admin
```

### Development

Run all microfrontends concurrently:

```bash
# Using the provided script
./scripts/run-all.sh
```

Or run individually:

```bash
# Host application
cd nexus-microfrontend && npm run dev

# Product microfrontend
cd nexus-product && npm run dev

# Cart microfrontend
cd nexus-cart && npm run dev

# And so on...
```

Access the application at `http://localhost:5173`

### Testing

```bash
# Run tests for a specific microfrontend
cd nexus-microfrontend
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test
```

## 📁 Project Structure

```
nexus-ui/
├── nexus-microfrontend/     # Host application
│   ├── src/
│   │   ├── components/      # Shared components
│   │   │   ├── ui/         # UI component library
│   │   │   ├── hoc/        # Higher-order components
│   │   │   └── patterns/   # Component patterns
│   │   ├── store/          # Zustand store
│   │   │   └── slices/     # Store slices
│   │   ├── services/       # API clients
│   │   ├── hooks/          # Custom hooks
│   │   ├── utils/          # Utilities
│   │   │   ├── animations.ts
│   │   │   ├── responsive.ts
│   │   │   └── errorHandler.ts
│   │   └── providers/      # Context providers
│   └── package.json
├── nexus-product/           # Product microfrontend
├── nexus-cart/             # Cart microfrontend
├── nexus-order/            # Order microfrontend
├── nexus-customer/         # Customer microfrontend
├── nexus-auth/             # Auth microfrontend
├── nexus-admin/            # Admin microfrontend
└── scripts/                # Build and run scripts
```

## 🎨 UI Components

### Shared Component Library

Located in `nexus-microfrontend/src/components/ui/`:

- **Layout**: Container, Grid, Flex, Stack
- **Forms**: Input, Select, Checkbox, Radio, Switch, Textarea
- **Feedback**: Alert, Toast, Progress, Spinner, Skeleton
- **Navigation**: Tabs, Accordion, Pagination, Breadcrumb
- **Overlays**: Modal, Drawer, Popover, Dropdown, Tooltip
- **Data Display**: Table, Card, Badge, Avatar
- **Animated**: FadeIn, SlideUp, AnimatedCard, StaggerContainer

### Skeleton Loaders

Pre-built skeleton loaders with shimmer effects:

```typescript
import { 
  ProductGridSkeleton, 
  CartSkeleton, 
  OrderListSkeleton 
} from '@/components/ui/SkeletonLoaders';
```

### Loading States

```typescript
import { 
  PageLoading, 
  InlineLoading, 
  GlobalLoadingBar 
} from '@/components/ui/LoadingState';
```

## 🎭 Animations

Framer Motion utilities in `src/utils/animations.ts`:

```typescript
import { 
  fadeInVariants, 
  slideUpVariants, 
  staggerContainer 
} from '@/utils/animations';
```

## 📱 Responsive Design

### Breakpoints

```typescript
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop
  xl: '1280px',  // Wide desktop
  '2xl': '1536px' // Ultra-wide
};
```

### Responsive Utilities

```typescript
import { 
  responsiveClasses, 
  getResponsiveColumns 
} from '@/utils/responsive';
```

### Media Query Hooks

```typescript
import { 
  useIsMobile, 
  useIsTablet, 
  useIsDesktop 
} from '@/hooks/useMediaQuery';
```

## 🔄 State Management

### Zustand Store Structure

```typescript
interface AppStore {
  auth: AuthSlice;        // Authentication state
  products: ProductSlice; // Product catalog state
  cart: CartSlice;        // Shopping cart state
  orders: OrderSlice;     // Order history state
  customer: CustomerSlice;// Customer profile state
  payment: PaymentSlice;  // Payment state
  notifications: NotificationSlice;
  ui: UISlice;           // UI state (theme, modals, etc.)
}
```

### Usage

```typescript
import { useStore } from '@/store';

function MyComponent() {
  const { items, addItem } = useStore((state) => state.cart);
  const isAuthenticated = useStore((state) => state.auth.isAuthenticated);
  
  // ...
}
```

## 🌐 API Integration

Service-specific Axios clients in `src/services/`:

```typescript
import { ApiServiceFactory } from '@/services';

const productService = ApiServiceFactory.getProductService();
const orderService = ApiServiceFactory.getOrderService();
```

## 🧪 Testing

### Unit Tests

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

test('renders button with text', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
});
```

### Property-Based Tests

```typescript
import fc from 'fast-check';

test('cart total equals sum of item subtotals', () => {
  fc.assert(
    fc.property(fc.array(cartItemArbitrary), (items) => {
      const cart = createCart(items);
      const expectedTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
      expect(cart.total).toBe(expectedTotal);
    })
  );
});
```

## 🏗️ Build & Deploy

### Build for Production

```bash
# Build all microfrontends
npm run build --prefix nexus-microfrontend
npm run build --prefix nexus-product
npm run build --prefix nexus-cart
# ... etc
```

### Environment Variables

Create `.env` files in each microfrontend:

```env
VITE_PRODUCT_SERVICE_URL=http://localhost:8081/api/products
VITE_ORDER_SERVICE_URL=http://localhost:8082/api/orders
VITE_CUSTOMER_SERVICE_URL=http://localhost:8083/api/customers
VITE_PAYMENT_SERVICE_URL=http://localhost:8084/api/payments
VITE_AUTH_SERVICE_URL=http://localhost:8085/api/auth
```

## 📚 Documentation

- [Architecture](./nexus-microfrontend/ARCHITECTURE.md)
- [Component Patterns](./nexus-microfrontend/src/components/patterns/README.md)
- [Error Handling](./nexus-microfrontend/ERROR_HANDLING.md)
- [Spec Documents](./.kiro/specs/ecommerce-mvp-upgrade/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ by the Nexus team

---
