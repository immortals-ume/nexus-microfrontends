import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { EmptyCart } from './EmptyCart';
import type { AppStore, CartItem as CartItemType } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  useStore: <T>(selector: (state: AppStore) => T) => T;
  onCheckout?: () => void;
  onContinueShopping?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  useStore,
  onCheckout,
  onContinueShopping,
}) => {
  const { items, subtotal, tax, shipping, total, itemCount } = useStore((state) => state.cart);
  const { updateQuantity, removeItem } = useStore((state) => state.cart);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleCheckout = () => {
    onCheckout?.();
    onClose();
  };

  const handleContinueShopping = () => {
    onContinueShopping?.();
    onClose();
  };

  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        className={cn(
          'fixed inset-0 bg-black/50 backdrop-blur-sm z-40',
          'transition-opacity duration-300 ease-in-out',
          isOpen ? 'opacity-100 animate-fade-in' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer with slide animation */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-full sm:w-96 md:w-[28rem] bg-white dark:bg-gray-800 z-50',
          'shadow-2xl',
          'flex flex-col',
          'transition-transform duration-300 ease-out',
          isOpen ? 'translate-x-0 animate-slide-in-right' : 'translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 id="cart-drawer-title" className="text-lg font-semibold text-gray-900">
            Shopping Cart {itemCount > 0 && `(${itemCount})`}
          </h2>
          <button
            onClick={onClose}
            className={cn(
              'p-2 rounded-full',
              'text-gray-400 hover:text-gray-600',
              'hover:bg-gray-100',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-primary-500'
            )}
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <EmptyCart onContinueShopping={handleContinueShopping} />
          ) : (
            <div className="space-y-4">
              {items.map((item: CartItemType) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer with Summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <CartSummary
              subtotal={subtotal}
              tax={tax}
              shipping={shipping}
              total={total}
              onCheckout={handleCheckout}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
