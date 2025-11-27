import { useState } from 'react';
import { CartDrawer } from './components/CartDrawer';
import { CartIcon } from './components/CartIcon';
import './index.css';
import type { AppStore } from './types';

const mockStore = <T,>(selector: (state: AppStore) => T): T => selector({
  cart: {
    items: [],
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
    isLoading: false,
    error: null,
    addItem: () => {},
    removeItem: () => {},
    updateQuantity: () => {},
    clearCart: () => {},
    setLoading: () => {},
    setError: () => {},
    clearError: () => {},
  },
  ui: {
    isSidebarOpen: false,
    isCartOpen: false,
    isMobileMenuOpen: false,
    theme: 'light' as const,
    isGlobalLoading: false,
    activeRequests: 0,
    toggleSidebar: () => {},
    toggleCart: () => {},
    toggleMobileMenu: () => {},
    setTheme: () => {},
    incrementRequests: () => {},
    decrementRequests: () => {},
    setSidebarOpen: () => {},
    setCartOpen: () => {},
    setMobileMenuOpen: () => {},
  },
});

function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Cart Microfrontend</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            This is the standalone cart microfrontend. Click the cart icon to open the drawer.
          </p>
          
          <div className="flex items-center gap-4">
            <CartIcon itemCount={0} onClick={() => setIsOpen(true)} />
            <span className="text-sm text-gray-500">Cart Icon Component</span>
          </div>
        </div>

        <CartDrawer
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          useStore={mockStore}
          onCheckout={() => console.log('Checkout clicked')}
          onContinueShopping={() => console.log('Continue shopping clicked')}
        />
      </div>
    </div>
  );
}

export default App;
