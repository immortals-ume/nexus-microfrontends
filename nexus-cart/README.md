# Nexus Cart Microfrontend

The Cart microfrontend provides shopping cart functionality for the Nexus e-commerce platform.

## Features

- **CartDrawer**: Slide-out cart panel with smooth animations
- **CartIcon**: Header cart icon with item count badge
- **CartItem**: Individual cart item with quantity controls
- **CartSummary**: Cart totals with subtotal, tax, shipping, and total
- **EmptyCart**: Empty cart state with call-to-action

## Exposed Components

This microfrontend exposes the following components via Module Federation:

- `./CartDrawer` - Main cart drawer component
- `./CartIcon` - Cart icon with badge

## Integration

### In Host Application

```typescript
import { lazy } from 'react';

const CartDrawer = lazy(() => import('cart/CartDrawer'));
const CartIcon = lazy(() => import('cart/CartIcon'));

// Use in your app
<CartIcon 
  itemCount={cartItemCount} 
  onClick={() => setCartOpen(true)} 
/>

<CartDrawer
  isOpen={isCartOpen}
  onClose={() => setCartOpen(false)}
  useStore={useStore}
  onCheckout={() => navigate('/checkout')}
  onContinueShopping={() => setCartOpen(false)}
/>
```

## State Management

The cart microfrontend uses Zustand store from the host application. It expects the following store structure:

```typescript
interface AppStore {
  cart: {
    items: CartItem[];
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
    itemCount: number;
    addItem: (product: Product, quantity: number) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
  };
  ui: {
    isCartOpen: boolean;
    setCartOpen: (isOpen: boolean) => void;
  };
}
```

## Cart Logic

### Calculations

- **Subtotal**: Sum of all item subtotals
- **Tax**: 10% of subtotal
- **Shipping**: $5.99 (free over $50)
- **Total**: Subtotal + Tax + Shipping

### Features

- Add/remove items
- Update quantities with +/- buttons
- Automatic cart persistence to localStorage
- Event bus integration for cross-microfrontend communication
- Stock validation
- Free shipping threshold indicator

## Development

```bash
# Install dependencies
npm install

# Run development server (port 5174)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Port

This microfrontend runs on port **5174**.

## Dependencies

- React 19
- Zustand (shared from host)
- Tailwind CSS
- Lucide React (icons)
- Module Federation

## Events

The cart emits the following events via the event bus:

- `cart:updated` - When cart state changes
- `cart:item-added` - When an item is added
- `cart:item-removed` - When an item is removed
