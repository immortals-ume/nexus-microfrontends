import { CheckoutWizard } from './components/CheckoutWizard';
import './index.css';
import type { AppStore, Product, CartItem } from './types';

// Mock store for standalone development
const mockStore = <T,>(selector: (state: AppStore) => T): T => {
  const mockProduct: Product = {
    id: '1',
    name: 'Premium Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 299.99,
    images: [
      {
        id: '1',
        url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
        alt: 'Headphones',
        isPrimary: true,
      },
    ],
    stock: 10,
  };

  const mockCartItem: CartItem = {
    id: '1',
    product: mockProduct,
    quantity: 2,
    subtotal: 599.98,
  };

  return selector({
    cart: {
      items: [mockCartItem],
      subtotal: 599.98,
      tax: 60.0,
      shipping: 0,
      total: 659.98,
      itemCount: 2,
      isLoading: false,
      error: null,
      clearCart: () => console.log('Cart cleared'),
      setLoading: () => {},
      setError: () => {},
      clearError: () => {},
    },
    auth: {
      user: {
        id: '1',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'customer',
      },
      token: 'mock-token',
      isAuthenticated: true,
    },
    payment: {
      paymentIntent: null,
      selectedMethod: null,
      isProcessing: false,
      error: null,
      setSelectedMethod: () => {},
      setProcessing: () => {},
      setError: () => {},
      clearError: () => {},
    },
    ui: {
      isCartOpen: false,
      theme: 'light' as const,
      isGlobalLoading: false,
      toggleCart: () => {},
      setTheme: () => {},
    },
  });
};

function App() {
  const handleOrderComplete = (order: any) => {
    console.log('Order completed:', order);
  };

  const handleContinueShopping = () => {
    console.log('Continue shopping clicked');
  };

  const handleViewOrder = (orderId: string) => {
    console.log('View order:', orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 py-4 px-6">
        <h1 className="text-2xl font-bold text-gray-900">Checkout Microfrontend</h1>
        <p className="text-sm text-gray-600">Standalone development mode</p>
      </div>

      <CheckoutWizard
        useStore={mockStore}
        onOrderComplete={handleOrderComplete}
        onContinueShopping={handleContinueShopping}
        onViewOrder={handleViewOrder}
      />
    </div>
  );
}

export default App;
