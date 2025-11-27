import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { cn, formatCurrency } from '../lib/utils';
import type { CartItem as CartItemType } from '../types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  const { product, quantity, subtotal } = item;
  const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(product.id, quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < product.stock) {
      onUpdateQuantity(product.id, quantity + 1);
    }
  };

  return (
    <div
      className={cn(
        'flex gap-4 p-4',
        'bg-white rounded-lg',
        'border border-gray-200',
        'hover:border-gray-300',
        'transition-colors duration-200'
      )}
    >
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={primaryImage?.url || '/placeholder.png'}
          alt={primaryImage?.alt || product.name}
          className="w-20 h-20 object-cover rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {product.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formatCurrency(product.price)} each
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemove(product.id)}
            className={cn(
              'flex-shrink-0',
              'p-1 rounded-full',
              'text-gray-400 hover:text-red-600',
              'hover:bg-red-50',
              'transition-colors duration-200',
              'focus:outline-none focus:ring-2 focus:ring-red-500'
            )}
            aria-label="Remove item"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quantity Controls and Subtotal */}
        <div className="flex justify-between items-center mt-3">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              disabled={quantity <= 1}
              className={cn(
                'w-8 h-8 rounded-md',
                'flex items-center justify-center',
                'border border-gray-300',
                'text-gray-600 hover:text-gray-900',
                'hover:bg-gray-50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500'
              )}
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>

            <span className="w-8 text-center text-sm font-medium text-gray-900">
              {quantity}
            </span>

            <button
              onClick={handleIncrement}
              disabled={quantity >= product.stock}
              className={cn(
                'w-8 h-8 rounded-md',
                'flex items-center justify-center',
                'border border-gray-300',
                'text-gray-600 hover:text-gray-900',
                'hover:bg-gray-50',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-colors duration-200',
                'focus:outline-none focus:ring-2 focus:ring-primary-500'
              )}
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Subtotal */}
          <div className="text-sm font-semibold text-gray-900">
            {formatCurrency(subtotal)}
          </div>
        </div>

        {/* Stock Warning */}
        {quantity >= product.stock && (
          <p className="text-xs text-amber-600 mt-2">
            Maximum stock reached
          </p>
        )}
      </div>
    </div>
  );
};

export default CartItem;
