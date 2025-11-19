# Zustand Store Documentation

This directory contains the centralized state management implementation using Zustand for the Nexus E-commerce application.

## Architecture

The store is organized into service-aligned slices, each corresponding to a backend microservice:

- **auth**: Authentication state (auth-service backend)
- **products**: Product catalog state (product-service backend)
- **cart**: Shopping cart state (order-service backend - cart endpoints)
- **orders**: Order management state (order-service backend)
- **customer**: Customer profile state (customer-service backend)
- **payment**: Payment processing state (payment-service backend)
- **notifications**: Notification state (notification-service backend)
- **ui**: UI state (frontend-only)

## Features

### Persistence
The following slices are persisted to localStorage:
- **auth**: token, refreshToken, user, isAuthenticated
- **cart**: items, subtotal, tax, shipping, total, itemCount
- **ui**: theme

### DevTools
Redux DevTools integration is enabled for debugging state changes.

## Usage

### Basic Usage

```typescript
import { useStore } from '@/store';

function MyComponent() {
  // Subscribe to specific state
  const user = useStore((state) => state.auth.user);
  const cartItems = useStore((state) => state.cart.items);
  
  // Access actions
  const login = useStore((state) => state.auth.login);
  const addToCart = useStore((state) => state.cart.addItem);
  
  return (
    <div>
      <p>Welcome, {user?.firstName}</p>
      <button onClick={() => addToCart(product, 1)}>
        Add to Cart
      </button>
    </div>
  );
}
```

### Optimized Selectors

Use shallow equality for better performance:

```typescript
import { useStore } from '@/store';
import { shallow } from 'zustand/shallow';

function CartSummary() {
  // Only re-render when these specific values change
  const { subtotal, tax, total } = useStore(
    (state) => ({
      subtotal: state.cart.subtotal,
      tax: state.cart.tax,
      total: state.cart.total,
    }),
    shallow
  );
  
  return (
    <div>
      <p>Subtotal: ${subtotal}</p>
      <p>Tax: ${tax}</p>
      <p>Total: ${total}</p>
    </div>
  );
}
```

### Outside React Components

```typescript
import { useStore } from '@/store';

// Get current state
const state = useStore.getState();
console.log(state.auth.user);

// Call actions
useStore.getState().cart.addItem(product, 1);

// Subscribe to changes
const unsubscribe = useStore.subscribe(
  (state) => state.cart.itemCount,
  (itemCount) => {
    console.log('Cart item count:', itemCount);
  }
);

// Cleanup
unsubscribe();
```

## Slice Documentation

### Auth Slice

Manages user authentication state.

**State:**
- `user`: Current user object or null
- `token`: JWT access token
- `refreshToken`: JWT refresh token
- `isAuthenticated`: Boolean authentication status
- `isLoading`: Loading state for auth operations
- `error`: Error message if any

**Actions:**
- `login(credentials)`: Authenticate user
- `logout()`: Clear authentication state
- `register(data)`: Register new user
- `refreshAuthToken()`: Refresh expired token
- `setUser(user)`: Set user object
- `setToken(token, refreshToken)`: Set tokens
- `setError(error)`: Set error message
- `clearError()`: Clear error message

### Products Slice

Manages product catalog state.

**State:**
- `items`: Array of products
- `selectedProduct`: Currently selected product
- `filters`: Active product filters
- `isLoading`: Loading state
- `error`: Error message if any

**Actions:**
- `setItems(items)`: Set product list
- `setFilters(filters)`: Update filters
- `setSelectedProduct(product)`: Set selected product
- `setLoading(isLoading)`: Set loading state
- `setError(error)`: Set error message
- `clearError()`: Clear error message

### Cart Slice

Manages shopping cart state with automatic calculation of totals.

**State:**
- `items`: Array of cart items
- `subtotal`: Sum of all item subtotals
- `tax`: Calculated tax (10%)
- `shipping`: Shipping cost (free over $50)
- `total`: Final total
- `itemCount`: Total number of items
- `isLoading`: Loading state
- `error`: Error message if any

**Actions:**
- `addItem(product, quantity)`: Add item to cart
- `removeItem(productId)`: Remove item from cart
- `updateQuantity(productId, quantity)`: Update item quantity
- `clearCart()`: Clear all items
- `setLoading(isLoading)`: Set loading state
- `setError(error)`: Set error message
- `clearError()`: Clear error message

**Cart Calculations:**
- Subtotal: Sum of all item subtotals
- Tax: 10% of subtotal
- Shipping: $5.99 if subtotal < $50, otherwise free
- Total: Subtotal + Tax + Shipping

### Orders Slice

Manages order history and details.

**State:**
- `items`: Array of orders
- `selectedOrder`: Currently selected order
- `isLoading`: Loading state
- `error`: Error message if any

**Actions:**
- `setItems(items)`: Set order list
- `setSelectedOrder(order)`: Set selected order
- `setLoading(isLoading)`: Set loading state
- `setError(error)`: Set error message
- `clearError()`: Clear error message

### Customer Slice

Manages customer profile and preferences.

**State:**
- `profile`: User profile object
- `addresses`: Array of saved addresses
- `paymentMethods`: Array of saved payment methods
- `isLoading`: Loading state
- `error`: Error message if any

**Actions:**
- `setProfile(profile)`: Set user profile
- `setAddresses(addresses)`: Set addresses
- `setPaymentMethods(methods)`: Set payment methods
- `updateProfile(data)`: Update profile
- `setLoading(isLoading)`: Set loading state
- `setError(error)`: Set error message
- `clearError()`: Clear error message

### Payment Slice

Manages payment processing state.

**State:**
- `paymentIntent`: Current payment intent
- `selectedMethod`: Selected payment method
- `isProcessing`: Processing state
- `error`: Error message if any

**Actions:**
- `setPaymentIntent(intent)`: Set payment intent
- `setSelectedMethod(method)`: Set payment method
- `setProcessing(isProcessing)`: Set processing state
- `setError(error)`: Set error message
- `clearError()`: Clear error message

### Notifications Slice

Manages user notifications.

**State:**
- `items`: Array of notifications
- `unreadCount`: Number of unread notifications
- `isLoading`: Loading state
- `error`: Error message if any

**Actions:**
- `setItems(items)`: Set notifications (auto-calculates unread count)
- `markAsRead(id)`: Mark notification as read
- `markAllAsRead()`: Mark all notifications as read
- `setLoading(isLoading)`: Set loading state
- `setError(error)`: Set error message
- `clearError()`: Clear error message

### UI Slice

Manages UI state (frontend-only).

**State:**
- `isSidebarOpen`: Sidebar visibility
- `isCartOpen`: Cart drawer visibility
- `isMobileMenuOpen`: Mobile menu visibility
- `theme`: Current theme ('light' | 'dark')
- `isGlobalLoading`: Global loading indicator
- `activeRequests`: Number of active API requests

**Actions:**
- `toggleSidebar()`: Toggle sidebar
- `toggleCart()`: Toggle cart drawer
- `toggleMobileMenu()`: Toggle mobile menu
- `setTheme(theme)`: Set theme
- `incrementRequests()`: Increment active requests
- `decrementRequests()`: Decrement active requests
- `setSidebarOpen(isOpen)`: Set sidebar state
- `setCartOpen(isOpen)`: Set cart state
- `setMobileMenuOpen(isOpen)`: Set mobile menu state

## Best Practices

1. **Use Selectors**: Always use selector functions to subscribe to specific state slices
2. **Shallow Equality**: Use `shallow` for objects to prevent unnecessary re-renders
3. **Error Handling**: Always clear errors after displaying them to users
4. **Loading States**: Set loading states before async operations
5. **Persistence**: Only persist necessary data to localStorage
6. **Type Safety**: Use TypeScript types for all state and actions

## Testing

The store includes comprehensive unit tests covering all slices and their interactions. Run tests with:

```bash
npm test -- store.test.ts
```

## Future Enhancements

- Integration with event bus for microfrontend communication
- API service layer integration
- React Query integration for server state
- Optimistic updates for mutations
- Undo/redo functionality
- Time-travel debugging
