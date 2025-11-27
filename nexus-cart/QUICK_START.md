# Cart Microfrontend - Quick Start Guide

## Installation

```bash
cd nexus-cart
npm install
```

## Development

### Run Standalone
```bash
npm run dev
```
Visit http://localhost:5174

### Run with Host Application

1. Start the cart microfrontend:
```bash
cd nexus-cart
npm run dev
```

2. Start the host application:
```bash
cd nexus-microfrontend
npm run dev
```

3. Visit http://localhost:5172

## Building

```bash
npm run build
```

## Testing

```bash
npm run test
```

## Usage in Host Application

### 1. Import Components

```typescript
import { lazy } from 'react';

const CartDrawer = lazy(() => import('cart/CartDrawer'));
const CartIcon = lazy(() => import('cart/CartIcon'));
```

### 2. Use CartIcon in Header

```typescript
import { useStore } from './store';

function Header() {
  const itemCount = useStore((state) => state.cart.itemCount);
  const setCartOpen = useStore((state) => state.ui.setCartOpen);

  return (
    <header>
      <CartIcon 
        itemCount={itemCount} 
        onClick={() => setCartOpen(true)} 
      />
    </header>
  );
}
```

### 3. Use CartDrawer in App

```typescript
import { useStore } from './store';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const isCartOpen = useStore((state) => state.ui.isCartOpen);
  const setCartOpen = useStore((state) => state.ui.setCartOpen);

  return (
    <>
      {/* Your app content */}
      
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setCartOpen(false)}
        useStore={useStore}
        onCheckout={() => navigate('/checkout')}
        onContinueShopping={() => setCartOpen(false)}
      />
    </>
  );
}
```

### 4. Add Items to Cart

```typescript
import { useStore } from './store';

function ProductCard({ product }) {
  const addItem = useStore((state) => state.cart.addItem);

  const handleAddToCart = () => {
    addItem(product, 1);
  };

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

## Cart Operations

### Add Item
```typescript
const addItem = useStore((state) => state.cart.addItem);
addItem(product, quantity);
```

### Remove Item
```typescript
const removeItem = useStore((state) => state.cart.removeItem);
removeItem(productId);
```

### Update Quantity
```typescript
const updateQuantity = useStore((state) => state.cart.updateQuantity);
updateQuantity(productId, newQuantity);
```

### Clear Cart
```typescript
const clearCart = useStore((state) => state.cart.clearCart);
clearCart();
```

### Get Cart State
```typescript
const cart = useStore((state) => state.cart);
console.log(cart.items);
console.log(cart.total);
console.log(cart.itemCount);
```

## Event Bus Integration

### Listen to Cart Events

```typescript
import { eventBus } from './utils/eventBus';

// Listen for cart updates
eventBus.subscribe('cart:updated', (data) => {
  console.log('Cart updated:', data);
});

// Listen for item added
eventBus.subscribe('cart:item-added', (data) => {
  console.log('Item added:', data);
});

// Listen for item removed
eventBus.subscribe('cart:item-removed', (data) => {
  console.log('Item removed:', data);
});
```

## Styling

The cart uses Tailwind CSS. To customize:

1. Edit `tailwind.config.js` for theme changes
2. Edit component files for layout changes
3. Edit `src/index.css` for global styles

## Troubleshooting

### Cart not loading
- Ensure cart microfrontend is running on port 5174
- Check Module Federation configuration in host
- Check browser console for errors

### Store not working
- Ensure Zustand is shared as singleton
- Ensure store is passed correctly to CartDrawer
- Check store structure matches expected interface

### Styles not applying
- Ensure Tailwind CSS is configured
- Check for CSS conflicts with host application
- Verify PostCSS is processing correctly

## API Reference

### CartIcon Props
```typescript
interface CartIconProps {
  itemCount: number;      // Number of items in cart
  onClick?: () => void;   // Click handler
  className?: string;     // Additional CSS classes
}
```

### CartDrawer Props
```typescript
interface CartDrawerProps {
  isOpen: boolean;                                    // Drawer open state
  onClose: () => void;                                // Close handler
  useStore: <T>(selector: (state: AppStore) => T) => T; // Zustand store hook
  onCheckout?: () => void;                            // Checkout handler
  onContinueShopping?: () => void;                    // Continue shopping handler
}
```

## Best Practices

1. **Always use the store**: Don't manage cart state locally
2. **Use event bus**: Communicate cart changes to other microfrontends
3. **Handle errors**: Wrap cart operations in try-catch
4. **Validate stock**: Check product stock before adding to cart
5. **Persist cart**: Cart automatically persists to localStorage
6. **Clear on logout**: Clear cart when user logs out
7. **Show feedback**: Display toast notifications for cart operations

## Examples

See the standalone app in `src/App.tsx` for a complete example.

## Support

For issues or questions, refer to:
- README.md - Full documentation
- IMPLEMENTATION_SUMMARY.md - Implementation details
- VERIFICATION.md - Testing and verification
