import React from 'react';
import { cn, formatCurrency } from '../lib/utils';

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  onCheckout?: () => void;
  className?: string;
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  tax,
  shipping,
  total,
  onCheckout,
  className,
}) => {
  return (
    <div className={cn('space-y-4', className)}>
      {/* Summary Lines */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900 font-medium">{formatCurrency(subtotal)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (10%)</span>
          <span className="text-gray-900 font-medium">{formatCurrency(tax)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900 font-medium">
            {shipping === 0 ? (
              <span className="text-emerald-600 font-semibold">FREE</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        {/* Free Shipping Message */}
        {subtotal > 0 && subtotal < 50 && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded-md">
            Add {formatCurrency(50 - subtotal)} more for free shipping!
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200" />

      {/* Total */}
      <div className="flex justify-between items-center">
        <span className="text-base font-semibold text-gray-900">Total</span>
        <span className="text-xl font-bold text-gray-900">{formatCurrency(total)}</span>
      </div>

      {/* Checkout Button */}
      {onCheckout && (
        <button
          onClick={onCheckout}
          disabled={subtotal === 0}
          className={cn(
            'w-full py-3 px-6 rounded-lg',
            'bg-primary-600 text-white font-semibold',
            'shadow-md hover:shadow-lg',
            'hover:bg-primary-700 hover:scale-[1.02]',
            'active:scale-[0.98]',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
          )}
        >
          Proceed to Checkout
        </button>
      )}
    </div>
  );
};

export default CartSummary;
